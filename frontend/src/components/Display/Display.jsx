import styles from './Display.module.css'
export default function Display({title,info,color}){
    return (
        <div className={styles.container}>
            <div className={styles.title}>{title}</div>
            <div className={`${styles.info} ${styles[color]}`}>${info}</div>
        </div>
    )
}