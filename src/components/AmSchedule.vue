<template>
    <ejs-schedule
        :width="scheduleWidth"
        :height="scheduleHeight"
        :selectedDate='selectedDate'
        :eventSettings='eventSettings'
        :at-am-schedule="atAttribute"
        class="am-schedule"
    >
        <e-views>
            <e-view option='Day'></e-view>
            <e-view option='Week'></e-view>
            <e-view option='WorkWeek'></e-view>
            <e-view option='Month'></e-view>
            <e-view option='Agenda'></e-view>
        </e-views>
        <e-resources>
            <e-resource
                field="OwnerId"
                title="Owner"
                name="Owners"
                :dataSource="ownerDataSource"
                textField="OwnerText"
                idField="Id"
                colorField="OwnerColor"
            />
        </e-resources>
    </ejs-schedule>
</template>

<script setup>
import { provide, ref } from 'vue';
import {
    Day,
    Week,
    Month,
    Agenda,
    WorkWeek,
    ViewDirective as EView,
    ViewsDirective as EViews,
    ResourceDirective as EResource,
    ScheduleComponent as EjsSchedule,
    ResourcesDirective as EResources
} from "@syncfusion/ej2-vue-schedule";
import { api } from '@/services/api.service.js';
import { initialFetchData } from '@/helpers/initialFetchData.helper.js';

provide('schedule', [Day, Week, WorkWeek, Month, Agenda]);

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

const selectedDate = new Date(2023, 7, 8);
const eventSettings = {
    dataSource: [
        {
            Id: 1,
            Subject: 'Surgery - Andrew',
            EventType: 'Confirmed',
            StartTime: new Date(2023, 7, 10, 9, 0),
            EndTime: new Date(2023, 7, 10, 10, 0),
            OwnerId: 2
        },
        {
            Id: 2,
            Subject: 'Consulting - John',
            EventType: 'Confirmed',
            StartTime: new Date(2023, 7, 9, 10, 0),
            EndTime: new Date(2023, 7, 9, 11, 30),
            OwnerId: 3
        },
        {
            Id: 3,
            Subject: 'Therapy - Robert',
            EventType: 'Requested',
            StartTime: new Date(2023, 7, 8, 11, 30),
            EndTime: new Date(2023, 7, 8, 12, 30),
            OwnerId: 1
        }
    ]
};
const ownerDataSource = [
    { OwnerText: "Nancy", Id: 1, OwnerColor: "#ffaa00" },
    { OwnerText: "Steven", Id: 2, OwnerColor: "#f8a398" },
    { OwnerText: "Michael", Id: 3, OwnerColor: "#7499e1" }
];

const isFetchScheduleDataLoading = ref(false);

async function fetchScheduleData() {
    isFetchScheduleDataLoading.value = true;

    try {
        const response = await api.get(props.apiUrl, [], {
            pageNumber: 1,
            rowNumber: 100,
            paging: true,
        }, {}, true);

        const { data = [], view = {}, count = 0 } = response;

        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    } finally {
        isFetchScheduleDataLoading.value = false;
    }
}

initialFetchData(fetchScheduleData);
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
