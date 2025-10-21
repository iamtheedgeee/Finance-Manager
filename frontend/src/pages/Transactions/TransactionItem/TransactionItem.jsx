import {useState,useEffect} from 'react'
import { useDispatch } from 'react-redux'
import TransactionForm from '../TransactionForm/TransactionForm'
import styles from "./TransactionItem.module.css"
import { deleteTransaction } from '../../../store/transactionSlice'
import TransactionView from '../TransactionView/TransactionView'
import {Trash2Icon} from 'lucide-react'
export default function TransactionItem({transaction}){
    const dispatch=useDispatch()
    const [showForm,setShowForm]=useState(false)
    const [showDetails,setShowDetails]=useState(false)
    const initialValues={
        date:transaction.date.slice(0,16),
        accountId:transaction.account.id,
        categoryId:transaction.category.id,
        amount:transaction.amount,
        notes:transaction.notes,
        type:transaction.category.type==="INCOME"?"I":"E",
        oldType:transaction.category.type==="INCOME"?"I":"E",
        oldAmount:transaction.amount,
        id:transaction.id
    }
    let date=new Date(transaction.date)
    date=date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    

    async function handleDelete(e){
        e.stopPropagation()
        try{
            await dispatch(deleteTransaction({id:transaction.id,type:initialValues.type,amount:initialValues.amount,accountId:initialValues.accountId})).unwrap()
        } catch(error){
            alert(error.message)
        }
    } 


    async function handleEdit(e){
        e.stopPropagation()
        setShowForm(true)
    }

    function handleRemove(){
        setShowForm(false)
    }
    return (
        <>
            <div className={styles.container} onClick={handleEdit}>
                <div className={styles.left}>
                    <div className={styles.delete} onClick={handleDelete}><Trash2Icon size={15}/></div>
                    {/*<div className={styles.date}>{date}</div>*/}
                    <div className={styles.category}>{transaction.category.name}</div>
                </div>
                <div className={`
                    ${styles.amount} 
                    ${ transaction.category.type==="INCOME"?
                            styles.gain
                        :
                            styles.loss
                    }`}>
                    {transaction.category.type==="INCOME"?
                            "+"
                        :
                            "-"}
                    ${transaction.amount}
                </div>
                
            </div>
            {showForm && <TransactionForm hideForm={handleRemove} mode="edit" initialValues={initialValues}/>}
            {showDetails && <TransactionView transaction={transaction} hideView={removeView}/>}
        </>

    )
}