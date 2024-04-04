<template>
    <Autocomplete
        v-model="selectedItem"
        :multiple="true"
        :suggestions="filteredItems"
        option-label="name"
        placeholder="Start typing..."
        @complete="search"
        @change="updateSelectedValues"
    />
    <input
        v-model="selectedValues"
        :id="inputId"
        :name="inputName"
        type="hidden"
    />
</template>

<script setup>
import {
    ref,
    watchEffect,
    onMounted
} from 'vue';

import Autocomplete from 'primevue/autocomplete';

import { api } from '@/services/api.service.js';

defineOptions({
    name: 'AmAutocomplete',
    inheritAttrs: false
});

const props = defineProps({
    apiUrl: {
        type: String,
        required: true
    },
    inputId: {
        type: String,
        required: true
    },
    inputName: {
        type: String,
        required: true
    },
    initialValue: {
        type: String,
        required: true
    }
});
const selectedItem = ref('');
const filteredItems = ref([]);
const selectedValues = ref([]);
const items = ref([]);

const fetchItems = async () => {
    try {
        const response = await api.get(props.apiUrl);
        const { data = [] } = response;
        items.value = data;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
};

onMounted(fetchItems); // Fetch items when component is mounted

const search = (event) => {
    // Search for typed text among items
    filteredItems.value = items.value.filter(item =>
        item['name'].toLowerCase().includes(event.query.toLowerCase())
    );
};

// Update selected values when autocomplete selection changes
const updateSelectedValues = (event) => {
    selectedValues.value = event.value.map(item => item.id);
};

// Watch for changes to initialValue and items array, then update selectedItem
watchEffect(() => {
    if (props.initialValue && items.value.length > 0) {
        selectedValues.value = props.initialValue.split(',');
        selectedItem.value = items.value.filter(item => props.initialValue.includes(item.id));
    }
});
</script>
