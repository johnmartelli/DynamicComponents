<!-- :group='group'    :readOnly='readOnly'-->
<template>
  <ejs-schedule :height='height' width='100%' :selectedDate='selectedDate' :eventSettings='eventSettings' :includeFiltersInQuery='includeFiltersInQuery'>
    <!--<e-views>
      <e-view option='Day'></e-view>
      <e-view option='Week'></e-view>
      <e-view option='WorkWeek'></e-view>
      <e-view option='Month'></e-view>
      <e-view option='Agenda'></e-view>
      <e-view option='TimelineWorkWeek'></e-view>
      <e-view option='TimelineMonth'></e-view>
    </e-views>
    <e-resources>
      <e-resource field="OwnerId" title="Owner" name="Owners" :dataSource="ownerDataSource" textField="OwnerText"
        idField="Id" colorField="OwnerColor">
      </e-resource>
    </e-resources>-->
  </ejs-schedule>
</template>

<script setup>
import { provide, ref, onMounted } from "vue";
import {
  ScheduleComponent as EjsSchedule, ViewsDirective as EViews, ViewDirective as EView,
  ResourcesDirective as EResources, ResourceDirective as EResource,
  Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth
} from "@syncfusion/ej2-vue-schedule";
import { MagicString } from "vue/compiler-sfc";
import { DataManager, Query, CustomDataAdaptor, ODataV4Adaptor, UrlAdaptor } from '@syncfusion/ej2-data';

provide('schedule', [Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth]);

//import { defineProps } from 'vue';
// Define props using defineProps
const props = defineProps({
  selectedDate: {
    type: Date,
    default: new Date()
  },
  height: {
    type: String,
    default: ''
  },
  // You can add more props here
});

const group = {
  resources: ['Owners']
};
/*
const selectedDate = new Date(2023, 7, 8);
const eventSettingsStatic = {
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
*/

/*const ownerDataSource = [
  { OwnerText: "Menozzi Pietro", Id: "Menozzi Pietro", OwnerColor: "#ffaa00" },
  { OwnerText: "Green Alice", Id: "Green Alice", OwnerColor: "#f8a398" },
  { OwnerText: "Morales Paula", Id: "Morales Paula", OwnerColor: "#7499e1" }
];*/
const data = ref(null);
const error = ref(null);
const loading = ref(false);
const token = ref(null);
//const eventSettings = ref(null);
//const selectedDate = ref(null);
const ownerDataSource = ref(null);
//const readOnly = ref(true);
const readOnly = true;
//const selectedDate = new Date(1996, 6, 9);
const selectedDate = props.selectedDate;
const includeFiltersInQuery = true;
/*const eventSettings = { dataSource: GetDataManager(),
                 fields: {
                        id: 'id',
                        subject: { name: 'Employees_SurnameAndName' },
                        //location: { name: 'ShipCountry' },
                        description: { name: 'Absences_Types' },
                        startTime: { name: 'Absences_StartDate' },
                        endTime: { name: 'Absences_EndDate' },
                        //recurrenceRule: { name: 'ShipRegion' }
                    }  };*/

/*const urlGetToken = 'https://localhost:44307/api/v2/REST/GetToken'
const urlGetCorsi = 'https://localhost:44307/api/v2/REST/Calendario.richieste.feriepermessi.custom';
const strUsername = 'Mar1v@yopmail.com'
const strPassword = 'ciao'*/
const urlGetToken = '/api/v3/REST/authentication/getToken'
const urlGetCorsi = '/api/v3/REST/views/Absences/Calendario_richieste_feriepermessi_custom?pageNumber=1&rowNumber=100&paging=true';
const strUsername = 'john.martelli@altamirahrm.com'
const strPassword = '2s8IhfmODAAM9CFg8oqa'

