import { deleteCategory } from "../../store/categorySlice"
import {useState} from 'react'
import { useDispatch } from "react-redux"
import CategoryForm from "../CategoryForm/CategoryForm"
import styles from "./CategoryItem.module.css"
import { Trash2Icon } from "lucide-react"
export default function CategoryItem({category}){
    const dispatch=useDispatch()
    const [showForm,setShowForm]=useState(false)
    const initialValues={
        id:category.id,
        name:category.name,
        type:category.type,
        transLength:category.transactions.length
    }
    
    async function handDelete(e){
        e.stopPropagation()
        try{
            await dispatch(deleteCategory(category.id)).unwrap()
        } catch(error){
            alert(error.message)
        }
    }  
    async function handleEdit(){
        setShowForm(true)
    }

    function handleRemove(){
        setShowForm(false)
    }

    return (
        <>
            <div className={styles.container} onClick={handleEdit}>
                <div className={styles.left}>
                    <div className={styles.name}>{category.name}</div>
                </div>
                <div className={styles.right}>
                    <div className={styles.delete} onClick={handDelete}><Trash2Icon/></div>
                </div>
            </div>
            {showForm && <CategoryForm hideForm={handleRemove} mode="edit" initialValues={initialValues}/>}

        </>

    )
}