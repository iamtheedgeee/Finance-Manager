import {useRoutes,Navigate } from "react-router-dom"
import { useEffect } from "react"
import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"
import TransRepLayout from "./layouts/TransRepLayout"
import Accounts from "./pages/Accounts/Accounts"
import Categories from "./pages/Categories/Categories"
import Transactions from "./pages/Transactions/Transactions"
import Budgets from "./pages/Budgets/Budgets"
import Reports from "./pages/Reports/Reports"
import About from "./pages/About/About"
import Signup from "./pages/auth/Signup"
import Login from "./pages/auth/login"
import { useNavigate } from "react-router-dom"
import { setNavigator } from "./navigator"
import { refreshToken } from "./services/authService"
import { useSelector } from "react-redux"
import './App.css'




export default function App(){
const navigate=useNavigate()
const {isLoggedIn}=useSelector((state)=>state.user)
useEffect(()=>{
    setNavigator(navigate)
    if(!isLoggedIn){
        console.log("loading")
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
        { path: "/categories", element: <Categories /> },
        { path: "/", element:<Navigate to='/transactions' replace/>},
        {
          element: <TransRepLayout/>,
          children:[
            { path: "/transactions", element: <Transactions /> },
            { path: "/reports", element: <Reports /> },
          ]
        }
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