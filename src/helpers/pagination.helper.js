/**
 * Helper function to get prepared for request pagination params
 * @param { number } PageNumber - currentPage value
 * @param { number } RowNumber
 * @return {{RowNumber, PageNumber, paging}}
 */
export function getPreparedRequestPaginationParams(PageNumber = 1, RowNumber = 10) {
	return {
		PageNumber,
		RowNumber,
		paging: true
	};
}
