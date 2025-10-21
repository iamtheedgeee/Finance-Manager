import CategoryForm from "../../components/CategoryForm/CategoryForm";
import { useEffect,useState } from "react"
import { useSelector,useDispatch } from "react-redux";
import { getCategories } from "../../store/categorySlice";
import CategoryItem from "../../components/CategoryItem/CategoryItem";
import styles from "./Categories.module.css"
import CreateButton from "../../components/CreateButton/CreateButton";
import auxStyles from '../../components/CategoryItem/categoryItem.module.css'
export default function Categories(){
    const dispatch=useDispatch()
    const {categories,status,error}=useSelector((state)=>state.category)
    const [groupedCategories,setGroupedCategories]=useState({})
    const [showForm,setShowForm]=useState(false)
    
    function handleAdd(){
        setShowForm(true)
    }

    function handleRemove(){
        setShowForm(false)
    }
    useEffect(()=>{
        if(status==="idle")dispatch(getCategories())
    },[])

    useEffect(()=>{
        const grouped=categories.reduce((acc,category)=>{

            (acc[category.type]||=[]).push(category)

            return acc
        },{})
        setGroupedCategories(grouped)
    },[categories])
    return(
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.title}>Categories</div>
            </div>
            <div className={styles.table}>
                <CreateButton func={handleAdd} text={"Create New Category"}/>
                {
                    Object.entries(groupedCategories).map(([type,categories])=>{
                        return(
                            <div className={styles.tableEntry} key={type}>
                                <div className={styles.entryTitle}>
                                    {type} CATEGORIES
                                </div>
                                <div className={styles.entryItems}>
                                    {categories.map((category)=>{
                                        return <CategoryItem category={category} key={category.id}/>
                                    })}
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            
            {showForm && <CategoryForm hideForm={handleRemove}/>}
        </div>
    )
}