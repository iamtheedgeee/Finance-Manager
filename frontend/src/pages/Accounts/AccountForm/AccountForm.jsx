import {Formik,Form,Field,ErrorMessage} from "formik"
import {X} from "lucide-react"
import styles from '../../../components/form.module.css'
import {useDispatch} from "react-redux"
import { createAccount, editAccount } from "../../../store/accountSlice"
export default function AccountForm({hideForm, mode="create", initialValues={name:'',type:'BANK',balance:''}}){
    const dispatch=useDispatch()
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
                        errors.general="Account Name is Required"
                    }

                    //Type Validation Here
                    if(!values.type){
                        errors.general="Account Type is Required"
                    }

                    //Balance Validation Here
                    if(mode==="create" && !values.balance){
                        errors.general="Balance Required"
                    }
                    else if(values.balance<100){
                        errors.general="How are you that Broke"
                    }


                    return errors;
                }}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async(values,{setSubmitting,setErrors})=>{
                    console.log("Clicked")
                    try{
                        if(mode==="create"){
                            const account=await dispatch(createAccount(values)).unwrap()
                        }
                        if(mode==="edit"){
                            const account=await dispatch(editAccount(values)).unwrap()
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
                        <h3 className={styles.title}>{mode==="create"?"Add New Account":"Edit Account"}</h3>
                        <div className={styles.formItems}>
                            <div className={styles.formLabel}>
                            <label htmlFor="name" className={styles.label}>Name:</label>
                            <label htmlFor="type" className={styles.label}>Type:</label>
                            {mode==="create"&&<label htmlFor="balance" className={styles.label}>Balance:</label>}
                            </div>
                            <div className={styles.formInput}>
                                <Field type="text" name="name" id="name" className={styles.input}/>
                                <ErrorMessage name="name" component="p" className={styles.error}/>

                                <Field as="select" name="type" id="type" className={styles.input}>
                                    <option value={"CASH"}>CASH</option>
                                    <option value={"BANK"}>BANK</option>
                                </Field>
                                <ErrorMessage name="type" component="p" className={styles.error}/>
                                {mode==="create" &&
                                    <>
                                        <Field type="number" name="balance" id="balance" className={styles.input}/>
                                        <ErrorMessage name="balance" component="p" className={styles.error}/>
                                    </>
                                }
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