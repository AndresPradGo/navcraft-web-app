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

interface DataProcessingParameters {
    data: RowType[] | [];
    sortParams?: DataSortingParameters;
    paginationParams?: PaginationParamsType;
}

const useProcessTableData = ({
    data, 
    sortParams,
    paginationParams
}: DataProcessingParameters):RowType[] | []  => {

    let processedData = data
    
    if (sortParams) {
        processedData = _.orderBy(
            data,
            [sortParams.key],
            [sortParams.order]
          );
    }

    if (paginationParams) {
        const { currentPage, pageSize } = paginationParams
        const startIndex = (currentPage - 1) * pageSize;
        processedData = _(processedData).slice(startIndex).take(pageSize).value()
    }

    return processedData
}

export default useProcessTableData;