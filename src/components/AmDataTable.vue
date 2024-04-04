<template>
    <DataTable
        v-model:selection="selection"
        v-model:first="pagination.offset"
        v-model:rows="pagination.rows"
        :value="list"
        :row-hover="true"
        :loading="isFetchDataTableDataLoading"
        :lazy="true"
        :paginator="true"
        :total-records="pagination.totalRecords"
        :rows-per-page-options="[10, 20, 50]"
        :data-key="dataKey"
        :selection-mode="selectionMode"
        :at-am-data-table="atAttribute"
        current-page-report-template="Showing {first} to {last} of {totalRecords}"
        paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        class="am-data-table"
        @page="handleChangePage"
    >
        <Column
            v-if="selectionMode"
            :selection-mode="selectionMode"
            :exportable="false"
            :reorderable-column="false"
        />
        <Column
            v-for="column in columns"
            :key="column.fieldId"
            :header="column.label"
            :field="column.tagName"
        >
            <template #body="{ data }">
                <template v-if="column.dataType === 'type_nVarChar'">
                    {{ data[column.tagName] }}
                </template>
                <template v-if="column.dataType === 'type_datetime'">
                    {{ formatDate(data[column.tagName]) }}
                </template>
                <template v-else>
                    {{ data[column.tagName] }}
                </template>
            </template>
        </Column>
    </DataTable>
</template>

<script>
import {
    ref,
    defineComponent
} from 'vue';

import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

import dayjs from 'dayjs';
import { api } from '@/services/api.service.js';
import useTablePagination from '@/use/useTablePagination.js';
import { initialFetchData } from '@/helpers/initialFetchData.helper.js';

export default defineComponent({
    name: 'AmDataTable',
    components: {
        Column,
        DataTable,
    },
    inheritAttrs: false,
    props: {
        /**
         * API URL
         */
        apiUrl: {
            type: String,
            required: true
        },
        /**
         * Name of the field that uniquely identifies record in the data.
         */
        dataKey: {
            type: String,
            default: 'id'
        },
        /**
         * Specifies the selection mode and auto add selection column.
         * "multiple" | "single"
         */
        selectionMode: {
            type: [String, null],
            validator(value) {
                return ['multiple', 'single', null].includes(value);
            },
            default: null
        },
        /**
         * AQA attribute
         */
        atAttribute: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const {
            pagination,
            changePage,
            setTotalRecords,
            preparedPaginationRequestParams
        } = useTablePagination();

        const list = ref([]);
        const selection = ref([]);
        const columns = ref([]);

        const isFetchDataTableDataLoading = ref(false);

        function formatDate(date) {
            return dayjs(date).format('DD/MM/YYYY')
        }

        function getColumnsConfig(view) {
            const { tabs = [] } = view;
            const [tabItem = {}] = tabs;
            const { titles = [] } = tabItem;
            const [titleItem = {}] = titles;
            const { fields = [] } = titleItem;

            return fields.filter(item => item.visible);
        }

        async function fetchDataTableData() {
            isFetchDataTableDataLoading.value = true;

            try {
                const response = await api.get(props.apiUrl, [], preparedPaginationRequestParams.value, {}, true);
                const { data = [], view = {}, count = 0 } = response;

                list.value = data;
                columns.value = getColumnsConfig(view);
                setTotalRecords(count);

                return Promise.resolve(response);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                isFetchDataTableDataLoading.value = false;
            }
        }

        function handleChangePage(event) {
            changePage(event);
            fetchDataTableData();
        }

        initialFetchData(fetchDataTableData);

        return {
            list,
            columns,
            selection,
            pagination,
            isFetchDataTableDataLoading,
            formatDate,
            handleChangePage
        };
    }
});
</script>

<style lang="scss">
//.am-data-table {
//    &.p-datatable {
//        &.p-datatable-hoverable-rows {
//            .p-datatable-tbody {
//                tr {
//                    &:not(.p-highlight) {
//                        &:hover {
//                            background: #F9FBFE;
//                            cursor: pointer;
//                        }
//                    }
//                }
//            }
//        }
//
//        .p-datatable-thead {
//            tr {
//                th {
//                    padding: 14px;
//                    border: 1px solid #CFD9EB;
//                    border-width: 1px 0;
//                    background: #F9FBFE;
//                    color: #747E8F;
//                    font-size: 12px;
//                    font-weight: 700;
//                    line-height: 1;
//                    text-transform: uppercase;
//                }
//            }
//        }
//
//        .p-datatable-tbody {
//            tr {
//                background: #FFFFFF;
//
//                &:focus {
//                    outline: none;
//                    outline-offset: 0;
//                }
//
//                &.p-highlight {
//                    background: #F9FBFE;
//                }
//
//                &.cut {
//                    opacity: 0.7;
//                }
//
//                &.copy {
//                    opacity: 0.7;
//                }
//
//                td {
//                    padding: 14px;
//                    border: 1px solid #CFD9EB;
//                    border-width: 0 0 1px 0;
//                    color: #373737;
//                    font-size: 14px;
//                    font-weight: 400;
//                    line-height: 20px;
//                    background-color: inherit;
//
//                    &:not(.p-selection-column) {
//                        overflow: hidden;
//                        white-space: nowrap;
//                        text-overflow: ellipsis;
//                    }
//                }
//            }
//        }
//
//        .p-datatable-loading-overlay {
//            &.p-component-overlay {
//                background-color: transparent;
//                backdrop-filter: blur(2px);
//            }
//        }
//
//        .p-paginator-bottom {
//            .p-paginator {
//                background: #FFFFFF;
//            }
//        }
//    }
//}
</style>
