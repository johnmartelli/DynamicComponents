<template>
    <ejs-schedule
        :width="scheduleWidth"
        :height="scheduleHeight"
        :selectedDate="selectedDate"
        :eventSettings="eventSettings"
        :timezone="timezone"
        :at-am-schedule="atAttribute"
        class="am-schedule"
    >
        <e-views>
            <e-view option="Day"></e-view>
            <e-view option="Week"></e-view>
            <e-view option="Month"></e-view>
            <e-view option="Agenda"></e-view>
        </e-views>
    </ejs-schedule>
</template>

<script setup>
import { provide, reactive, ref, toRefs } from 'vue';
import {
    Day,
    Week,
    Month,
    Agenda,
    ViewDirective as EView,
    ViewsDirective as EViews,
    ScheduleComponent as EjsSchedule
} from '@syncfusion/ej2-vue-schedule';
import { DataManager, CustomDataAdaptor } from '@syncfusion/ej2-data';
import { api } from '@/services/api.service.js';

provide('schedule', [Day, Week, Month, Agenda]);

defineOptions({
    name: 'AmSchedule',
    inheritAttrs: false
});

const props = defineProps({
    apiUrl: {
        type: String,
        required: true
    },
    selectedDate: {
        type: Date,
        default: new Date()
    },
    scheduleHeight: {
        type: String,
        default: ''
    },
    scheduleWidth: {
        type: String,
        default: '100%'
    },
    /**
     * AQA attribute
     */
    atAttribute: {
        type: String,
        default: ''
    }
});

const currentView = ref('Week');
const timezone = ref('UTC');

const isInitialRequest = ref(true);

const customDataAdaptor = new CustomDataAdaptor({
    getData: fetchScheduleData,
    addRecord: () => {
        console.log('addRecord');
    },
    updateRecord: () => {
        console.log('updateRecord');
    },
    deleteRecord: () => {
        console.log('deleteRecord');
    },
    batchUpdate: (...args) => {
        console.log('batchUpdate', args);
    }
});

const dataManager = new DataManager({
    url: props.apiUrl,
    adaptor: customDataAdaptor,
    crossDomain: true
});

const eventSettings = reactive({
    dataSource: dataManager,
    fields: {
        id: 'id',
        subject: { name: 'Employees_SurnameAndName' },
        description: { name: 'Absences_Types' },
        startTime: { name: 'Absences_StartDate' },
        endTime: { name: 'Absences_EndDate' },
    }
});

const isFetchScheduleDataLoading = ref(false);

async function fetchScheduleData(option) {
    console.log('fetchScheduleData option: ', option);
    isFetchScheduleDataLoading.value = true;

    try {
        const response = await api.get(props.apiUrl, [], {
            pageNumber: 1,
            rowNumber: 100,
            paging: true,
        }, {}, true);

        const { data = [], view = {}, count = 0 } = response;

        if (isInitialRequest.value) {
            const [startDateConfig, endDateConfig, contentConfig] = view?.tabs?.[0]?.titles || [];
            eventSettings.fields.startTime = { name: startDateConfig?.fields?.[0]?.tagName };
            eventSettings.fields.endTime = { name: endDateConfig?.fields?.[0]?.tagName };
            console.log('startDateConfig: ', startDateConfig);
            console.log('endDateConfig: ', endDateConfig);
            console.log('contentConfig: ', contentConfig);
        }

        return option.onSuccess(data, {});
    } catch (error) {
        return Promise.reject(error);
    } finally {
        // if (isInitialRequest.value) {
        //     isInitialRequest.value = false;
        // }
        isFetchScheduleDataLoading.value = false;
    }
}
</script>

<style>
@import '../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-calendars/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../../node_modules/@syncfusion/ej2-vue-schedule/styles/material.css';
</style>
