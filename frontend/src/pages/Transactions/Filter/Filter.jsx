import "react-datepicker/dist/react-datepicker.css";
import styles from './Filter.module.css'
import { useSelector,useDispatch } from 'react-redux'
import { setFilters,resetFilters } from '../../../store/transactionSlice'
import { useEffect,useState,useRef } from "react"
import { getAccounts } from "../../../store/accountSlice"
import { getCategories } from "../../../store/categorySlice"
import { ChevronDown,ChevronUp,Check, DatabaseIcon } from "lucide-react";
import {X} from "lucide-react"
import { getDateRange } from "../../../services/appService";
import { useMediaQuery } from "react-responsive";
//for account and category select
function CustomDropdown({title,list,filters,object,handleChange}){
    const [showDropdown,setShowDropdown]=useState(false)
    const dropdownRef=useRef(null)
    useEffect(()=>{
        function handleClick(e){
            if(dropdownRef.current&& !dropdownRef.current.contains(e.target)){
                setShowDropdown(false)
            }
        }

        if(showDropdown){
            document.addEventListener('mousedown',handleClick)
        }

        return()=>{document.removeEventListener('mousedown',handleClick)}
    },[showDropdown])
    return(
        <div className={`${styles.optionInput} ${styles.dropdown}`}>
            <div className={styles.dropdownHeader} onClick={()=>{setShowDropdown(true)}}><span>{title}</span><span>{showDropdown?<ChevronUp/>:<ChevronDown/>}</span></div>
            {showDropdown&&<div className={styles.dropdownItems} ref={dropdownRef}>
                {list.map((listItem)=>{
                    return (
                        <div key={listItem.id} className={styles.optionItem}>
                            <input 
                                type='checkbox' 
                                name={object}
                                value={listItem.name}
                                data-type={listItem.type}
                                id={listItem.name}
                                checked={filters[object].includes(listItem.name)}
                                onChange={handleChange}
                            />
                            <label htmlFor={listItem.name}>{listItem.name}</label>
                        </div>
                    )
                })}
                
            </div>}
        </div>
    )
}
export default function Filter(){
    const dispatch=useDispatch()
    const {filters}=useSelector((state)=>state.transaction)
    const isDesktop=useMediaQuery({minWidth:905})
    
    const {accounts,status:accountStatus}=useSelector((state)=>state.account)
    const {categories,status:categoryStatus}=useSelector((state)=>state.category)
    const [customStart, setCustomStart] = useState(filters.date.custom?.customStart||'');
    const [customEnd, setCustomEnd] = useState(filters.date.custom?.customEnd||'');

    function handleChange(e){
        const {name, value, checked,dataset:{type:catType}}=e.target
        if(checked){
            switch(name){
                case "type":
                    const toBeSet=categories.map(
                        (category)=>{
                            if(category.type===value)
                                return category.name
                        })
                    dispatch(setFilters(
                        {
                        ...filters,
                        category:[...filters.category,...toBeSet],
                        [name]:[...filters[name],value]
                        }
                    ))
                    break
                default:
                    dispatch(setFilters(
                        {
                            ...filters,
                            [name]:[...filters[name],value]
                        }
                    ))

            }
        } else{
            dispatch(setFilters(
                {
                    ...filters,
                    [name]:filters[name].filter((item)=>item!==value)
                }
            ))
        }
    }

    async function handlePresetChange(e){
        dispatch(setFilters({
        ...filters,
            date:{
                preset:e.target.value,
            }
        }))
        try{
            const {gte,lte}=await getDateRange(e.target.value)
            setCustomStart(gte.slice(0,10))
            setCustomEnd(lte.slice(0,10))

        }catch(error){
            console.log(error)
        }
                           
    }
    useEffect(()=>{
        async function setDate(){
            const {gte,lte}=await getDateRange(filters.date.preset)
            setCustomStart(gte.slice(0,10))
            setCustomEnd(lte.slice(0,10))
        }   
        if(accountStatus==="idle"){
            dispatch(getAccounts())
        }
        if(categoryStatus==="idle"){
            dispatch(getCategories())
        }

        if(filters.date.preset)setDate()
    },[])

    useEffect(()=>{
        console.log(filters.date)
    },[filters])
    return (
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.title}>Filter</div>
                    <div className={styles.reset} onClick={()=>{dispatch(resetFilters())}}>Reset</div>
                </div>
                <div className={styles.filterContainer}>
                    
                    <div className={styles.option}>
                        <label className={styles.optionHeader}>Category</label>
                        <CustomDropdown title={"Select Categories"} list={categories} filters={filters} object={"category"} handleChange={handleChange}/>
                    </div>

                    <div className={styles.option}>
                        <label className={styles.optionHeader}>Account</label>
                        <CustomDropdown title={"Select Accounts"} list={accounts} filters={filters} object={'account'} handleChange={handleChange}/>
                    </div>
{/*
                    <div className={styles.option}>
                        <label className={styles.optionHeader}>Type</label>
                        <div className={styles.optionItem}>
                            <label htmlFor='income'>Income</label>
                            <input 
                                type='checkbox' 
                                name="type" 
                                value="INCOME" 
                                id="income"
                                checked={filters.type.includes("INCOME")}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.optionItem}>
                            <label htmlFor='expense'>Expense</label>
                            <input 
                                type='checkbox' 
                                name="type" 
                                value="EXPENSE" 
                                id="expense"
                                checked={filters.type.includes("EXPENSE")}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
*/}

                    <div className={styles.option}>
                        <label className={styles.optionHeader}>Date</label>
                        <div className={styles.dateOptions}>
                            <select 
                                name='date' 
                                className={styles.dateSelect}
                                onChange={handlePresetChange}
                                value={filters.date.preset||''} 
                            >
                                <option value="today">Today</option>
                                <option value="last7days">Last 7 days</option>
                                <option value="thisMonth">This Month</option>
                                <option value="thisYear">This Year</option>
                                <option value="allTime">All Time</option>
                                <option value='' disabled>Custom</option>
                            </select>
{   isDesktop&&                 
                            <div className={styles.customDateContainer}>
                                <input type="date" id="startDate" value={customStart}
                                    className={styles.customDate}                                
                                    onChange={(e)=>{
                                        e.target.blur()
                                    setCustomStart(e.target.value)
                                    }}
                                />
                                <span>-</span>
                                <input type="date" id="endDate" value={customEnd}
                                    className={styles.customDate}                                
                                    onChange={(e)=>{
                                        setCustomEnd(e.target.value)
                                    }}
                                />
                                <button 
                                    onClick={()=>{
                                    (customStart&&customEnd)?
                                    dispatch(setFilters({
                                        ...filters,
                                        date:{
                                            custom:{
                                                customStart,
                                                customEnd
                                            }
                                        }
                                    })):alert("no can do bruh")
                                }}><Check/></button> 
                            </div>
}
                        </div>
                    </div>              
                </div>

        </div>
    )
}


