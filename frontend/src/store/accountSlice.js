import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../services/api";
import { getTransactions } from "./transactionSlice";
import { getSummary } from "./userSlice";
const initialState={
    accounts:[],
    status:"idle",
    error:null
}

export const getAccounts=createAsyncThunk("accounts/getAccounts",async()=>{
    try{
        const res=await privateApi.get('/api/accounts')
        const {accounts}=res.data
        return accounts
    } catch(error){
        console.log(error)
        throw new Error ("Something Went Wrong")
    }
})
export const deleteAccount=createAsyncThunk("accounts/deleteAccount",async(id,{dispatch})=>{
    try{
        const res=await privateApi.delete(`/api/accounts/${id}`)
        if(res.status===202){
            dispatch(getAccounts())
            dispatch(getSummary())
        }
    } catch(error){
        console.log(error)
        throw new Error ("Failed to Delete")
    }
})
export const createAccount=createAsyncThunk("accounts/createAccount",async(payload,{dispatch})=>{
    try{
        const res=await privateApi.post('/api/accounts',payload)
        const {account}=res.data
        if(account){
            dispatch(getAccounts())
            dispatch(getSummary())
        }
        return account
    } catch(error){
        console.log(error)
        if(error.response?.status===406){
            throw new Error("Account With That Name Already Exists")
        }
        throw new Error("Failure in creating Account")
    }
})
export const editAccount=createAsyncThunk("accounts/editAccount",async(payload,{dispatch})=>{
    try{
        const res=await privateApi.put(`/api/accounts/${payload.id}`,payload)
        const {account}=res.data
        if(account){
            dispatch(getAccounts())
        }
            return account
    } catch(error){
        console.log(error)
        if(error.response?.status===406){
            throw new Error("Account With That Name Already Exists")
        }
        throw new Error("Failure Editing Account")

    }
})

const accountSlice=createSlice({
    name:"accounts",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAccounts.pending,(state)=>{
            state.status='loading';
        })
        .addCase(getAccounts.fulfilled,(state,action)=>{
            state.status='success'
            state.accounts=action.payload
        })
        .addCase(getAccounts.rejected,(state,action)=>{
            state.status="failed"
            state.error=action.error.message
        })
    }
})

export default accountSlice.reducer