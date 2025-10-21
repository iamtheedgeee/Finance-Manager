import {useEffect,useState} from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,LineChart,Line } from 'recharts'
import styles from "../charts.module.css"
import BarChartFilter from '../BarChartFilter/BarChartFilter';
import { useSelector } from 'react-redux';
import { getIncomeExpenseChartData } from '../../../services/appService';
import Loading from '../../../components/Loading/Loading';


export default function IncomeExpenseChart() {
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [data,setData]=useState(null)
    const {filters}=useSelector((state)=>state.transaction)
    const [settings,setSettings]=useState({
        interval:"YYYY-MM-DD",
        chartType:"bar"
    })
    async function fetchData(){
        setError(null)
        setLoading(true)
        try{
            console.log('fetching....')

            const chartData=await getIncomeExpenseChartData(filters.date,settings.interval)
            if(chartData){
                setData(chartData)
                setLoading(false)
                setError(null)
            }
        } catch(error){
            setError("Something went wrong")
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchData()
    },[filters.date,settings.interval])
    return (
        <div className={styles.mainContainer}>
            <div className={styles.title}>Income Expense Chart</div>
            <div className={styles.displayContainer}>
                <div className={styles.filter}><BarChartFilter settings={settings} setSettings={setSettings}/></div>
                {error&&<div className={styles.error}>{error}</div>}
                {loading&& <div className={styles.loading}>
                        <Loading/>
                    </div>}
                {(data && !loading && !error)&&
                    ((data.length>0)?
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height='100%'>
                                {settings.chartType==="bar"?
                                    <BarChart data={data} barGap={2} barSize={10} barCategoryGap={2}>
                                        <XAxis dataKey="period" />
                                        <YAxis tickFormatter={(value)=>`$${value}`}/>
                                        <Tooltip />
                                        <Bar dataKey="INCOME" fill="#4CAF50"/>
                                        <Bar dataKey="EXPENSE" fill="#F44336"/>
                                    </BarChart>
                                :
                                    <LineChart data={data}>
                                        <XAxis dataKey="period" />
                                        <YAxis tickFormatter={(value)=>`$${value}`}/>
                                        <Tooltip />
                                        <Line type="monotone" dataKey="INCOME" stroke="#4CAF50" />
                                        <Line type="monotone" dataKey="EXPENSE" stroke="#F44336" />
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

