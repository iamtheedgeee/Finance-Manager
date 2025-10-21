import {Outlet,useRoutes,Navigate } from "react-router-dom"
import { useEffect } from "react"
import NavBar from "./components/NavBar/NavBar"
import Accounts from "./pages/Accounts/Accounts"
import Categories from "./pages/Categories/Categories"
import Transactions from "./pages/Transactions/Transactions"
import Budgets from "./pages/Budgets/Budgets"
import Reports from "./pages/Reports/Reports"
import About from "./pages/About/About"
import Header from "./components/Header/Header"
import Signup from "./pages/auth/Signup"
import Login from "./pages/auth/login"
import { useNavigate } from "react-router-dom"
import { setNavigator } from "./navigator"
import { refreshToken } from "./services/authService"
import { useSelector } from "react-redux"
import {useMediaQuery} from "react-responsive"
import './App.css'
import Loading from "./components/Loading/Loading"

function MainLayout(){
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

function AuthLayout(){
    return (
        <>
            <Outlet/>
        </>
    )
}
export default function App(){
const navigate=useNavigate()
const {isLoggedIn}=useSelector((state)=>state.user)
useEffect(()=>{
    setNavigator(navigate)
    if(!isLoggedIn){
        refreshToken()
    }
},[isLoggedIn])


const routes = [
    {
      element: <MainLayout />,
      children: [
        { path: "/about", element: <About /> },
        { path: "/accounts", element: <Accounts /> },
        { path: "/budgets", element: <Budgets /> },
        { path: "/reports", element: <Reports /> },
        { path: "/categories", element: <Categories /> },
        { path: "/transactions", element: <Transactions /> },
        { path: "/", element:<Navigate to='/transactions' replace/>}
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        { path: "/signup", element: <Signup /> },
        { path: "/login", element: <Login /> },
      ],
    },
  ];

  return useRoutes(routes);
}