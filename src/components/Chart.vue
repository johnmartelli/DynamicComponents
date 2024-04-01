<template>
    <ejs-chart :id='id' :title='title' :primaryXAxis='primaryXAxis'>
        <e-series-collection>
            <e-series :dataSource='seriesData' type='Line' xName='month' yName='sales' name='Sales'> </e-series>
        </e-series-collection>
    </ejs-chart>
</template>

<script setup>
import { provide } from 'vue';
import { ChartComponent as EjsChart, SeriesCollectionDirective as ESeriesCollection, SeriesDirective as ESeries, LineSeries, Legend, Category } from "@syncfusion/ej2-vue-charts";

//import { defineProps } from 'vue';
// Define props using defineProps
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
  // You can add more props here
});

const seriesData = [
    { month: 'Jan', sales: 35 }, { month: 'Feb', sales: 28 },
    { month: 'Mar', sales: 34 }, { month: 'Apr', sales: 32 },
    { month: 'May', sales: 40 }, { month: 'Jun', sales: 32 },
    { month: 'Jul', sales: 35 }, { month: 'Aug', sales: 55 },
    { month: 'Sep', sales: 38 }, { month: 'Oct', sales: 30 },
    { month: 'Nov', sales: 25 }, { month: 'Dec', sales: 32 }
];
const title = props.title;
const primaryXAxis = {valueType: 'Category'};
const chart = [LineSeries, Legend, Category];
provide('chart', chart);
</script>