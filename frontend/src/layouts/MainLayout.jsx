import Loading from "../components/Loading/Loading";
import Header from "../components/Header/Header"
import NavBar from "../components/NavBar/NavBar";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import {Outlet } from "react-router-dom"
import '../App.css'
export default function MainLayout(){
    const {status}=useSelector((state)=>state.user)
    const isDesktop=useMediaQuery({minWidth:1024})
    if (status==="idle" || status === "loading") {
        return <div className='loading'>
                  <Loading/>
                </div>;
    }
    return(
        <>
        <Header/>
        <main>
            <Outlet/>
            {!isDesktop&&<NavBar/>}
        </main>
        </>
    )
}