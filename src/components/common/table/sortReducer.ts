import {SortDataType} from "./SortButton"

interface ChangeOrder {
    type: 'SWAP';
}

interface ChangeIndex {
    type: 'CHANGE';
    value: number;
}

export type SortAction = ChangeOrder | ChangeIndex

const sortReducer = (sort: SortDataType, action: SortAction): SortDataType => {
    switch (action.type) {
        case 'CHANGE':
            return {
                index: action.value,
                order: "asc"
            }
        case 'SWAP':
            return {
                index: sort.index,
                order: sort.order === "asc" ? "desc" : "asc"
            }
            
    }

}

export default sortReducer