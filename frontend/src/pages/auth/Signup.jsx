import './Login.module.css'
import { Link, useNavigate } from 'react-router-dom'
import {Formik,Form,Field,ErrorMessage} from "formik"
import { signup } from '../../services/authService'
import styles from './login.module.css'


export default function Signup(){
    const navigate=useNavigate()
    return (
        <div className={styles.mainContainer}>
            <h2 className={styles.authTitle}>Signup</h2>
            <Formik
                initialValues={{username:'',email:'',password:'',confirmPassword:''}}
                validate={(values)=>{
                    const errors={}

                    //Username Validation
                    if(!values.username){
                        errors.username="Username is required"
                    }

                    //Email Validation
                    if(!values.email){
                        errors.email="Email is requrired"
                    } else if(
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ){
                        errors.email="Invalid email address"
                    }

                    //Password Validation
                    if(!values.password){
                        errors.password="Password is required"
                    }
                    if(!values.confirmPassword){
                        errors.confirmPassword="Repeat Password here"
                    }
                    if(values.password!==values.confirmPassword){
                        errors.confirmPassword="Passwords do not match"
                    }
                    return errors;
                }}
                onSubmit={async(values,{setSubmitting,setErrors})=>{
                    console.log("Submitting..")
                    try{
                        await signup(values.username,values.email,values.password)
                        navigate('/')
                    } catch(error){
                        console.log(error)
                        setErrors({general:error.message})
                    } finally {
                        setSubmitting(false)
                    }
                }}
            >
                {({isSubmitting,errors})=>(
                    <>
                        <Form className={styles.authForm}>
                            <Field type="text" name="username" placeholder="Username"/>
                            <ErrorMessage name="username" component="p" className={styles.errorMessage}/>
                            
                            <Field type="email" name="email" placeholder="Email"/>
                            <ErrorMessage name="email" component="p" className={styles.errorMessage}/>

                            <Field type="password" name="password" placeholder="Password"/>
                            <ErrorMessage name="password" component="p" className={styles.errorMessage}/>                            
                            
                            <Field type="password" name="confirmPassword" placeholder="Confirm Password"/>
                            <ErrorMessage name="confirmPassword" component="p" className={styles.errorMessage}/>                            

                            <button type="submit" disabled={isSubmitting}>Submit</button>
                            
                            {(isSubmitting && !errors.general)&&(<div className={styles.loadingMessage}>Creating.......</div>)} 
                            {(errors.general && !isSubmitting) &&(<div className={styles.errorMessage}>{errors.general}</div>)}
                        </Form>
                    </>
                )}
            </Formik>
            <p className={styles.authFooter}>
                    Already signed up? <Link to="/login">Login</Link>
            </p>
        </div>
    )
}