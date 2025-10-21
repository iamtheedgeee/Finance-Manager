import {combineReducers} from '@reduxjs/toolkit'
import userReducer from './userSlice'
import accountReducer from './accountSlice'
import categoryReducer from './categorySlice'
import transactionReducer from './transactionSlice'
import budgetReducer from './budgetSlice'
import {reset} from './userSlice'
const appReducer=combineReducers({
        user:userReducer,
        account:accountReducer,
        category:categoryReducer,
        transaction:transactionReducer,
        budget:budgetReducer
})

const rootReducer=(state,action)=>{
    if(action.type===reset.type){
        state=undefined
    }
    return appReducer(state,action)
}

export default rootReducer;