import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { accountInfo, resultCashIn, resultCashInHistory, resultFetchCashIn, resultTotalCash } from '../../../pages/dashboard/DashboardCodes'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'


function CashInForm() {

    const [ id, setId ] = useState(null)
    const [ amount, setAmount ] = useState(0)
    const [ totalCashAmount, setTotalCashAmount ] = useState(0)
    const [ isSubmit, setIsSubmit ] = useState(false) 
    const [ items, setItems ] = useState([])
    const [ totalPages, setTotalPages ] = useState(0);
    const [ currentPage, setCurrentPage ] = useState(1)

    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await accountInfo();
            if (response && response.message === "Success"){
                setId(response.id)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchCashInHistory = async () => {
        try {
            const response = await resultFetchCashIn(id, currentPage)
            if (response && response.message === "Success") {
                setItems(response.data)
                setTotalPages(response.totalPages)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

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

    const cashIn = async(e) => {
        e.preventDefault()
        if (isSubmit) return

        setIsSubmit(true)
        try {
            const response = await resultCashIn (id, amount);
            if (response && response.message === "Success") {
                toast.success('Cash In Successfully!', { theme: 'colored' })
                cashInHistory()
            } if (response && response.message === "Below") {
                toast.error('Cash In Failed, Below 0 is unable to cash in!', { theme: 'colored' })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const cashInHistory = async () => {
        try {
            const response = await resultCashInHistory (id, amount) 
            if (response && response.message === "Success") {
                toast.info('Cash In Recorded!', { theme: 'colored' })
                navigate('/homepage/cash')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
        totalCash()
    }, [fetchData, totalCash])

    useEffect(() => {
        fetchCashInHistory()
    }, [currentPage, id])

    const pagesToShow = 2; // Number of page buttons to show
    
    // Calculate the range of page buttons to display
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
            <button
                key={i}
                className={`${currentPage === i ? 'border-2 border-[#3ea1e3] text-sm bg-[#3ea1e3] text-white' : ''} border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1 rounded-lg text-[14px]`}
                onClick={() => handlePageChange(i)}>{i}
            </button>
        );
    }    

    return (
        <>
            <div className="grid grid-cols-2 w-full h-max px-3 max-[1015px]:grid-cols-1 pb-5">
                <div className="flex justify-center items-center gap-3">
                    <label htmlFor="cash">CASH:</label>
                    <span className='text-[45px] font-bold text-[poppins] max-lg:text-[35px] max-sm:text-[25px] '>{ totalCashAmount.toFixed(2) }</span>
                </div>
                <div className={`flex justify-center items-center flex-col gap-3 pb-5`}>
                    <span className='text-lg'>Cash In</span>
                    <form action="" onSubmit={ cashIn }>
                        <div className="flex items-center justify-center flex-wrap gap-3">
                            <div className="flex justify-center flex-wrap items-center text-lg gap-3">
                                <label htmlFor="amount">Amount:</label>
                                <input type="number" className='rounded-md border-2 border-cyan-500 p-2 text-center text-black'  onChange={ e => setAmount(e.target.value) } placeholder='Enter Amount' autoFocus/>
                            </div>
                            <div className="">
                                <button className='rounded-md border-2 border-cyan-500 shadow-md hover:shadow-cyan-500 hover:bg-cyan-500 px-5 py-2 max-[783px]:p-1 max-[783px]:px-3'>Cash In</button>
                            </div>
                        </div>
                    </form>
                    <Link to={'/homepage/cash'}>
                        <button className='rounded-md border-2 border-cyan-500 shadow-md hover:shadow-cyan-500 hover:bg-cyan-500 px-7 py-2 '>Back</button>
                    </Link>
                </div>
            </div>
            <div className="px-3 pb-3"><span className='text-xl'>Cash In History</span></div>
            <div className="dark:bg-gray-900 dark:text-white px-3">
                <table className="w-full text-left  dark:text-white ">
                    <thead className=" text-black dark:text-white uppercase border-t-2 border-[#3ea1e3] border-b-2">
                        <tr>
                            <th className="px-3 py-3">#</th>
                            <th className="px-3 py-3 whitespace-pre">Message</th>
                            <th className="px-3 py-3 ">Amount</th>
                            <th className="px-3 py-3 max-sm:hidden">Time</th>
                            <th className="px-3 py-3 max-sm:hidden">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items && items.length !== 0 ? items.map((data, i) => (
                            <tr key={i} className={`border-b dark:border-blue-300 dark:bg-blue-300 dark:hover:bg-blue-500 dark:hover:text-white hover:bg-blue-500 hover:text-white'  text-black` }  >
                                <td className="px-3 py-3">{++i}</td>
                                <td className="px-3 py-3">{data.message}</td>
                                <td className="px-3 py-3">{data.amount}</td>
                                <td className="px-3 py-3 max-sm:hidden">{data.payment_time}</td>
                                <td className="px-3 py-3 max-sm:hidden">{data.payment_date}</td>
                            </tr>
                        )) : <tr className='centered-row font-extrabold text-2xl py-10'>
                                <td colSpan="5" className='text-center py-5'>NO HISTORY TO DISPLAY!</td>
                            </tr> 
                        }
                    </tbody>
                </table>
                <div className='flex justify-center items-center py-3 cursor-pointer flex-wrap gap-3'>
                    <div className="">
                        <span className="text-sm">Items from { items ? items.length : 0} / { items ? items.length : 0 }</span>
                    </div>

                    <div className="flex justify-center items-center flex-grow gap-2">
                        <button
                            className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1 rounded-lg text-[14px]`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}><AiOutlineLeft />
                        </button>

                            {startPage > 1 && (
                                <button
                                    className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1  rounded-lg text-[14px]`}
                                    onClick={() => handlePageChange(1)}
                                >
                                    1
                                </button>
                            )}

                            {startPage > 2 && <span className="px-2 py-1 ">...</span>}
                            
                            {pageButtons}

                            {endPage < totalPages - 1 && <span className="px-2 py-1 ">...</span>}
                            
                            {endPage < totalPages && (
                                <button
                                    className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1  rounded-lg text-[14px]`}
                                    onClick={() => handlePageChange(totalPages)}>{totalPages}
                                </button>
                            )}

                        <button
                            className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1 rounded-lg text-[14px]`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}><AiOutlineRight />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CashInForm











{/* <table className="w-full table-auto border-none text-sm cursor-pointer ">
                    <thead className='border-t-2 border-[#3ea1e3] border-b-2'>
                        <tr className="">
                            <th className="py-2 w-fit font-normal">#</th>
                            <th className="py-2 w-fit font-normal">Message</th>
                            <th className="py-2 w-fit font-normal">Amount</th>
                            <th className="py-2 w-fit font-normal max-sm:hidden">Time</th>
                            <th className="py-2 w-fit font-normal">Date</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {items && items.length !== 0 ? items.map((data, i) => (
                            <tr key={i} className={`'border-b dark:border-blue-300 dark:bg-blue-300 dark:hover:bg-blue-500 dark:hover:text-white hover:bg-blue-500 hover:text-white'  text-black` }>
                                <td className="py-3 text-center">{++i}</td>
                                <td className="py-3 text-center">{data.message}</td>
                                <td className="py-3 text-center">{data.amount}</td>
                                <td className="py-3 text-center max-sm:hidden">{data.payment_time}</td>
                                <td className="py-3 text-center">{data.payment_date}</td>
                            </tr>
                        )) : <tr className='centered-row font-extrabold text-2xl py-10'>
                                <td colSpan="7" className='text-center py-5'>NO CASH HISTORY TO DISPLAY!</td>
                            </tr>
                        }
                    </tbody>
                </table> */}