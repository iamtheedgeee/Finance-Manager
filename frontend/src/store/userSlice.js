import { createSlice,createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { privateApi } from "../services/api";
import { navigateTo } from "../navigator";
import store from "../store/store"
import qs from 'qs'

const initialState={
    accessToken: null,
    userInfo: null,
    isLoggedIn:false,
    status:"idle",
    error:false,
    totalBalance:null,
    totalIncome:null,
    totalExpense:null,
    summaryStatus:"idle",
    summaryError:false
}

const setTokenReducer=(state,action)=>{
    state.accessToken=action.payload
}

const clearUserReducer=(state)=>{
    state.accessToken=null
    state.userInfo=null
    state.isLoggedIn=false

}
export const reset= createAction('/user/reset')

export const getSummary=createAsyncThunk("user/getSummary",async()=>{
    const state=store.getState()
    const {filters:{date}}=state.transaction
    const query=(qs.stringify({date}))
    try{
        const res=await privateApi.get(`/api/users/summary?${query}`)
        if(res.statusText==="OK"){
            const summary=res.data
            return summary
        }
    } catch(error){
        console.log(error)
    }
})

export const setUser=createAsyncThunk('user/setUser',async(token,{dispatch})=>{
    dispatch(setToken(token))
    try{
        const res= await privateApi.get('/api/users')
        if(res.statusText==='OK'){
            const {user}=res.data
            return user
        }
    } catch(error){
        console.log(error)
        if(error.response.data.msg==="User Not Found"){
            alert("User Not Found")
            dispatch(reset())
            navigateTo('/login')
        }
    }
})

const userSlice=createSlice({
    name: "user",
    initialState,
    reducers:{
        setToken:setTokenReducer,
        clearUser:clearUserReducer,
    },
    extraReducers:(builder)=>{
        builder
            .addCase(setUser.pending,(state)=>{
                state.status='loading'
            })
            .addCase(setUser.fulfilled,(state,action)=>{
                state.userInfo=action.payload
                state.isLoggedIn=true
                state.status="success"
            })
            .addCase(setUser.rejected,(state,action)=>{
                state.status="failed"
                state.error=action.error.message
            })
            .addCase(getSummary.pending,(state)=>{
                state.summaryStatus='loading'
            })
            .addCase(getSummary.fulfilled,(state,action)=>{
                state.totalBalance=action.payload.balance
                state.totalExpense=action.payload.expense
                state.totalIncome=action.payload.income
                state.summaryStatus="success"
            })
            .addCase(getSummary.rejected,(state,action)=>{
                state.summaryStatus="failed"
                state.summaryError=action.error.message
            })
    }
})

export const {setToken,clearUser}=userSlice.actions
export default userSlice.reducer