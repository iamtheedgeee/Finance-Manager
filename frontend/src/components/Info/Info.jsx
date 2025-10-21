import ProfilePicture from '../ProfilePicture/ProfilePicture.jsx'
import styles from './Info.module.css'
import { useEffect, useState } from 'react'
import {useMediaQuery} from 'react-responsive'
import { useSelector } from 'react-redux'
import { logout } from '../../services/authService'
import { Link } from 'react-router-dom'
import { ChevronDown,ChevronUp } from "lucide-react";

export default function Info(){
    const user=useSelector((state)=>state.user.userInfo)
    const isDesktop=useMediaQuery({minWidth:1024})
    const [initials,setInitials]=useState('')
    const [menu,setMenu]=useState(false)
    useEffect(()=>{
       if(user){
        setInitials(user.username[0])
        }else{
            setInitials('')
        }
    },[user])
    return <div className={styles.anchor}>
                <div className={styles.container}>
                    <div 
                        className={styles.info} 
                        onClick={()=>{setMenu(!menu)}}
                    >
                        <ProfilePicture image={initials}/>
                        <div className={`${styles.username} ${(!isDesktop&&!menu)&&styles['hide']}`}>{user.username}</div>
                        <span>
                            {
                                menu?
                                    <ChevronUp size={16}/>
                                :
                                    <ChevronDown size={16}/>
                            }
                        </span>
                    </div> 
                    <div className={`${styles.options} ${!menu&&styles['hide']}`}>
                        <Link to='/accounts' className={styles.option} onClick={()=>{setMenu(false)}}>Accounts</Link>
                        <span className={styles.option} onClick={logout}>Logout</span>
                    </div>   
                </div>
                {menu&&<div className={styles.backdrop} 
                            onClick={()=>{
                                setMenu(false)
                            }}
                        />
                }
            </div>
}

                
