import {Outlet } from "react-router-dom"
import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import { PlusCircle } from "lucide-react"
import CreateButton from "../components/CreateButton/CreateButton"
import Filter from "../pages/Transactions/Filter/Filter"
import Overview from "../components/Overview/Overview"
import ImportForm from "../pages/Transactions/ImportForm/ImportForm"
import TransactionForm from "../pages/Transactions/TransactionForm/TransactionForm"
import '../App.css'
export default function TransRepLayout(){
  const [showForm,setShowForm]=useState(false)
  const [showImport,setShowImport]=useState(false)
  const isDesktop=useMediaQuery({minWidth:1024})
  
  //Transaction Form
  function handleAdd(){setShowForm(true)}
  function handleRemove(){setShowForm(false)}

  //Import Form
  function handleImport(){setShowImport(true)}
  function removeImport(){setShowImport(false)}
  
  return(
    <div className='transRepContainer'>
      <div className='top'>
          {isDesktop&&<CreateButton func={handleAdd} text={'Add Transaction'} icon={<PlusCircle/>}/>}
          <button className='import' onClick={handleImport}>Import</button>
      </div>
      <Filter/>
      <Overview/>
      <Outlet/>
      {showImport && <ImportForm hide={removeImport}/>}
      {showForm &&<TransactionForm hideForm={handleRemove}/>}
    </div>
  )
}