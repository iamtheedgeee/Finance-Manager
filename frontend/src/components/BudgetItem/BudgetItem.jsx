import styles from "./BudgetItem.module.css"
import {useState} from 'react'
import { useDispatch } from "react-redux"
import BudgetForm from "../BudgetForm/BudgetForm"
import { deleteBudget } from "../../store/budgetSlice"
import { Trash2Icon } from "lucide-react"
export default function BudgetItem({budget}){
    const dispatch=useDispatch()
    const [showForm,setShowForm]=useState(false)
    const spent=budget.spent??0
    const initialValues={
        limit:budget.limit,
        categoryId:budget.category.id,
        id:budget.id
    }
    const startDate=new Date(budget.startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    const endDate=new Date(budget.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    async function handleDelete(e){
        e.stopPropagation()
        try{
            await dispatch(deleteBudget(budget.id)).unwrap()
        } catch(error){
            alert(error)
        }
    }  
    async function handleEdit(){
        setShowForm(true)
    }

    function handleRemove(){
        setShowForm(false)
    }
        
    //color of progress bar
    const percent=(spent/budget.limit)*100
    let colorClass="safe"
    if(percent>=90)colorClass="danger"
    else if(percent>=90)colorClass="warning"

    return (
        <>
            <div className={styles.container} onClick={handleEdit}>
                <div className={`${styles.item} ${styles.top}`}>
                    <div className={styles.category}>{budget.category.name}</div>
                    <div className={styles.delete} onClick={handleDelete}><Trash2Icon size={14}/></div>
                </div>
                
                <div className={styles.item}>
                    <span className={`${styles.spent} ${styles[colorClass]}`}>${spent}</span> spent out of ${budget.limit}
                </div>
                <div className={styles.item}>
                    <div className={styles.progressAnchor}>
                        <progress className={`${styles.progressBar}`} id={styles[colorClass]} value={spent} max={budget.limit}/>
                        <span className={styles.percentage}>{percent.toFixed(0)}%</span>        
                    </div>
                    <div className={styles.date}><span>{startDate}</span><span>{endDate}</span></div>
                </div>           
            </div>

            {showForm && <BudgetForm hideForm={handleRemove} mode="edit" initialValues={initialValues}/>}
        </>

    )
}