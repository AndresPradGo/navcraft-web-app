import _ from "lodash";

import { RowType } from './Table';

interface PaginationParamsType {
    currentPage: number;
    pageSize: number;
}

export interface DataSortingParameters {
    key: string;
    order: "asc" | "desc";
}

interface SearchParamsType {
    columnKeys: string[];
    text: string;
}

interface FilterParamsType {
    key: string;
    value: string;
}

interface DataProcessingParameters {
    data: RowType[] | [];
    sortParams?: DataSortingParameters;
    paginationParams?: PaginationParamsType;
    searchParams?: SearchParamsType;
    filterParams: FilterParamsType[] | [];
}

interface ReturnType {
    processedData: RowType[] | [];
    numPages: number;
}

const useProcessTableData = ({
    data, 
    sortParams,
    paginationParams,
    searchParams,
    filterParams
}: DataProcessingParameters):ReturnType  => {

    // Variable to store the processed data
    let processedData = data

    // Apply search-bar filter
    if (searchParams) {
        processedData = processedData.filter((row): boolean => {
            return searchParams.columnKeys.map((key):boolean => {
                return !!row[key]?.toString().toLowerCase().includes(searchParams.text.trim().toLowerCase())
            }).some(bool => bool === true)
        })
    }
  
    // Apply filters
    if (filterParams.length) {
        const filterColumns = new Set(filterParams.map(filter => filter.key))
        filterColumns.forEach(key => {
            const filters = filterParams.filter(filter => filter.key === key)
            processedData = processedData.filter(row => (
                filters.some(filter => (
                    row[filter.key]?.toString().toLowerCase().includes(
                        filter.value.trim().toLowerCase()
                    ) 
                ))
            ))
        });
    }

    
    // Sort data
    if (sortParams) {
        processedData = _.orderBy(
            processedData,
            [sortParams.key],
            [sortParams.order]
        );
    }
        
    // Paginate data
    let numPages = 1
    if (paginationParams) {
        const { currentPage, pageSize } = paginationParams
        numPages = pageSize ? Math.ceil(processedData.length / pageSize) : 1;
        const startIndex = (currentPage - 1) * pageSize;
        processedData = _(processedData).slice(startIndex).take(pageSize).value()
    }
    return {processedData, numPages}
}

export default useProcessTableData;