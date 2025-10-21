import { useEffect, useState } from "react"
import { useSelector,useDispatch } from "react-redux"
import Display from "../Display/Display"
import styles from './Overview.module.css'
import { getSummary } from "../../store/userSlice"
import { useMediaQuery } from "react-responsive"

export default function Overview(){
    const dispatch=useDispatch()
    const isDesktop=useMediaQuery({minWidth:1024})
    const {userInfo:user,totalBalance,totalIncome,totalExpense,summaryStatus}=useSelector((state)=>state.user)
    const {filters}=useSelector((state)=>state.transaction)  
    useEffect(()=>{
        dispatch(getSummary())
    },[filters.date]) 

    
    return(
        <div className={styles.container}>
                {//summaryStatus==="success"&&
                    isDesktop?
                        <>
                            <Display title={"Total Balance"} info={totalBalance} color="green"/>
                            <Display title={"Period Income"} info={totalIncome} color="green"/>
                            <Display title={"Period Expense"} info={totalExpense} color="green"/>
                            <Display title={"Net Change"} info={totalIncome-totalExpense} color="green"/>
                        </>
                    :
                        <div className={styles.mobileContainer}>
                            <div>
                                <Display title={"Total Balance"} info={totalBalance} color="green"/>
                                <Display title={"Net Change"} info={totalIncome-totalExpense} color="green"/>
                            </div>
                            <div>
                                <Display title={"Period Income"} info={totalIncome} color="green"/>
                                <Display title={"Period Expense"} info={totalExpense} color="green"/>
                            </div>
                        </div>
                }
        </div>
    )
}