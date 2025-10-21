import styles from "./TransactionView.module.css"
import {X} from "lucide-react"
import ReactDom from "react-dom"


export default function TransactionView({transaction,hideView}) {
  let date=new Date(transaction.date)
  date=date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,  
  });
  return ReactDom.createPortal(
    <div className={styles.viewContainer}>
    <div className={styles.card}>
        <div className={styles.xButton}><X size={25} onClick={hideView}/></div>
      <div className={styles.header}>
        <h2 className={styles.category}>
          {transaction.category.name}
        </h2>
        <span
          className={`${styles.badge} ${
            transaction.category.type === "INCOME" ? styles.income : styles.expense
          }`}
        >
          {transaction.type}
        </span>
      </div>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>Transaction ID:</span>
          <span className={styles.id}>{transaction.id}</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>Date:</span>
          <span>{date}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Amount:</span>
          <span
            className={`${styles.amount} ${
              transaction.category.type === "INCOME" ? styles.income : styles.expense
            }`}
          >
            ${transaction.amount}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Account:</span>
          <span>{transaction.account.name}</span>
        </div>
      </div>

      {/* Optional Fields */}
      {(transaction.accountNumber || transaction.transferTo) && (
        <div className={styles.section}>
          {transaction.accountNumber && (
            <div className={styles.row}>
              <span className={styles.label}>Account #:</span>
              <span>{transaction.accountNumber}</span>
            </div>
          )}
          {transaction.transferTo && (
            <div className={styles.row}>
              <span className={styles.label}>Transferred To:</span>
              <span>{transaction.transferTo}</span>
            </div>
          )}
        </div>
      )}

      {transaction.notes && (
        <div className={styles.section}>
          <span className={styles.label}>Notes:</span>
          <p className={styles.notes}>{transaction.notes}</p>
        </div>
      )}
    </div>
    </div>,document.body
  )
}
