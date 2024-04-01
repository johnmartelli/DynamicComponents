import { createApp } from 'vue'
import PrimeVue from 'primevue/config';

const componentMap = {
    'am-calendar': () => import('./components/Calendar.vue'),
    'am-chart': () => import('./components/Chart.vue'),
    'am-datetimepicker': () => import('./components/DateTimePicker.vue'),
};

//createApp(App).mount('#app')
document.addEventListener('DOMContentLoaded', () => {
    for (const [attr, loadComponent] of Object.entries(componentMap)) {
        document.querySelectorAll(`[${attr}]`).forEach(async el => {
            // Dynamically import the Vue component
            const { default: Component } = await loadComponent();
            //Maop the attributes to properties
            let propsData = getProperties(el);
            //Add the id property
            propsData['id'] = el.getAttribute(attr);
            // Create and mount the Vue app
            var app = createApp(Component, propsData);
            //We add this to all instances of an app even tough prime vuew may not be involved
            app.use(PrimeVue);
            app.mount(el)

        });
    }
});

function getProperties(el) {
    let propsData = {};
    // For each attribute in the element...
    Array.from(el.attributes).forEach(attr => {
        // Check if the attribute is intended as a prop
        if (attr.name.startsWith('amprop-')) {
            // Extract the prop name, removing the 'data-prop-' prefix
            const propName = attr.name.slice('amprop-'.length);
            console.log(propName + ":" + attr.value)
            // Add the prop to the propsData object, converting the value if necessary
            // Vue will automatically convert between kebab case and camel case, for example selected-date will become
            propsData[propName] = attr.value; // You might need to convert the value based on the expected prop type
        }
    });

    return propsData;
}