import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,LineChart,Line } from 'recharts'

export default function RunningBalanceLineGraph(){
    const data=[
        { day: "2025-09-24", balance: -512000 },
        { day: "2025-09-25", balance: -518000 },
        { day: "2025-09-26", balance: 7606091 },
        { day: "2025-09-27", balance: 7606091 },
        { day: "2025-09-28", balance: 7606091 },
        { day: "2025-09-29", balance: 7609091 },
        { day: "2025-09-30", balance: 7609091 },
        { day: "2025-10-01", balance: 7609091 },
        { day: "2025-10-02", balance: 7613124 },
        { day: "2025-10-03", balance: 7612824 }
    ]
    return (
        <LineChart data={data} width={1000} height={400}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="balance" stroke="#4CAF50" />
        </LineChart>
    )

}