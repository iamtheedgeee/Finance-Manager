import TransactionForm from "./TransactionForm/TransactionForm";
import ImportForm from "./ImportForm/ImportForm"
import { useEffect,useState } from "react"
import { useSelector,useDispatch } from "react-redux";
import { getTransactions, setFilters } from "../../store/transactionSlice";
import styles from "./Transactions.module.css"
import CreateButton from "../../components/CreateButton/CreateButton";
import TransactionItem from "./TransactionItem/TransactionItem";
import Filter from './Filter/Filter'
import { PlusCircle } from 'lucide-react';
import Overview from "../../components/Overview/Overview";
import { useMediaQuery } from "react-responsive";
export default function Transactions(){
    const dispatch=useDispatch()
    const {transactions,status,error,filters,meta}=useSelector((state)=>state.transaction)
    const [showForm,setShowForm]=useState(false)
    const [showImport,setShowImport]=useState(false)
    const [groupedTransactions,setGroupedTransactions]=useState({})
    const isDesktop=useMediaQuery({minWidth:1024})
    
    //Transaction Form
    function handleAdd(){setShowForm(true)}
    function handleRemove(){setShowForm(false)}

    //Import Form
    function handleImport(){setShowImport(true)}
    function removeImport(){setShowImport(false)}

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
        <div className={styles.container}>
            <div className={styles.top}>
                {isDesktop&&<CreateButton func={handleAdd} text={'Add Transaction'} icon={<PlusCircle/>}/>}
                <button className={styles.import} onClick={handleImport}>Import</button>
            </div>
            <Filter/>
            <Overview/>
            {transactions.length>0?
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
            }
            {showImport && <ImportForm hide={removeImport}/>}
            {showForm &&<TransactionForm hideForm={handleRemove}/>}
        </div>
    )
}