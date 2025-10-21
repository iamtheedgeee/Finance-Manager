import { useState } from 'react'
import styles from './ImportForm.module.css'
import { X } from 'lucide-react'
import { sendFileForImport } from '../../../services/appService'
import { useEffect } from 'react'
export default function ImportForm({hide}){
    const [file,setFile]=useState(null)
    const [loading,setLoading]=useState(false)

    function handleFile(e){
        setFile(e.target.files[0])
    }

    async function handleSubmit(e){
        e.preventDefault()
        setLoading(true)
        if(!file){
            alert("Please select a file")
            return
        }
        const formData= new FormData()
        formData.append("spreadSheetFile",file)
        try{
            const count=await sendFileForImport(formData)
            if(count){
                setLoading(false)
                alert(`Successfully imported ${count} transactions`)
                hide()
            }
        } catch(error){
            setLoading(false)
            alert('Something Went wrong check your file for errors and mismatches')
        }


    }
    return (
        <div className={styles.formContainer}>
            <div className={styles.mainContainer}>
                <div className={styles.title}>Upload a Spreadsheet file</div>
                <div className={styles.xButton}><X size={25} onClick={hide}/></div>
                {!loading?
                    <form className={styles.uploadForm} onSubmit={handleSubmit}>
                        <input
                            id='file'
                            type='file'
                            accept='.xls, .xlsx, .csv'
                            onChange={handleFile}    
                        />
                        <label htmlFor='file' className={styles.label}>Choose File</label>
                        <span className={styles.selected}>{file?.name}</span>
                        <button type="submit" className={styles.btn}>Submit</button>
                    </form>
                :
                    <div className={styles.loading}>
                        Importing......
                    </div>
                }
            </div>
        </div>
    )
}