import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from '../charts.module.css'
import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { getExpensePieChartData } from "../../../services/appService";
import Loading from "../../../components/Loading/Loading";


const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0",
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
  "#FF9F40", "#C9CBCF", "#FF4C4C", "#4CAF50", "#795548",
  "#03A9F4", "#E91E63", "#9C27B0", "#FFC107", "#607D8B"
];

export default function ExpensePieChart({type}) {
  const {filters}=useSelector((state)=>state.transaction)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)
  const [data,setData]=useState(null)

  async function fetchData(){
    setError(null)
    setLoading(true)
    try{
        const chartData= await getExpensePieChartData(filters.date,type)
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
  useEffect(()=>{
    fetchData()
  },[filters.date])
  return (
  <div className={styles.mainContainer}>
    <div className={styles.title}>{type} Pie Chart</div>
    <div className={styles.displayContainer}>
        {error&&<div className={styles.error}>{error}</div>}
        {loading&& <div className={styles.loading}>
            <Loading/>
          </div>}
        {(data && !loading && !error)&&
            ((data.length>0)?
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={400} height={400}>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) / 2;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                            return (
                              <text
                                x={x}
                                y={y}
                                fill="#fff"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize={12}
                              >
                                {(percent * 100).toFixed(0)}%
                              </text>
                            );
                          }}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
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

