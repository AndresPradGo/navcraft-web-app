
interface SetPageAction {
type: 'SET'
page: number
}

interface SimplePageAction {
type: 'INCREASE' | 'DECREASE' | 'RESET'
}

export type PageAction = SimplePageAction | SetPageAction

const pageReducer = (page: number, action: PageAction): number => {
    switch (action.type) {
        case 'INCREASE':
            return page + 1
        case 'DECREASE':
            return page - 1
        case 'RESET':
            return 1;
        case 'SET':
            return action.page
    }
}

export default pageReducer;