var oCustomDataAdaptor = new CustomDataAdaptor({
  getData: function (option) {
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
        const transformedResponse = {
          result: data.data, // Use the data array from the original response
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
});

// CustomDataAdapter.js
class CustomDataAdapter extends UrlAdaptor {
  processResponse(data, ds, query, xhr, request, changes) {
    console.log("processResponse");
    // Here, you can transform the data fetched from the API as needed
    const transformedData = data.map(item => ({
      Id: item.customId,
      Subject: item.customSubject,
      StartTime: new Date(item.customStart),
      EndTime: new Date(item.customEnd),
      // map other fields as necessary
    }));

    // Call the base class's processResponse with the transformed data
    return super.processResponse(transformedData, ds, query, xhr, request, changes);
  }

  // Override other methods as necessary, for example, to fetch data
  /*doAjaxRequest(options) {
    // Use axios or fetch to get data from your API
    console.log(urlGetToken);

  }*/

  beforeSend(args, xhr, settings) {
    //console.log(request);
    //console.log(dm);
    try {
      //Are we logged in?
      if (token.value) {
        console.log("User already logged in");
        return;
      }
      //Log the user in
      fetch(urlGetToken, {
        headers: {
          'Username': strUsername,
          'Password': strPassword,
          'LoginRequest': '1',
          'structure': 'false'

        }

      }).then(response => {
        //console.log(response);
        return response.json()
      }).then((data) => {
        console.log(data);
        token.value = data.data[0].token;
        console.log(token.value);
        var newFetchRequest = new Request(settings.url, {

          method: "GET",

          headers: {
            'token': token.value,
            'structure': 'false'
          },

        });

        settings.fetchRequest = newFetchRequest;
        //option.onSuccess(transformedResponse, request);
      }).catch((error) => {
        console.log(error);

        //option.onFailure(request);
      });
      //request.setRequestHeader('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiam9obi5tYXJ0ZWxsaUBhbHRhbWlyYWhybS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjE5MDQ5MzIxNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFsdGFtaXJhIiwibmJmIjoxNzExOTY5Njk3LCJleHAiOjE3MTE5OTk2OTcsImlzcyI6IkFsdGFtaXJhIiwiYXVkIjoiQW55b25lIn0.fcQr4gxC0K60IIwYRqTVZMiJvNn1uylHLlC3jjJIeLw");
      //console.log(request);
      //request.setRequestHeader('structure', 'false');


    }
    catch (error) {
      // Handle or log the error as needed
      console.error('Error setting request headers:', error);
      // Depending on your application's needs, you might want to throw the error,
      // or handle it gracefully if setting the header isn't critical.
    }
    //console.log(request);
    //request.setRequestHeader('Content-Type', 'application/json');

  }

  /*
      axios.get(url, {headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiam9obi5tYXJ0ZWxsaUBhbHRhbWlyYWhybS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjE5MDQ5MzIxNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFsdGFtaXJhIiwibmJmIjoxNzExOTIzMjgxLCJleHAiOjE3MTE5NTMyODEsImlzcyI6IkFsdGFtaXJhIiwiYXVkIjoiQW55b25lIn0.lGHWkjPZJWmh7-jfkcBh8suaa5rTimCIR3X_RBTYEc0",//token.value,
      'structure': 'false',
      'Accept': 'application/json'
  
    }
  }).then(response => {
        // Assuming the API response is directly usable or has been transformed appropriately
        return response.data;
      });
    }*/
}

/*
class CustomAdaptor extends ODataV4Adaptor {
  processResponse() {
    let i = 0;
    // calling base class processResponse function
    let original = super.processResponse.apply(this, arguments);
    // adding employee id
    original.forEach((item) => item['EventID'] = ++i);
    return original;
  }
}*/
let dataManager = new DataManager({
  url: urlGetCorsi,
  adaptor: oCustomDataAdaptor,
  method: "GET",
  crossDomain: true
});
const eventSettings = {
  dataSource: dataManager,
  fields: {
    id: 'id',
    subject: { name: 'Employees_SurnameAndName' },
    //location: { name: 'ShipCountry' },
    description: { name: 'Absences_Types' },
    startTime: { name: 'Absences_StartDate' },
    endTime: { name: 'Absences_EndDate' },
    //eventType: 'Confirmed',
    //OwnerId: { name: 'Employees_SurnameAndName' },
    //recurrenceRule: { name: 'ShipRegion' }
  }
}

const main = async () => {
  //GetDataManager();
  //console.log(eventSettings);
}
async function GetTokenA() {
  if(token.value){
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

const GetToken = async () => {
  //function GetToken() {
  //try {
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
  const response = fetch(urlGetToken, {
    method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
    headers: headers,
    // If you have a body, for POST or PUT requests, include it here
    // body: JSON.stringify(yourRequestBody),
  }).then((response) => {

    console.log(`GetToken. Data fetched`);
    if (!response.ok) {
      console.log(`Error: ${response.status}`);
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  }).then((response) => {
    console.log("GetToken. responseJSON.data.token:")
    token.value = response.data[0].token
    console.log(token.value);
    //console.log(response);

  }).catch((error) => {
    console.log(error);
    option.onFailure(request);
  });
  /*} catch (err) {
    error.value = err.message;
    console.log("GetToken. error.value:" + error.value);
  } finally {
    loading.value = false;
  }*/
};

const fetchData = async () => {
  loading.value = true;
  data.value = null; // Reset data
  error.value = null; // Reset error
  //Have we logged in?
  if (token.value == null) {
    console.log(`fetchData. Token is null: authenticating`);
    await GetToken();
  }
  try {
    console.log(`fetchData. Begin fetching data`);
    // Define your custom headers here
    const headers = new Headers({
      'token': token.value,
      'pageNumber': '1',
      'rowNumber': '100',
      'paging': 'true',
      'structure': 'false',
      'Accept': 'application/json'
      // Add other headers as needed
    });

    // Include the headers in your fetch request
    const response = await fetch(urlGetCorsi, {
      method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
      headers: headers,
      // If you have a body, for POST or PUT requests, include it here
      // body: JSON.stringify(yourRequestBody),
    });

    console.log(`fetchData. Data fetched`);
    if (!response.ok) {
      var oError = await response.json();
      if (oError.ErrorMessage)
        console.log(`Error: ${oError.ErrorMessage}`);
      else
        console.log(oError);
      throw new Error(`Error: ${oError.ErrorMessage}`);
    }
    data.value = await response.json();
  } catch (err) {
    error.value = err.message;
    console.log("fetchData. error.value:" + error.value);
  } finally {
    loading.value = false;
  }
  //Now transform the data
  var oDataTransformed = transformData(data.value);
  console.log(oDataTransformed);
  /*console.log(JSON.stringify(oDataTransformed, null, 2));
  console.log(JSON.stringify(eventSettingsStatic, null, 2));*/
  var oGroups = getGroups(data.value.data);
  ownerDataSource.value = oGroups;
  console.log(oGroups);

  eventSettings.value = oDataTransformed;
  //selectedDate.value = new Date(2024, 3, 12);
  selectedDate.value = findEarliestDate(oDataTransformed.dataSource);

  //eventSettings.value = eventSettingsStatic;
  //selectedDate.value = new Date(2023, 7, 8);
};

function transformData(originalData) {
  const dataSource = originalData.data.map((item, index) => ({
    Id: index + 1,
    Subject: `${item['Absences_Types']} - ${item['Employees_SurnameAndName'].split(' ')[1]}`,
    //EventType: item['status'].statusName,
    EventType: 'Confirmed',
    StartTime: new Date(item['Absences_StartDate']),
    EndTime: new Date(item['Absences_EndDate']),
    OwnerId: item['Employees_SurnameAndName']
  }));

  return { dataSource };
}

function getGroups(originalData) {

  const oGroups = [...new Set(originalData.map(item => item.Employees_SurnameAndName))];
  //console.log(uniqueNames);

  const colors = ["#ffaa00", "#f8a398", "#7499e1", "#cccccc", "#ade1f8", "#98f898", "#f898f8"];

  const ownerDataSource = oGroups.map((name, index) => ({
    OwnerText: name,
    Id: name,
    OwnerColor: colors[index % colors.length] // Cycle through colors
  }));
  //console.log(ownerDataSource);
  return ownerDataSource;
}

function findEarliestDate(dataSource) {
  if (dataSource.length === 0) {
    return null; // Return null or an appropriate value if dataSource is empty
  }

  let earliestDate = new Date(dataSource[0].StartTime); // Initialize with the first event's StartTime

  dataSource.forEach(event => {
    const startDate = new Date(event.StartTime);
    if (startDate < earliestDate) {
      earliestDate = startDate;
    }
  });

  return earliestDate;
}

function GetDataManager() {
  //GetToken();
  return new DataManager({
    adaptor: new CustomDataAdaptor({
      getData: function (option) {
        let request;
        console.log(token.value);
        fetch(urlGetCorsi, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiam9obi5tYXJ0ZWxsaUBhbHRhbWlyYWhybS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjE5MDQ5MzIxNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFsdGFtaXJhIiwibmJmIjoxNzExOTIzMjgxLCJleHAiOjE3MTE5NTMyODEsImlzcyI6IkFsdGFtaXJhIiwiYXVkIjoiQW55b25lIn0.lGHWkjPZJWmh7-jfkcBh8suaa5rTimCIR3X_RBTYEc0",//token.value,
            'structure': 'false',
            'Accept': 'application/json'
          },
        }).then((response) => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          }
        }).then((data) => {
          const transformedResponse = {
            result: data.data, // Use the data array from the original response
            count: parseInt(100, 10) // Ensure count is an integer
          };
          option.onSuccess(transformedResponse, request);
        }).catch((error) => {
          console.log(error);
          option.onFailure(request);
        });
      },
    }),
  })/*.executeQuery(new Query().take(8)).then((e) => {
    //e.result will contain the records
    console.log(e);
  })*/;

}
onMounted(main);
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