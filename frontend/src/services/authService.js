import { publicApi } from "./api";
import store from "../store/store";
import { setToken, setUser} from "../store/userSlice";
import { navigateTo } from "../navigator";
import {reset} from '../store/userSlice'


export const signup=async (username,email,password)=>{
    try{
        const res=await publicApi.post('/auth/signup',{username,email,password})
        if(res.statusText==="Created"){
            store.dispatch(setUser(res.data.accessToken))
            return

        }
    } catch(error){
        if(error.response?.statusText==="Not Acceptable"){
            throw new Error(`${error.response?.data.msg[0]} already exists`)
        }
        console.log(error)
        throw new Error("Something Went Horribly Wrong lol")
}}


export const login=async (username,password)=>{
    try{
        const res= await publicApi.post('/auth/login',{username,password})
        if(res.statusText==="Accepted"){
            store.dispatch(setUser(res.data.accessToken))
            return
        } 
    } catch(error){
        if(error.response?.statusText==="Not Found"){
            throw new Error("No such User")
        }
        else if(error.response?.statusText==="Unauthorized"){
            throw new Error("Incorrect Password")
        }
        console.log(error)
        throw new Error("Something Went Horribly Wrong lol")

}}
export const logout=async()=>{
    try{
        const res=await publicApi.post('/auth/logout')
        if(res.statusText==="OK"){
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
        if(res.statusText==="OK"){
            if(refreshing){
                store.dispatch(setToken(res.data.accessToken))
                return
            }
            await store.dispatch(setUser(res.data.accessToken))
        } 
        else if(res.statusText==="No Content"){
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