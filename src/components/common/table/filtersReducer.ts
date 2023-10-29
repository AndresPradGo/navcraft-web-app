interface ChangeAction {
    type: 'ADD' | 'REMOVE';
    index: number;
}

interface ClearAction {
    type: 'CLEAR';
}

export type FilterAction = ChangeAction | ClearAction;

const filtersReducer = (filters: number[] | [], action: FilterAction): number[] | [] => {

    switch (action.type) {
        case 'ADD':
           return  [...filters, action.index]
        case 'REMOVE':
            return filters.filter(item => item !== action.index)
        case 'CLEAR':
            return []

    }
}

export default filtersReducer