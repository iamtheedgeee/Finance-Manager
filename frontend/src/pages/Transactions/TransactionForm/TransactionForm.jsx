import {Formik,Form,Field,ErrorMessage} from "formik"
import {X} from "lucide-react"
import styles from '../../../components/form.module.css'
import {useDispatch,useSelector} from "react-redux"
import { createTransaction, editTransaction } from "../../../store/transactionSlice"
import { useEffect } from "react"
import { getAccounts } from "../../../store/accountSlice"
import { getCategories } from "../../../store/categorySlice"
function getCurrentDateTimeLocal() {
  const now = new Date()
  return now.toISOString().slice(0, 16)
}
export default function TransactionForm({hideForm,mode="create",initialValues={date:getCurrentDateTimeLocal(),accountId:"",categoryId:"",amount:"",notes:"",type:""}}){
    const dispatch=useDispatch()
    const {accounts,status:accountStatus}=useSelector((state)=>state.account)
    const {categories,status:categoryStatus}=useSelector((state)=>state.category)
    useEffect(()=>{
        if(accountStatus==="idle"){
            dispatch(getAccounts())
        }
        if(categoryStatus==="idle"){
            dispatch(getCategories())
        }
    },[])
        if(categoryStatus==="idle" || categoryStatus==="loading"){
            return <></>
        }
    return (
        <div className={styles.formContainer}>
        <div className={styles.mainContainer}>
            <div className={styles.xButton}><X size={25} onClick={hideForm}/></div>
            <Formik
                initialValues={mode==='create'?{...initialValues,categoryId:categories[0]?.id,accountId:accounts[0]?.id}:initialValues}
                validate={(values)=>{
                    const errors={}

                    if(!values.date || !values.accountId || !values.categoryId || !values.amount){
                        errors.general="Fill in required Fields"
                    }
        

                    return errors;
                }}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async(values,{setSubmitting,setErrors})=>{
                    try{
                        if(mode==="create"){
                            const transaction=await dispatch(createTransaction(values)).unwrap()
                        } else if(mode==="edit"){
                            const transaction=await dispatch(editTransaction(values)).unwrap()
                        }
                        hideForm()
                    }catch(error){
                        setErrors({general:error.message})
                    }finally{
                        setSubmitting(false)
                    }
                }}
            >
            {({isSubmitting,errors,values,handleChange,setFieldValue})=>(
                <>
                    <Form className={styles.form}>
                        <h3 className={styles.title}>{mode==="create"?"Create New Transaction":"Edit Transaction"}</h3>
                        <div className={styles.formItems}>
                            <div className={styles.formLabel}>
                                <label htmlFor="date" className={styles.label}>Date:</label>
                                <label htmlFor="accountId" className={styles.label}>Account:</label>
                                <label htmlFor="categoryId" className={styles.label}>Category:</label>
                                <label htmlFor="amount" className={styles.label}>Amount:</label>
                                <label htmlFor="notes" className={styles.label} id={styles.notesLabel}>Notes:</label>
                            </div>
                            <div className={styles.formInput}>
                                <Field type="datetime-local" name="date" id="date" className={styles.input}/>

                                <Field as="select" name="accountId" id="accountId" className={styles.input}>
                                    <option value=''>Select Account</option>
                                    {accounts.map((account)=>{
                                        return <option key={account.id} value={account.id}>{account.name}</option>
                                    })}
                                </Field>
                                
                                <Field as="select" name="categoryId" id="categoryId" className={styles.input}
                                     onChange={(e) => {
                                        handleChange(e)
                                        const value=e.target.value
                                        let category=categories.filter(category=>category.id===value)[0]
                                        switch (category.type){
                                            case "EXPENSE":
                                                setFieldValue('type',"E")
                                                break
                                            case "INCOME":
                                                setFieldValue("type","I")
                                                break                            
                                        }
                                    }}
                                >
                                    {categories.map((category)=>{
                                        return <option key={category.id} value={category.id}>{category.name}</option>
                                    })}
                                </Field>

                                <Field type="number" name="amount" id="amount" className={styles.input}/>

                                <Field as="textarea" name="notes" id="notes" className={styles.input}/>
                            </div>
                        </div>
                        <button type="submit" disabled={isSubmitting} className={`${styles.input} ${styles.button}`}>{isSubmitting?"Saving":"Save"}</button>
                        {(errors.general && !isSubmitting) &&(<div className={styles.error}>{errors.general}</div>)} 

                    </Form>
                </>
            )}
            </Formik>
        </div>
        </div>
    )
}