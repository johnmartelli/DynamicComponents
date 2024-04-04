import {
	computed,
	reactive
} from 'vue';

import { getPreparedRequestPaginationParams } from '@/helpers/pagination.helper';

/**
 * @global
 * @typedef { Object } defaultPagination
 * @property { number } currentPage
 * @property { number } rows
 * @property { number } offset
 * @property { number } totalRecords
 */
const DEFAULT_PAGINATION = {
	currentPage: 1,
	rows: 10,
	offset: 0,
	totalRecords: 0
};

function useTablePagination() {
	const pagination = reactive({ ...DEFAULT_PAGINATION });

	/**
	 * Helper method to change page
	 * @param event - primevue change page event
	 */
	function changePage(event) {
		const { page = 0, rows = 10 } = event;

		pagination.rows = rows;
		pagination.currentPage = page + 1;
	}

	/**
	 * Helper method to reset pagination
	 */
	function resetPagination() {
		pagination.currentPage = DEFAULT_PAGINATION.currentPage;
		pagination.rows = DEFAULT_PAGINATION.rows;
		pagination.offset = DEFAULT_PAGINATION.offset;
		pagination.totalRecords = DEFAULT_PAGINATION.totalRecords;
	}

	/**
	 * Helper method to set totalRecords
	 * @param { number } totalRecords
	 */
	function setTotalRecords(totalRecords) {
		pagination.totalRecords = Number(totalRecords);
	}

	const preparedPaginationRequestParams = computed(() => {
		return getPreparedRequestPaginationParams(pagination.currentPage, pagination.rows);
	});

	return {
		pagination,
		preparedPaginationRequestParams,
		changePage,
		resetPagination,
		setTotalRecords
	};
}

export default useTablePagination;
