import { privateApi } from "./api";
import qs from 'qs'


export const sendFileForImport= async(formData)=>{
    try{
        const res= await privateApi.post(`/api/functions/import`,formData)
        if(res.status===201){
            console.log("successful")
            const {count}=res.data
            return count
        }
    } catch(error){
        console.log(error)
        throw new Error('Something Went Wrong')
    }
}
export const getDateRange= async(preset)=>{
    try{
        const res=await privateApi.get(`/api/functions/get-date-from-preset?preset=${preset}`)
        if(res.status===200){
            const {date}=res.data
            return date
        }
    } catch(error){
        console.log(error)
        throw new Error('Something Went Wrong')
    }
}

export const getIncomeExpenseChartData=async(date,interval)=>{
    const query=qs.stringify({date,interval})
    try{
        const res=await privateApi.get(`/api/analytics/income-expense-data?${query}`)
        if(res.status===200){
            const {chartData}=res.data  
            return chartData   
        }
    } catch(error){
        console.log(error)
        throw new Error("Something Went Wrong")
    }
}

export const getExpenseByCategoryChartData=async(date,interval,categoryId)=>{
    const query=qs.stringify({date,interval,categoryId})
    try{
        const res=await privateApi.get(`/api/analytics/expense-by-category-data?${query}`)
        if(res.status===200){
            const {chartData}=res.data  
            return chartData   
        }
    } catch(error){
        console.log(error)
        throw new Error("Something Went Wrong")
    }    
}

export const getExpensePieChartData=async(date,type)=>{
    const query=qs.stringify({date,type})
    try{
        const res=await privateApi.get(`/api/analytics/expense-pie-chart-data?${query}`)
        if(res.status===200){
            const {chartData}=res.data  
            return chartData   
        }
    } catch(error){
        console.log(error)
        throw new Error("Something Went Wrong")
    }   
}
