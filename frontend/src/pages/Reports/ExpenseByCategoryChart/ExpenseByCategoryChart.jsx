import {useEffect,useState} from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,LineChart,Line } from 'recharts'
import { getCategories } from '../../../store/categorySlice';
import { useDispatch,useSelector } from 'react-redux';
import BarChartFilter from '../BarChartFilter/BarChartFilter';
import styles from '../charts.module.css'
import { getExpenseByCategoryChartData } from '../../../services/appService';
import { useRef } from 'react';
export default function ExpenseByCategoryChart(){
    const dispatch=useDispatch()
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [data,setData]=useState(null)
    const isFirst=useRef(true)
    const {categories,status:categoryStatus}=useSelector((state)=>state.category)
    const {filters}=useSelector((state)=>state.transaction)
    const [settings,setSettings]=useState({
        interval:"YYYY",
        chartType:'bar',
        categoryId:'',
    })
    async function fetchData(catId=settings.categoryId){
        setError(null)
        setLoading(true)
        try{
            const chartData=await getExpenseByCategoryChartData(filters.date,settings.interval,catId)
            if(chartData){
                setData(chartData)
                setLoading(false)
                setError(null)
            }
        } catch(error){
            setError("Error")
            setLoading(false)
        }
    }
    async function loadCategories(){
        if(categoryStatus==="idle"){
            await dispatch(getCategories())
        }
        if(categories.length>0){
            setSettings((prev)=>({...prev,categoryId:categories[0].id}))
            fetchData(categories[0].id)
        }
    }

    useEffect(()=>{
       loadCategories() 
    },[categories])

    useEffect(()=>{
        if(isFirst.current){
            isFirst.current=false
            return
        }
        fetchData()
    },[filters.date,settings.categoryId,settings.interval])
    
    return (
    <div className={styles.mainContainer}>
        <div className={styles.title}>Category Expense Chart</div>
        <div className={styles.displayContainer}>
            <div className={styles.filter}><BarChartFilter settings={settings} setSettings={setSettings} categories={categories}/></div>
            {error&&<div className={styles.error}>{error}</div>}
            {loading&& <div className={styles.loading}>loading....</div>}
            {(data && !loading && !error)&&
                ((data.length>0)?
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={400}>
                        {settings.chartType==="bar"?
                            <BarChart data={data} barGap={2} barSize={10} barCategoryGap={2}>
                                <XAxis dataKey="period" />
                                <YAxis tickFormatter={(value)=>`$${value}`}/>
                                <Tooltip />
                                <Bar dataKey="total" fill="#F44336" />
                            </BarChart>
                        :
                            <LineChart data={data}>
                                <XAxis dataKey="period" />
                                <YAxis tickFormatter={(value)=>`$${value}`}/>
                                <Tooltip />
                                <Line type="monotone" dataKey="total" stroke="#F44336" />
                            </LineChart>
                        }
                    </ResponsiveContainer>  
                    </div>
                :
                    <div className={styles.noData}>No Data</div>
                )
            }   
                    
        </div> 

    </div>
    )
}

                