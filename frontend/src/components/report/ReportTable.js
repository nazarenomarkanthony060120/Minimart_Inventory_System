import React from 'react'
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai'

function ReportTable(props) {

    
    const pagesToShow = 2; // Number of page buttons to show
    
    // Calculate the range of page buttons to display
    const startPage = Math.max(1, props.currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(props.totalPages, startPage + pagesToShow - 1);

    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
            <button
                key={i}
                className={`${props.currentPage === i ? 'border-2 border-[#3ea1e3] text-sm bg-[#3ea1e3] text-white' : ''} border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1 rounded-lg text-[14px]`}
                onClick={() => props.handlePageChange(i)}>{i}</button>
        );
    }

    return (
        <>
            <div className="dark:bg-gray-900 dark:text-white px-3">
                <table className="w-full text-left  dark:text-white ">
                    <thead className=" text-black dark:text-white uppercase border-t-2 border-[#3ea1e3] border-b-2">
                        <tr>
                            <th className="px-3 py-3">#</th>
                            <th className="px-3 py-3 whitespace-pre">Product Name</th>
                            <th className="px-3 py-3 ">Quantity</th>
                            <th className="px-3 py-3 max-sm:hidden">Price</th>
                            <th className="px-3 py-3 max-sm:hidden">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.items && props.items.length !== 0 ? props.items.map((data, i) => (
                            <tr key={i} className={`'border-b dark:border-blue-300 dark:bg-blue-300 dark:hover:bg-blue-500 dark:hover:text-white hover:bg-blue-500 hover:text-white' text-black` }  >
                                <td className="px-3 py-3">{++i}</td>
                                <td className="px-3 py-3">{data.product_name}</td>
                                <td className="px-3 py-3">{data.quantity}</td>
                                <td className="px-3 py-3 max-sm:hidden">{data.price}</td>
                                <td className="px-3 py-3 max-sm:hidden">{data.date_bought}</td>
                            </tr>
                        )) : <tr className='centered-row font-extrabold text-2xl py-10'>
                                <td colSpan="5" className='text-center py-5'>NO HISTORY TO DISPLAY!</td>
                            </tr> 
                        }
                    </tbody>
                </table>
                <div className='flex justify-center items-center py-3 cursor-pointer flex-wrap gap-3'>
                    <div className="">
                        <span className="text-sm">Items from { props.items ? props.items.length : 0} / { props.items ? props.items.length : 0 }</span>
                    </div>

                    <div className="flex justify-center items-center flex-grow gap-2">
                        <button
                            className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1 rounded-lg text-[14px]`}
                            onClick={() => props.handlePageChange(props.currentPage - 1)}
                            disabled={props.currentPage === 1}><AiOutlineLeft />
                        </button>

                            {startPage > 1 && (
                                <button
                                    className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1  rounded-lg text-[14px]`}
                                    onClick={() => props.handlePageChange(1)}
                                >
                                    1
                                </button>
                            )}

                            {startPage > 2 && <span className="px-2 py-1 ">...</span>}
                            
                            {pageButtons}

                            {endPage < props.totalPages - 1 && <span className="px-2 py-1 ">...</span>}
                            
                            {endPage < props.totalPages && (
                                <button
                                    className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1  rounded-lg text-[14px]`}
                                    onClick={() => props.handlePageChange(props.totalPages)}>{props.totalPages}
                                </button>
                            )}

                        <button
                            className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1 rounded-lg text-[14px]`}
                            onClick={() => props.handlePageChange(props.currentPage + 1)}
                            disabled={props.currentPage === props.totalPages}><AiOutlineRight />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportTable


















{/* <table className="w-full table-auto border-none text-sm cursor-pointer ">
                    <thead className='border-t-2 border-[#3ea1e3] border-b-2'>
                        <tr className="">
                            <th className="py-2 w-fit font-normal">#</th>
                            <th className="py-2 w-fit font-normal">Product Name</th>
                            <th className="py-2 w-fit font-normal">Quantity</th>
                            <th className="py-2 w-fit font-normal">Price</th>
                            <th className="py-2 w-fit font-normal">Date</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {props.items && props.items.length !== 0 ? props.items.map((data, i) => (
                            <tr key={i} className={ 'border-b dark:border-blue-300 dark:bg-blue-300 dark:hover:bg-blue-500 dark:hover:text-white hover:bg-blue-500 hover:text-white text-black' }>
                                <td className="py-3 text-center">{++i}</td>
                                <td className="py-3 text-center">{data.product_name}</td>
                                <td className="py-3 text-center">{data.quantity}</td>
                                <td className="py-3 text-center">{data.price}</td>
                                <td className="py-3 text-center">{data.date_bought}</td>
                            </tr>
                        )) : <tr className='centered-row font-extrabold text-2xl py-10'>
                                <td colSpan="7" className='text-center py-5'>NO HISTORY TO DISPLAY!</td>
                            </tr>
                        }
                    </tbody>
                </table> */}