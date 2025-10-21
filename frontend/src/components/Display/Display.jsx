import styles from './Display.module.css'
import Loading from '../Loading/Loading'
export default function Display({title,info,color}){
    return (
        <div className={styles.container}>
            <div className={styles.title}>{title}</div>
            <div className={`${styles.info} ${styles[color]}`}>
                {
                    info===null?
                        <Loading/>
                    :
                        `$${info}`
                }
            </div>
        </div>
    )
}