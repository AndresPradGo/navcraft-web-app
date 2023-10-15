import {FilterWithValueType} from "./FilterButton"
interface ChangeAction {
    type: 'CHANGE';
    index: number;
}

interface ClearAction {
    type: 'CLEAR';
}

export type FilterAction = ChangeAction | ClearAction;

const filtersReducer = (filters: FilterWithValueType[], action: FilterAction): FilterWithValueType[] | [] => {

    switch (action.type) {
        case 'CHANGE':
           return filters.map((val,idx) => {
                if (idx === action.index)
                    return {...val, selected: !val.selected}
                return val
            })
        case 'CLEAR':
            return filters.map(filter => ({...filter, selected: false}))

    }
}

export default filtersReducer