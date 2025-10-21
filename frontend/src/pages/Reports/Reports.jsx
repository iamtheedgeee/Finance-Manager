import IncomeExpenseChart from "./IncomExpenseChart/IncomeExpenseChart";
import ExpenseByCategoryChart from "./ExpenseByCategoryChart/ExpenseByCategoryChart"
import ExpensePieChart from "./ExpensePieChart/ExpensePieChart"
import Overview from "../../components/Overview/Overview";
import Filter from "../Transactions/Filter/Filter";
import styles from './Reports.module.css'
import RunningBalanceLineGraph from "./RunningBalanceLineGraph/RunningBalanceLineGraph";
export default function Reports(){
    return(
        <>
            <div className={styles.chartsContainer}>
                <IncomeExpenseChart/>
                <ExpenseByCategoryChart/>
                <ExpensePieChart type={'EXPENSE'}/>
                <ExpensePieChart type={'INCOME'}/>
            </div>
        </>
    )
}