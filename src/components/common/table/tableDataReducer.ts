
import _ from "lodash";

import { RowType as TableRowType } from "./Table";

interface SortTableType {
    type: 'SORT'
    sortKey: string
    order: 'asc' | 'desc'
}

interface FilterTableType {
    type: 'FILTER'
}

type Action = SortTableType | FilterTableType

const tableDataReducer = (tableData: TableRowType[], action: Action): TableRowType[] => {
    switch(action.type) {
        case 'SORT':
            const orderedData = _.orderBy(
                tableData,
                [action.sortKey],
                [action.order]
              );
              return orderedData;
        
        case 'FILTER':
            return tableData

    }
}

export default tableDataReducer