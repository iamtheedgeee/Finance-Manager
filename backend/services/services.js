const prisma=require('../prismaClient')
//FOR BUDGET
function getMonthRange() {
    date = new Date()
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);  
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0); 
    return { startDate, endDate };
}

//Getting Date Ranges from presets
async function getDateRange(dateObj,userId) {
  const now = new Date();
  const firstTrans=await prisma.transaction.findFirst({orderBy:{date:'asc'},where:{userId},select:{date:true}})
  const firstTransDate=firstTrans?.date||new Date('1999')
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const presets = {
    today: {
      gte: startOfToday,
      lte: now,
    },
    last7days: {
      gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
      lte: now,
    },
    thisMonth: {
      gte: new Date(now.getFullYear(), now.getMonth(), 1),
      lte: now,
    },
    lastMonth: {
      gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      lte: new Date(now.getFullYear(), now.getMonth(), 0), 
    },
    thisYear: {
      gte: new Date(now.getFullYear(), 0, 1), 
      lte: now,
    },
    allTime:{
      gte: firstTransDate,
      lte: now
    }
  }
  
  if(dateObj.preset){
    return presets[dateObj.preset] || presets.last7days
  }else{
    const endDate=new Date(dateObj.custom.customEnd)
    endDate.setHours(23,59,59,999)
    date={
      gte: new Date(dateObj.custom.customStart),
      lte: endDate
    }
    console.log(date)
    return date
  }
}
//getting date ranges for chartdata
async function getRangeForChartData(range,rangeType,userId){
    switch(rangeType){
        case "allTime":
            const firstTrans=await prisma.transaction.findFirst({orderBy:{date:'asc'},where:{userId},select:{date:true}})
            const firstTransDate=firstTrans?.date||new Date('1999')
            const today=new Date()
            return {
                startDate:firstTransDate,
                endDate:today
            }
        case "year":
            return{
                startDate: new Date(Number(range),0,1),
                endDate: new Date(Number(range)+1,0,1)
            }
        case "month":
            const givenDate= new Date(range)
            return{
                startDate: givenDate,
                endDate: new Date(givenDate.getFullYear(),givenDate.getMonth()+1,0)
            }

    }
}
//Self explanatotry tbh
async function getBudgetWithSpent(userId){
    const budgets= await prisma.budget.findMany({
        where:{userId},
        include:{category:true}
    })
    const budgetsWithSpent=await Promise.all(
        budgets.map(async (budget)=>{
            const {_sum:{amount}}= await prisma.transaction.aggregate({
                _sum:{amount:true},
                where:{
                    category:{
                        id:budget.categoryId,
                        type:"EXPENSE"
                    },
                    date:{
                        gte:budget.startDate,
                        lte:budget.endDate
                    } 
                }
            })
            return {
                ...budget,
                spent:amount??0
            }
        })
    )
    return budgetsWithSpent
}

//self explanatory
async function fetchCategory(id,userId){
    return prisma.category.findUniqueOrThrow({
        where:{
            id,
            userId
        },
        include:{
            transactions:true,
            budget:true 
        }
    }) 
}

//getting chartdata for the grouped income expense bar chart
//filter by date, user and interval
async function fetchIncomeExpenseChartData(interval,startDate,endDate,userId){
  const results= await prisma.$queryRaw`
    SELECT
      TO_CHAR(t."date",${interval}) AS period,
      c."type",
      SUM(t."amount") as total
    FROM "Transaction" t
    JOIN "Category" c ON t."categoryId" = c."id"
    WHERE t."userId"=${userId} AND t."isActive"=true AND t."date" BETWEEN ${startDate} AND ${endDate}
    GROUP BY period, c."type"
    ORDER BY MIN(t."date");
  `
  const chartData=results.reduce((acc,row)=>{
    let existing=acc.find(r=>r.period===row.period)

    if(!existing){
      existing={period:row.period,INCOME:0,EXPENSE:0}
      acc.push(existing)
    }

    existing[row.type]=row.total
    return acc
  },[])

  return chartData
}

