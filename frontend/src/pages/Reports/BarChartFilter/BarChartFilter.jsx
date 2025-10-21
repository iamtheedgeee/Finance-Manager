import styles from './BarChartFilter.module.css'
import { useEffect,useState } from 'react'

function Intervals({settings,setSettings}){
   return(
        <div className={styles.intervalSelect}>
            <div className={`${styles.interval} ${settings.interval==='YYYY-MM-DD'&&  styles.selected}`} onClick={()=>{setSettings({...settings,interval:"YYYY-MM-DD"})}}>Days</div>
            <div className={`${styles.interval} ${settings.interval==='YYYY-MM'&&  styles.selected}`} onClick={()=>{setSettings({...settings,interval:"YYYY-MM"})}}>Months</div>
            <div className={`${styles.interval} ${settings.interval==='YYYY'&&  styles.selected}`} onClick={()=>{setSettings({...settings,interval:"YYYY"})}}>Years</div>
        </div>
   )
}
export default function BarChartFilter({apply,settings,setSettings,categories}){
    return(
        <div className={styles.settings}>
            <div className={styles.top}>
                <Intervals settings={settings} setSettings={setSettings}/>
                <div className={styles.chartSelect}>
                    <div>
                        <input type='checkbox' name='chartType' value='bar' id='bar'
                            checked={settings.chartType==='bar'}
                            onChange={(e)=>{
                                setSettings((prev)=>({...prev,chartType:e.target.value}))
                            }}
                        />
                        <label htmlFor='bar'>Bar</label>
                    </div>
                    <div>
                        <input type='checkbox' name='chartType' value='line' id='line' 
                            checked={settings.chartType==='line'} 
                            onChange={(e)=>{
                                setSettings((prev)=>({...prev,chartType:e.target.value}))
                            }}
                        />
                        <label htmlFor='line'>Line</label>
                    </div>
                </div>
            </div>
            {categories&&
                <div className={styles.categorySelect}>
                    <select id='category'
                        onChange={(e)=>{
                            setSettings((prev)=>({
                                ...prev,
                                categoryId:e.target.value
                            }))
                        }}
                    >
                        {categories.map((category)=>{
                                return <option key={category.id} value={category.id}>{category.name}</option>
                        })}
                    </select>
                </div>
            }
        </div>
    )
}