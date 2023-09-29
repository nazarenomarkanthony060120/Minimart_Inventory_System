import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { accountInfo, resultFetchHistory } from '../../../pages/dashboard/DashboardCodes'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'


function HistoryTable() {
    const [ id, setId ] = useState(0)
    const [ items, setItems ] = useState([])
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ totalPages, setTotalPages ] = useState(1)

    const fetchData = async () => {
        try {
            const response = await accountInfo()
            if (response && response.message === "Success") {
                setId(response.id)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchHistory = async () => {
        try {
            const response = await resultFetchHistory(id, currentPage) 
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

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        fetchHistory()
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
            <div className="flex justify-between items-center px-3 pb-3 pt-10">
                <span className='text-xl'>Activies</span>
                <Link to={'/homepage/report'}>
                    <button className='rounded-md border-2 border-cyan-500  px-7 py-2 hover:bg-cyan-500 '>Back</button>
                </Link>
            </div>

                



            <div className="dark:bg-gray-900 dark:text-white px-3">
                <table className="w-full text-left  dark:text-white ">
                    <thead className=" text-black dark:text-white uppercase border-t-2 border-[#3ea1e3] border-b-2">
                        <tr>
                            <th className="px-3 py-3">#</th>
                            <th className="px-3 py-3 whitespace-pre">Message</th>
                            <th className="px-3 py-3 ">Time</th>
                            <th className="px-3 py-3 ">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items && items.length !== 0 ? items.map((data, i) => (
                            <tr key={i} className={`border-b dark:border-blue-300 dark:bg-blue-300 dark:hover:bg-blue-500 dark:hover:text-white hover:bg-blue-500 hover:text-white text-black` }  >
                                <td className="px-3 py-3">{++i}</td>
                                <td className="px-3 py-3">{data.message}</td>
                                <td className="px-3 py-3">{data.time}</td>
                                <td className="px-3 py-3">{data.date}</td>
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

export default HistoryTable




































{/* <table className="w-full table-auto border-none text-sm cursor-pointer ">
                    <thead className='border-t-2 border-[#3ea1e3] border-b-2'>
                        <tr className="">
                            <th className="py-2 w-fit font-normal">#</th>
                            <th className="py-2 w-fit font-normal">Message</th>
                            <th className="py-2 w-fit font-normal">Time</th>
                            <th className="py-2 w-fit font-normal">Date</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {items && items.length !== 0 ? items.map((data, i) => (
                            <tr key={i} className={ 'border-b dark:border-blue-300 dark:bg-blue-300 dark:hover:bg-blue-500 dark:hover:text-white hover:bg-blue-500 hover:text-white text-black' }>
                                <td className="py-3 text-center">{++i}</td>
                                <td className="py-3 text-center">{data.message}</td>
                                <td className="py-3 text-center">{data.time}</td>
                                <td className="py-3 text-center">{data.date}</td>
                            </tr>
                        )) : <tr className='centered-row font-extrabold text-2xl py-10'>
                                <td colSpan="7" className='text-center py-5'>NO HISTORY TO DISPLAY!</td>
                            </tr>
                        }
                    </tbody>
                </table> */}