import {Formik,Form,Field,ErrorMessage} from "formik"
import {X} from "lucide-react"
import styles from '../form.module.css'
import {useDispatch} from "react-redux"
import { createCategory, editCategory } from "../../store/categorySlice"
export default function CategoryForm({hideForm,mode="creating",initialValues={name:'',type:"EXPENSE"}}){
const dispatch=useDispatch()
const selectDisabled=(initialValues.transLength>0)
return(
    <div className={styles.formContainer}>
        <div className={styles.mainContainer}>
            <div className={styles.xButton}><X size={25} onClick={hideForm}/></div>
            <Formik
                initialValues={initialValues}
                validate={(values)=>{
                    const errors={}

                    //Name validation Here
                    if(!values.name){
                        errors.general="Category Name is Required"
                    }

                    //Type Validation Here
                    if(!values.type){
                        errors.general="Category Type is Required"
                    }

                    return errors;
                }}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async(values,{setSubmitting,setErrors})=>{
                    console.log("Clicked")
                    try{
                        if(mode==="creating"){
                            const category=await dispatch(createCategory(values)).unwrap()
                            console.log(category)
                        }else{
                            const category=await dispatch(editCategory(values)).unwrap()
                            console.log(category)
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
                        <h3 className={styles.title}>{mode==="creating"?"Add New Category":"Edit Category"}</h3>
                        <div className={styles.formItems}>
                            <div className={styles.formLabel}>
                            <label htmlFor="name" className={styles.label}>Name:</label>
                            <label htmlFor="type" className={styles.label}>Type:</label>
                            </div>
                            <div className={styles.formInput}>
                                <Field type="text" name="name" id="name" className={styles.input}/>
                                <ErrorMessage name="name" component="p" className={styles.error}/>

                                <Field as="select" name="type" id="type" disabled={selectDisabled} className={styles.input} >
                                    <option value={"INCOME"}>INCOME</option>
                                    <option value={"EXPENSE"}>EXPENSE</option>
                                </Field>
                                <ErrorMessage name="type" component="p" className={styles.error}/>
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