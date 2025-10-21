import styles from "./AccountItem.module.css"
import {useState} from 'react'
import { useDispatch } from "react-redux"
import AccountForm from "../AccountForm/AccountForm"
import { deleteAccount } from "../../../store/accountSlice"
import { Trash2Icon } from "lucide-react"

export default function AccountItem({account}){
    const dispatch=useDispatch()
    const [showForm,setShowForm]=useState(false)
    const initialValues={
        name:account.name,
        type:account.type,
        id:account.id
    }

    async function handDelete(){
        try{
            await dispatch(deleteAccount(account.id)).unwrap()
        } catch(error){
            alert(error.message)
        } 
    }  
    async function handEdit(){
        setShowForm(true)
    }

    function handleRemove(){
        setShowForm(false)
    }
        
    return (
        <>
            <div className={styles.container} onClick={()=>{handEdit()}}>
                <div className={styles.left}>
                    <div className={styles.delete} onClick={()=>{handDelete()}}><Trash2Icon size={14}/></div>
                    <div className={styles.name}>{account.name}</div>
                </div>
                <div className={styles.type}>{account.type}</div>
                <div className={styles.balance}>${account.balance}</div>            
            </div>
            {showForm && <AccountForm hideForm={handleRemove} mode="edit" initialValues={initialValues}/>}
        </>
        
    )
}