//getting chartdata for the expense over time bar/linechart
async function fetchExpenseByCategoryChartData(interval,startDate,endDate,categoryId){
  const chartData = await prisma.$queryRaw`
    SELECT
      TO_CHAR(t."date",${interval}) AS period,
      SUM(t."amount") as total,
      c."name"
    FROM "Transaction" t
    JOIN "Category" c on t."categoryId" = c."id"
    WHERE c."id"=${categoryId} AND t."isActive"=true AND t."date" BETWEEN ${startDate} AND ${endDate}
    GROUP BY period,c."name"
    ORDER BY MIN(t."date");
  `
  return chartData
}


//filter by time,user,and active categories, and expense categories only...optonialy for income as well...we'll see
//getting chart data for piechart
async function fetchExpensePieChartData(startDate,endDate,userId,type){
  const chartData= await prisma.$queryRaw`
    SELECT
      c."name" as name,
      SUM(t."amount") as value
    FROM "Transaction" t
    JOIN "Category" c on t."categoryId" = c."id"
    WHERE c."type"=${type}::"CategoryType" AND t."userId"=${userId} AND t."isActive"=true AND t."date" BETWEEN ${startDate} AND ${endDate}
    GROUP BY name
    ORDER BY MIN(t."amount");
  `
  console.log(chartData)
  return chartData
}

//filter by date,userID,interval
async function fetchRunningBalanceData(){
  const chartData= await prisma.$queryRaw`
    WITH date_range AS (
      SELECT generate_series(
        (SELECT MIN(DATE(t."createdAt")) FROM "Transaction" t ),
        CURRENT_DATE,
        '1 day'::interval
      )::date as day
    ),
    daily_changes AS (
      SELECT
        DATE(t."createdAt") as day,
        SUM(
          CASE 
            WHEN c."type" = 'INCOME' THEN t."amount"
            ELSE -t."amount"
          END
        ) as net_change
      FROM "Transaction" t
      JOIN "Category" c ON t."categoryId" = c."id"
      GROUP BY day
    )
    SELECT
      d.day,
      SUM(COALESCE(dc.net_change, 0)) OVER (ORDER BY d.day) as balance
    FROM date_range d
    LEFT JOIN daily_changes dc ON d.day = dc.day
    ORDER BY d.day;

  `
  console.log(chartData)
}
async function getCategoryFromName(category,userId){
  const Category=await prisma.category.findUniqueOrThrow({
    where:{
      name:category,
      userId
    }
  })
  return Category
}

async function getAccountIdFromName(account,userId){
  const Account=await prisma.account.findUniqueOrThrow({
    where:{
      name:account,
      userId
    }
  })
  return Account.id
}
async function importTransactions(data,userId){
  let count=0
  await Promise.all(
    data.map(async(transaction)=>{
      const category=await getCategoryFromName(transaction.category,userId)
      const categoryId=category.id
      const accountId=await getAccountIdFromName(transaction.account,userId)
      const amount=transaction.amount
      const notes=transaction.notes
      const date=new Date(transaction.date)
      const netEffect=category.type==="EXPENSE"?-amount:amount
      const [trans]=await prisma.$transaction([
        prisma.transaction.create({
          data:{
            userId,
            accountId,
            categoryId,
            amount,
            date,
            notes
          }
        }),
        prisma.account.update({
          where:{id:accountId},
          data:{balance:{increment:netEffect}}
        })
      ])
      count+=1
  }))
  console.log(count)
  return count
}
module.exports={
      fetchCategory,
      getMonthRange,
      getBudgetWithSpent,
      getDateRange,
      fetchIncomeExpenseChartData,
      getRangeForChartData,
      fetchExpenseByCategoryChartData,
      fetchExpensePieChartData,
      fetchRunningBalanceData,
      importTransactions
    }