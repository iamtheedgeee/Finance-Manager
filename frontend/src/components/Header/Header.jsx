import Info from '../Info/Info.jsx'
import styles from './Header.module.css'
import NavBar from '../NavBar/NavBar.jsx'
import {useMediaQuery} from 'react-responsive'

export default function Header(){
    const isDesktop=useMediaQuery({minWidth:1024})
    return(
        <>
            <header className={styles.container}>
                <div className={styles.logo}>Finance App</div>
                <div className={styles.nav}>
                    {isDesktop&&<NavBar/>}
                </div>                
                <Info/>
            </header>
        </>
    )
}