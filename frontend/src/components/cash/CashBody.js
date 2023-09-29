import React, { useEffect, useState } from 'react'
import { accountInfo, resultTotalCash } from '../../pages/dashboard/DashboardCodes'
import { Link } from 'react-router-dom'

function CashBody() {
    const [ id, setId ] = useState(0)
    const [ totalCashAmount, setTotalCashAmount ] = useState(0)


    const fetchData = async () => {
        try {
            const response = await accountInfo()
            if (response && response.message === "Success") {
                setId (response.id)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const totalCash = async () => {
        try {
            const response = await resultTotalCash (id)
            if (response && response.message === "Success") {
                setTotalCashAmount(response.amount)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
        totalCash()
    }, [fetchData, totalCash])

    return (
        <>
            <div className="grid grid-cols-2 w-full h-56 p-3 max-[1015px]:grid-cols-1 ">
                <div className="flex justify-center items-center gap-3">
                    <label htmlFor="cash">CASH:</label>
                    <span className='text-[45px] font-bold text-[poppins] max-lg:text-[35px] max-sm:text-[25px] '>{ totalCashAmount.toFixed(2) }</span>
                </div>
                <div className={`flex justify-center items-center gap-3 `}>
                    <Link to={`cashIn`}>
                        <button className='rounded-md border-2 shadow-2xl hover:shadow-cyan-500 border-cyan-500  px-7 py-2 hover:bg-cyan-500 max-[363]:px-2 max-[363px]:text-sm' >CASH IN</button>
                    </Link>
                    <Link to={`cashOut`}>
                        <button className='rounded-md border-2 shadow-2xl hover:shadow-cyan-500 border-cyan-500  px-5 py-2 hover:bg-cyan-500 max-[363]:px-2 max-[363px]:text-sm' >CASH OUT</button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default CashBody