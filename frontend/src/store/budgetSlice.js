import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../services/api";
import { getCategories } from "./categorySlice";
const initialState={
    budgets:[],
    status:'idle',
    error:null
}

export const getBudgets=createAsyncThunk("budgets/getBudgets",async()=>{
    try{
        const res=await privateApi.get('/api/budgets')
        const {budgets}=res.data
        return budgets
    } catch(error){
        console.log(error)
        throw new Error ("Something Went Wrong")
    }
})
export const deleteBudget=createAsyncThunk("accounts/deleteBudget",async(id,{dispatch})=>{
    try{
        const res=await privateApi.delete(`/api/budgets/${id}`)
        if(res.status===202){
            dispatch(getBudgets())
            dispatch(getCategories())
        }
    } catch(error){
        console.log(error)
        throw new Error ("Failed to Delete")
    }
})
export const createBudget=createAsyncThunk("budgets/createBudget",async(payload,{dispatch})=>{
    try{
        const res=await privateApi.post('/api/budgets',payload)
        const {budget}=res.data
        if(budget){
            dispatch(getBudgets())
            dispatch(getCategories())
        }
        return budget
    } catch(error){
        console.log(error)
        throw new Error("Failure in creating Budget")
    }
})

export const editBudget=createAsyncThunk("accounts/editBudget",async(payload,{dispatch})=>{
    try{
        const res=await privateApi.put(`/api/budgets/${payload.id}`,payload)
        const {budget}=res.data
        if(budget){
            dispatch(getBudgets())
            dispatch(getCategories())
        }
        return budget
    } catch(error){
        console.log(error)
        if(error.response?.status===406){
            throw new Error("Budget With That Name Already Exists")
        }
        throw new Error("Failure in creating Budget")

    }
})

const budgetSlice=createSlice({
    name:"budgets",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getBudgets.pending,(state)=>{
            state.status='loading'
        })
        .addCase(getBudgets.fulfilled,(state,action)=>{
            state.budgets=action.payload
            state.status='success'
        })
        .addCase(getBudgets.rejected,(state,action)=>{
            state.status="failed"
            state.error=action.error.message
        })
    }
})

export default budgetSlice.reducer