import styles from './CreateButton.module.css'
export default function CreateButton({text,func,icon}){
    return <button className={styles.button} onClick={func}>
        {icon}
        {text}
        </button>
}