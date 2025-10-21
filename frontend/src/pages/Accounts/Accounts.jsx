import AccountForm from "./AccountForm/AccountForm";
import { useEffect,useState } from "react"
import { useSelector,useDispatch } from "react-redux";
import { getAccounts } from "../../store/accountSlice";
import AccountItem from "./AccountItem/AccountItem";
import styles from "./Accounts.module.css"
import CreateButton from "../../components/CreateButton/CreateButton";
import { PlusCircle } from "lucide-react";
export default function Accounts(){
    const dispatch=useDispatch()
    const {accounts,status,error}=useSelector((state)=>state.account)
    const [showForm,setShowForm]=useState(false)
    
    function handleAdd(){
        setShowForm(true)
    }

    function handleRemove(){
        setShowForm(false)
    }
    useEffect(()=>{
        if(status==="idle")dispatch(getAccounts())
    },[])
    return(
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.title}>Accounts</div>
                <CreateButton func={handleAdd} text={'New Account'} icon={<PlusCircle/>}/>
            </div>
            <div className={styles.listContainer}>
                {accounts.map((account)=>{
                    return <AccountItem key={account.id} account={account}/>
                })}
            </div>
            
            {showForm && <AccountForm hideForm={handleRemove}/>}
        </div>
    )
}