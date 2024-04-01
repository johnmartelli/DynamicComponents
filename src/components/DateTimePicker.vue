<template>
    <div class="card flex justify-content-center">
        <Calendar v-model="date" dateFormat="dd/mm/yy" />
    </div>
</template>

<script setup>
import { ref } from "vue";
import Calendar from 'primevue/calendar';
import 'primevue/resources/themes/aura-light-green/theme.css'

const date = ref();
</script>
