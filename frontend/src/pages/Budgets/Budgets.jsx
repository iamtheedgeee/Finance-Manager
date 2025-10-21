import BudgetForm from "../../components/BudgetForm/BudgetForm";
import { useEffect,useState } from "react"
import { useSelector,useDispatch } from "react-redux";
import { getBudgets } from "../../store/budgetSlice";
import styles from "./Budgets.module.css"
import CreateButton from "../../components/CreateButton/CreateButton";
import BudgetItem from "../../components/BudgetItem/BudgetItem";
export default function Budgets(){
    const dispatch=useDispatch()
    const {budgets,status,error}=useSelector((state)=>state.budget)
    const [showForm,setShowForm]=useState(false)
    
    function handleAdd(){
        setShowForm(true)
    }

    function handleRemove(){
        setShowForm(false)
    }
    useEffect(()=>{
        console.log(budgets)
        if(status==='idle')dispatch(getBudgets())
    },[])
    return(
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.title}>Budgets</div>
            </div>
            <div className={styles.space}>
                {budgets.map((budget)=>{
                    return <BudgetItem key={budget.id} budget={budget}/>
                })} 
                <div className={styles.card}>
                    <div className={styles.text}>
                        Add a Budget to Track your spendings and make better spending decisions!
                    </div>
                    <CreateButton text={"Create a New Budget"} func={handleAdd}/>
                </div>
            </div>
            {showForm &&<BudgetForm hideForm={handleRemove}/>}
        </div>
    )
}