import axios from "axios"
import store from "../store/store"
import { refreshToken } from "./authService"
export const publicApi=axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

export const privateApi=axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

privateApi.interceptors.request.use(
    (config)=>{
        const state=store.getState()
        const token=state.user.accessToken
        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

privateApi.interceptors.response.use(
    (response)=> response,
    async (error)=>{
        const config=error.config
        if(error.response.data.msg==="No Token"){
            console.log("No token")
        }
        else if(error.response.data.msg==="TokenExpired" && !config._retry){
            config._retry=true
            try{
                await refreshToken(true)
                return privateApi(config)
            } catch(refreshError){
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }

)