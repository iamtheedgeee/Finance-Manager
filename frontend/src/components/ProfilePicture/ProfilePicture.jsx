import styles from './ProfilePicture.module.css'

export default function ProfilePicture({image}){
    return(
        <div className={styles.container}>
            {image}
        </div>
    )
}