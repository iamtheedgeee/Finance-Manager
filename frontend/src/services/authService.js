import { publicApi } from "./api";
import store from "../store/store";
import { setToken, setUser} from "../store/userSlice";
import { navigateTo } from "../navigator";
import {reset} from '../store/userSlice'


export const signup=async (username,email,password)=>{
    try{
        const res=await publicApi.post('/auth/signup',{username,email,password})
        if(res.status===201){
            store.dispatch(setUser(res.data.accessToken))
            return

        }
    } catch(error){
        if(error.response?.status===406){
            throw new Error(`${error.response?.data.msg[0]} already exists`)
        }
        console.log(error)
        throw new Error("Something Went Horribly Wrong lol")
}}


export const login=async (username,password)=>{
    try{
        const res= await publicApi.post('/auth/login',{username,password})
        if(res.status===202){
            store.dispatch(setUser(res.data.accessToken))
            return
        } 
    } catch(error){
        if(error.response?.status===404){
            throw new Error("No such User")
        }
        else if(error.response?.status===401){
            throw new Error("Incorrect Password")
        }
        console.log(error)
        throw new Error("Something Went Horribly Wrong lol")

}}
export const logout=async()=>{
    try{
        const res=await publicApi.post('/auth/logout')
        if(res.status===200){
            store.dispatch(reset())
            navigateTo('/')
        }
    } catch(error){
        console.log(error)
    }
}

export const refreshToken=async(refreshing)=>{
    try{
        const res=await publicApi.post('/auth/refresh')
        if(res.status===200){
            if(refreshing){
                store.dispatch(setToken(res.data.accessToken))
                return
            }
            await store.dispatch(setUser(res.data.accessToken))
        } 
        else if(res.status===204){
            store.dispatch(reset())
            navigateTo('/login')
        }
    } catch(error) {
        if(error.response?.data.msg==="TokenExpired"){
            alert("Session Expired")
            store.dispatch(reset())
            navigateTo('/login')
        }
    }

}