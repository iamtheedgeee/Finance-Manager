import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../services/api";
import { getBudgets } from "./budgetSlice";
const initialState={
    categories:[],
    status:'idle',
    error:null
}

export const getCategories=createAsyncThunk("accounts/getCategories",async()=>{
    try{
        const res=await privateApi.get('/api/categories')
        const {categories}=res.data
        return categories
    } catch(error){
        console.log(error)
        throw new Error ("Something Went Wrong")
    }
})

export const deleteCategory=createAsyncThunk("accounts/deleteCategory",async(id,{dispatch})=>{
    try{
        const res=await privateApi.delete(`/api/categories/${id}`)
        if(res.status===202) dispatch(getCategories())
    } catch(error){
        console.log(error)
        throw new Error ("Failed to Delete")
    }
})

export const createCategory=createAsyncThunk("accounts/createCategory",async(payload,{dispatch})=>{
    try{
        const res=await privateApi.post('/api/categories',payload)
        const {category}=res.data
        if(category){
            dispatch(getCategories())

        }
        return category
    } catch(error){
        console.log(error)
        if(error.response?.status===406){
            throw new Error("Category With That Name Already Exists")
        }
        throw new Error("Failure in creating Category")
    }
})
export const editCategory=createAsyncThunk("accounts/editCategory",async(payload,{dispatch})=>{
    try{
        const res=await privateApi.put(`/api/categories/${payload.id}`,payload)
        const {category}=res.data
        if(category){
            dispatch(getCategories())
            dispatch(getBudgets())
        }
            return category
    } catch(error){
        console.log(error)
        if(error.response?.status===406){
            throw new Error("Category With That Name Already Exists")
        }
        throw new Error("Failure in creating Category")

    }
})
const categorySlice=createSlice({
    name:"categories",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getCategories.pending,(state)=>{
            state.status='loading'
        })
        .addCase(getCategories.fulfilled,(state,action)=>{
            state.categories=action.payload
            state.status='success'
        })
        .addCase(getCategories.rejected,(state,action)=>{
            state.status="failed"
            state.error=action.error.message
        })
    }
})

export default categorySlice.reducer