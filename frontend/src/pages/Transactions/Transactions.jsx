import TransactionForm from "./TransactionForm/TransactionForm";
import ImportForm from "./ImportForm/ImportForm"
import { useEffect,useState } from "react"
import { useSelector,useDispatch } from "react-redux";
import { getTransactions, setFilters } from "../../store/transactionSlice";
import styles from "./Transactions.module.css"
import CreateButton from "../../components/CreateButton/CreateButton";
import Loading from "../../components/Loading/Loading"
import TransactionItem from "./TransactionItem/TransactionItem";
import Filter from './Filter/Filter'
import { PlusCircle } from 'lucide-react';
import Overview from "../../components/Overview/Overview";
import { useMediaQuery } from "react-responsive";
export default function Transactions(){
    const dispatch=useDispatch()
    const {transactions,status,error,filters,meta}=useSelector((state)=>state.transaction)
    const [groupedTransactions,setGroupedTransactions]=useState({})

    useEffect(()=>{
        if(status==='idle'){
            dispatch(getTransactions())
        }
    },[filters])

    useEffect(()=>{
        const grouped=transactions.reduce((acc,transaction)=>{
            let date=new Date(transaction.date)
            date=date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            (acc[date]||=[]).push(transaction)
            return acc
        },{})
        setGroupedTransactions(grouped)
    },[transactions]) 
    return(
        <>
            {status==='loading' && <Loading/>}
            {status==='success'&&
                (transactions.length>0?
                <div className={styles.table}>
                    {
                                        Object.entries(groupedTransactions).map(([date,transactions])=>{
                                            return(
                                                <div className={styles.tableEntry} key={date}>
                                                    <div className={styles.entryTitle}>
                                                        {date}
                                                    </div>
                                                    <div className={styles.entryItems}>
                                                        {transactions.map((transaction)=>{
                                                            return <TransactionItem key={transaction.id} transaction={transaction}/>
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })
                    }
                </div>
                :
                <div className={styles.none}>No Transactions</div>
            )}
            
        </>
    )
}