import { Link,useLocation } from "react-router-dom";
import { BarChart3,Folder, BanknoteIcon, PiggyBank, Plus } from "lucide-react";
import styles from './NavBar.module.css'
import { useMediaQuery } from "react-responsive"
import {useState} from 'react'
import TransactionForm from "../../pages/Transactions/TransactionForm/TransactionForm";

function LinkItem({link,text,location,icon}){
    return (
            <Link to={`/${link}`} className={`${styles.linkElement} ${location.pathname===`/${link}`&&styles['selected']}`}>
            {
                icon?
                    <div className={styles.linkText}>
                        <span>{icon}</span>
                        <span>{text}</span>
                    </div>

                :
                    <div className={styles.linkText}>{text}</div>

            }   
            </Link>
    )
   
}

export default function NavBar(){
    const location=useLocation()
    const isDesktop=useMediaQuery({minWidth:1024})
    const [showForm, setShowForm]=useState(false)

    function handleAdd(){
        setShowForm(true)
    }
    function handleRemove(){
        setShowForm(false)
    }
    return (
        <>
        {isDesktop?
            <nav className={styles.container}>
                <LinkItem link='transactions' text='Transactions'location={location}/>
                <LinkItem link='reports' text='Report'location={location}/>       
                <LinkItem link='budgets' text='Budgets'location={location}/>
                <LinkItem link='categories' text="Categories"location={location}/>
            </nav>
        :
            <nav className={styles.mobileContainer}>
                <LinkItem link='transactions' text='Transactions'location={location} icon={<BanknoteIcon/>}/>
                <LinkItem link='reports' text='Report'location={location} icon={<BarChart3/>}/>       
                <div className={styles.plus} onClick={handleAdd}>
                    <Plus/>
                </div>
                <LinkItem link='budgets' text='Budgets'location={location} icon={<PiggyBank/>}/>
                <LinkItem link='categories' text="Categories"location={location} icon={<Folder/>}/>
            </nav>
        }
            {showForm &&<TransactionForm hideForm={handleRemove}/>}
        </>
    )
}
