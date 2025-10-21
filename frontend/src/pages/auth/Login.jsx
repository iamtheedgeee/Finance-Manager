import './Login.module.css'
import { Link, useNavigate } from 'react-router-dom'
import {Formik,Form,Field,ErrorMessage} from "formik"
import { login } from '../../services/authService'
import styles from './login.module.css'
export default function Login(){
    const navigate=useNavigate()
    return (
        <div className={styles.mainContainer}>
            <h2 className={styles.authTitle}>Login</h2>
            <Formik
                initialValues={{username:'',password:''}}
                validate={(values)=>{
                    const errors={}

                    //Username Validation
                    if(!values.username){
                        errors.username="Username is required"
                    }

                    //Password Validation
                    if(!values.password){
                        errors.password="Password is required"
                    }
                    
                    return errors;
                }}
                onSubmit={async(values,{setSubmitting,setErrors})=>{
                    try{
                        const token=await login(values.username,values.password)
                        navigate('/')
                        
                    } catch(error){
                        setErrors({general:error.message})
                    } finally{
                        setSubmitting(false)
                    }
                }}
            >
                {({isSubmitting,errors})=>(
                    <>
                        <Form className={styles.authForm}>
                            <Field type="text" name="username" placeholder="Username"/>
                            <ErrorMessage name="username" component="p" className={styles.errorMessage}/>
                            

                            <Field type="password" name="password" placeholder="Password"/>
                            <ErrorMessage name="password" component="p" className={styles.errorMessage}/>
                            <button type="submit" disabled={isSubmitting}>Login</button>
                            
                            {(isSubmitting && !errors.general)&&(<div className={styles.loadingMessage}>Signing in...</div>)} 
                            {(errors.general && !isSubmitting) &&(<div className={styles.errorMessage}>{errors.general}</div>)}
                        </Form>
                    </>
                )}
            </Formik>
            <p className={styles.authFooter}>
                   Haven't registered? <Link to="/signup">Signup</Link>
            </p>
        </div>
    )
}