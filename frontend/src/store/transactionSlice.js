import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../services/api";
import { getAccounts } from "./accountSlice";
import { getBudgets } from "./budgetSlice";
import { getCategories } from "./categorySlice";
import { getSummary } from "./userSlice";
import store from "../store/store"
import qs from 'qs'
import { shallowEqual } from "react-redux";

const initialState={
    transactions:[],
    filters:{
        page:1,
        category:[],
        INCOME:[],
        EXPENSE:[],
        account:[],
        date:{
            preset:"last7days",
            custom:{customStart:'',customEnd:''}},
        type:[],
    },
    meta:{},
    status:'idle',
    error:null
}


export const getTransactions=createAsyncThunk("transactions/getTransactions",async()=>{
    try{
        const state=store.getState()
        const {filters}=state.transaction
        const query=(qs.stringify(filters))
        const res=await privateApi.get(`/api/transactions?${query}`)
        const {transactions,meta}=res.data
        return {transactions,meta}
    } catch(error){
        console.log(error)
        throw new Error ("Something Went Wrong")
    }
})

export const deleteTransaction=createAsyncThunk("transactions/deleteTransaction",async({id,type,amount,accountId},{dispatch})=>{
    try{
        const res=await privateApi.delete(`/api/transactions/${id}`,{data:{type,amount,accountId}})
        if(res.statusText==="Accepted"){
            dispatch(getTransactions())
            dispatch(getAccounts())
            dispatch(getSummary())
            dispatch(getBudgets())
            dispatch(getCategories())
        }
    } catch(error){
        console.log(error)
        throw new Error ("Failed to Delete")
    }
})

export const createTransaction=createAsyncThunk("transactions/createTransaction",async(payload,{dispatch})=>{
    try{
        const res=await privateApi.post('/api/transactions',payload)
        const {transaction}=res.data
        if(transaction){
            dispatch(getTransactions())            
            dispatch(getAccounts())
            dispatch(getSummary())
            dispatch(getBudgets())
            dispatch(getCategories())
        }
        return transaction

    } catch(error){
        console.log(error)
        throw new Error("Failure in creating Transaction")
    }
})

export const editTransaction=createAsyncThunk("transactions/editTransaction",async(payload,{dispatch})=>{
    try{
        const res=await privateApi.put(`/api/transactions/${payload.id}`,payload)
        const {transaction}=res.data
        if(transaction){
            dispatch(getTransactions())
            dispatch(getAccounts())
            dispatch(getSummary())
            dispatch(getBudgets())
            dispatch(getCategories())
        }
        return transaction
    } catch(error){
        console.log(error)
        throw new Error("Failure in Editing Transaction")

    }
})

const setFilterReducer=(state,action)=>{
    if(!shallowEqual(state.filters,action.payload)){
        state.filters=action.payload
        state.status="idle"
    }
}

const resetFilterReducer=(state)=>{
    state.filters=initialState.filters
    state.status="idle"
}
const transactionSlice=createSlice({
    name:"transactions",
    initialState,
    reducers:{
        setFilters:setFilterReducer,
        resetFilters:resetFilterReducer
    },
    extraReducers:(builder)=>{
        builder.addCase(getTransactions.pending,(state)=>{
            state.status='loading'
        })
        .addCase(getTransactions.fulfilled,(state,action)=>{
            state.transactions=action.payload.transactions
            state.meta=action.payload.meta
            state.status='success'
        })
        .addCase(getTransactions.rejected,(state,action)=>{
            state.status="failed"
            state.error=action.error.message
        })
    }
})

export const {setFilters,resetFilters}=transactionSlice.actions
export default transactionSlice.reducer