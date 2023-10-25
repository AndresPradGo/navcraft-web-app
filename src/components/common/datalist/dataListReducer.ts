
interface ChangeOrder {
    type: 'RESET';
    options: string[]
}

interface ChangeIndex {
    type: 'FILTER';
    value: string;
    options: string[]
}

export type SortAction = ChangeOrder | ChangeIndex

const dataListReducer = (_: string[] | [], action: SortAction): string[] | [] => {
    switch (action.type) {
        case 'RESET':
            return action.options
        case 'FILTER':
            return action.options.filter(option => option.toLowerCase().startsWith(action.value.toLowerCase()))
    }

}

export default dataListReducer