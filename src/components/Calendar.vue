<template>
    <div class="schedule-vue-sample">
        <div class="col-md-12 control-section">
            <div class="content-wrapper">
                <ejs-schedule id='Schedule' height="450px" :eventSettings='eventSettings' :currentView="currentView"
                    :readonly="readonly"></ejs-schedule>
            </div>
        </div>

    </div>
</template>

<script setup>
import { provide, ref, onMounted } from "vue";
import { DataManager, WebApiAdaptor, CustomDataAdaptor, Query } from '@syncfusion/ej2-data';
import { ScheduleComponent as EjsSchedule, Day, Week, WorkWeek, Month, Agenda } from "@syncfusion/ej2-vue-schedule";

const token = ref(null);

const urlGetToken = '/api/v3/REST/authentication/getToken'
const urlGetCorsi = '/api/v3/REST/views/Absences/Calendario_richieste_feriepermessi_custom?pageNumber=1&rowNumber=100&paging=true';
const strUsername = ''
const strPassword = ''


var oCustomDataAdaptor = new CustomDataAdaptor({
    getData: function (option) {
        console.log("CustomDataAdaptor.getData")
        GetTokenA().then(() => {
            let request;
            fetch(urlGetCorsi, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'token': token.value,
                    'structure': 'false',
                    'Accept': 'application/json'
                },
            }).then((response) => {
                if (response.status >= 200 && response.status <= 299) {
                    return response.json();
                }
            }).then((data) => {
                const dataMapped = data.data.map((item, index) => ({
                    Id: index + 1,
                    Subject: `${item['Absences_Types']} - ${item['Employees_SurnameAndName'].split(' ')[1]}`,
                    StartTime: new Date(item['Absences_StartDate']),
                    EndTime: new Date(item['Absences_EndDate']),
                    //OwnerId: item['Employees_SurnameAndName']
                }));

                const transformedResponse = {
                    result: dataMapped, // Use the data array from the original response
                    count: parseInt(100, 10) // Ensure count is an integer
                };
                console.log(transformedResponse);
                option.onSuccess(transformedResponse, request);
            }).catch((error) => {
                console.log(error);
                option.onFailure(request);
            });
        });
    },
    process: function (data) {
        console.log("CustomDataAdaptor.process")
    }
});

var dataManager = new DataManager({
    url: 'https://services.syncfusion.com/vue/production/api/schedule',
    //adaptor: new WebApiAdaptor,
    url: urlGetCorsi,
    adaptor: oCustomDataAdaptor,
    crossDomain: true
}).executeQuery(new Query().take(8)).then((e) => {
    //e.result will contain the records
});

async function GetTokenA() {
    if (token.value) {
        console.log(`GetToken. Token already valid`);
        return;
    }
    console.log(`GetToken. Begin fetching data`);
    // Define your custom headers here
    const headers = new Headers({
        'Username': strUsername,
        'Password': strPassword,
        'LoginRequest': '1',
        'structure': 'false'
        // Add other headers as needed
    });

    // Include the headers in your fetch request
    const response = await fetch(urlGetToken, {
        method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
        headers: headers,
    });
    //Did we get a valid response?
    if (!response.ok) {
        console.log(`Error while authenticating: ${response.status}`);
        throw new Error(`Error while authenticating: ${response.status}`);
    }
    //Read the json and the token
    const json = await response.json();
    token.value = json.data[0].token
    console.log(token.value);
};

const readonly = true;
const eventSettings = { dataSource: dataManager };
const currentView = 'Month';
provide('schedule', [Day, Week, WorkWeek, Month, Agenda]);



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