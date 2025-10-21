import {Formik,Form,Field} from "formik"
import { useEffect } from "react"
import {X} from "lucide-react"
import styles from '../form.module.css'
import {useDispatch,useSelector} from "react-redux"
import { createBudget, editBudget } from "../../store/budgetSlice"
import { getCategories } from "../../store/categorySlice"
export default function BudgetForm({hideForm,mode="create",initialValues={categoryId:'',limit:''}}){
    const dispatch=useDispatch()
    const {categories,status:categoryStatus}=useSelector((state)=>state.category)

    useEffect(()=>{
        if(categoryStatus==="idle"){
            dispatch(getCategories())
        }
    },[])
    const editingCategory=categories.filter(category=>category.id===initialValues.categoryId)[0]
    const selectDisabled=(editingCategory?.transactions.length>0)
    
    if(categoryStatus==="idle" || categoryStatus==="loading"){
        return <></>
    }
    return(
        <div className={styles.formContainer}>
        <div className={styles.mainContainer}>
            <div className={styles.xButton}><X size={25} onClick={hideForm}/></div>
            <Formik
                initialValues={initialValues}
                validate={(values)=>{
                    const errors={}

                    //Name validation Here
                    if(!values.categoryId){
                        errors.general="Select a Category For your Budget"
                    }

                    //Type Validation Here
                    if(!values.limit){
                        errors.general="Enter a Budget Limit"
                    }
                    else if(values.limit<100){
                        errors.general=" Limit too small. What are you, some sort of masochist?"
                    }



                    return errors;
                }}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async(values,{setSubmitting,setErrors})=>{
                    try{
                        if(mode==="create"){
                            const budget=await dispatch(createBudget(values)).unwrap()
                        }else{
                            const budget=await dispatch(editBudget(values)).unwrap()
                        }
                        hideForm()
                    }catch(error){
                        setErrors({general:error.message})
                    }finally{
                        setSubmitting(false)
                    }
                }}
            >
            {({isSubmitting,errors})=>(
                <>
                    <Form className={styles.form}>
                        <h3 className={styles.title}>{mode==="create"?"Create Budget":"Edit Budget"}</h3>
                        <div className={styles.formItems}>
                            <div className={styles.formLabel}>
                                <label htmlFor="categoryId" className={styles.label}>Category:</label>
                                <label htmlFor="limit" className={styles.label}>Limit:</label>
                            </div>
                            <div className={styles.formInput}>
                                <Field as="select" name="categoryId" id="categoryId" className={styles.input} disabled={selectDisabled}>
                                    <option value="">Choose A Category</option>
                                    {categories.map((category)=>{
                                        if(category.id===initialValues.categoryId){
                                                return <option key={category.id} value={category.id}>{category.name}</option>   
                                        }
                                        if(category.type==="EXPENSE" && !category.budget){
                                                return <option key={category.id} value={category.id}>{category.name}</option>   
                                        }
                                    })}
                                </Field>
                                <Field type="number" name="limit" id="limit" className={styles.input}/>

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