/**
 * @typedef { 'Equal' | 'Contains' | 'GreaterThanOrEqual' | 'LessThanOrEqual' | 'EqualOrIsNull' } requestFilterComparator
 */

/**
 * @typedef { Object } preparedRequestFilterItem
 * @param { * } value
 * @param { string } tagname
 * @param { requestFilterComparator } comparator
 */

/**
 * @typedef { Array<preparedRequestFilterItem> } requestFilters
 */

const FILTERS_CONFIG_COMPARATOR = {
	EQUAL: 'Equal',
	CONTAINS: 'Contains',
	GREATER_THAN_OR_EQUAL: 'GreaterThanOrEqual',
	LESS_THAN_OR_EQUAL: 'LessThanOrEqual',
	EQUAL_OR_IS_NULL: 'EqualOrIsNull'
};

const DEFAULT_FILTER_TAG_NAME = 'quicksearch';

class FiltersService {
	/**
	 * Helper function to get prepared request filter item value
	 * @param { * } value
	 * @param { string } tagname
	 * @param { requestFilterComparator } comparator
	 * @return { preparedRequestFilterItem }
	 */
	static getPreparedRequestFilterItem(
		value,
		tagname = DEFAULT_FILTER_TAG_NAME,
		comparator = FILTERS_CONFIG_COMPARATOR.CONTAINS
	) {
		return {
			tagname,
			comparator,
			value
		}
	}
	/**
	 * Helper function to get prepared for request filters params
	 * @param { requestFilters } filtersList
	 * @return {{Filters: {Filters: requestFilters}}}
	 */
	static getPreparedRequestFiltersParams(filtersList = []) {
		return {
			Filters: {
				Filters: filtersList
			}
		}
	}
}

export {
	FILTERS_CONFIG_COMPARATOR,
	DEFAULT_FILTER_TAG_NAME,
	FiltersService
}
