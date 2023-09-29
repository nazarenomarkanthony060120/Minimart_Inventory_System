import React from 'react'
import { Link } from 'react-router-dom'
import { BsPencil } from 'react-icons/bs'
import { MdDeleteOutline } from 'react-icons/md'
import { AiOutlineAppstoreAdd, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'


function DashboardTable(props) {
    
    const dataTotalPrice = (data) => {
        const totalPrice = data.total_price
        return totalPrice.toFixed(2)
    }
    const pagesToShow = 2; // Number of page buttons to show
    
    // Calculate the range of page buttons to display
    const startPage = Math.max(1, props.propCurrentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(props.propTotalPages, startPage + pagesToShow - 1);

    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
            <button
                key={i}
                className={`${props.propCurrentPage === i ? 'border-2 border-[#3ea1e3] text-sm bg-[#3ea1e3] text-white' : ''} border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1 rounded-lg text-[14px]`}
                onClick={() => props.propHandlePageChange(i)}>{i}</button>
        );
    }

    return (
        <>
        <div className="dark:bg-gray-900 dark:text-white px-3 flex items-center justify-end pb-3">
            <Link to={`addStock`}>
                <button className="flex items-center gap-2 rounded-md shadow-2xl hover:shadow-cyan-500 border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white p-2"><span>ADD:</span> <AiOutlineAppstoreAdd /></button>
            </Link>
        </div>
        <div className="dark:bg-gray-900 dark:text-white flex justify-end items-center flex-wrap max-[496px]:justify-center cursor-pointer gap-1 px-3 pb-3">
            <span className="font-semibold text-md">Legend:</span>
            <div className="flex flex-wrap gap-3 max-[496px]:justify-center">
                <div className="flex justify-center items-center gap-2" title='Above 1 Month before expire'>
                    <span className="w-2 h-2 bg-green-600"></span>
                    <p className='max-sm:text-sm '>Fresh</p>
                </div>
                <div className="flex justify-center items-center gap-2" title='Below 60 days before expire'>
                    <span className="w-2 h-2 bg-blue-600"></span>
                    <p className='max-sm:text-sm '>Nearly Expire</p>
                </div>
                <div className="flex justify-center items-center gap-2" title='In or Above days after expired'>
                    <span className="w-2 h-2 bg-red-600"></span>
                    <p className='max-sm:text-sm '>Expired</p>
                </div>
                <div className="flex justify-center items-center gap-2" title='In or Above days after expired'>
                    <span className="w-2 h-2 bg-yellow-600"></span>
                    <p className='max-sm:text-sm '>Out of Stocks</p>
                </div>
            </div>
        </div>
        
        <div className="dark:bg-gray-900 dark:text-white px-3">
            <table className="w-full text-left  dark:text-white ">
                    <thead className=" text-black dark:text-white uppercase border-t-2 border-[#3ea1e3] border-b-2">
                        <tr>
                            <th className="py-3">#</th>
                            <th className="py-3 whitespace-pre">Item</th>
                            <th className="py-3 ">Quantity</th>
                            <th className="py-3 ">Price</th>
                            <th className="py-3 max-sm:hidden">Total</th>
                            <th className="py-3 max-sm:hidden">Stock In</th>
                            <th className="py-3 max-sm:hidden">Expired</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.propsItem && props.propsItem.length !== 0 ? props.propsItem.map((data, i) => (
                            <tr key={i} className={`${ props.propHandleDateColor(data.date_expired, data.quantity) } text-black` }  >
                                <td className="py-3">{++i}</td>
                                <td className="py-3">{data.product_name}</td>
                                <td className="py-3">{data.quantity}</td>
                                <td className="py-3">{data.price}</td>
                                <td className="py-3 max-sm:hidden">{dataTotalPrice(data)}</td>
                                <td className="py-3 max-sm:hidden">{data.date_stock_in}</td>
                                <td className="py-3 max-sm:hidden">{data.date_expired}</td>
                                <td className='w-fit'>
                                    <div className="flex justify-center gap-4 text-[14px]text-[14px]">
                                        <Link to={`updatestock/${props.id}/${data.id}`}>
                                            <button>
                                                <BsPencil />
                                            </button>
                                        </Link>
                                        
                                        <Link to={`deletestock/${props.id}/${data.id}`}>
                                            <button value={data.id}>
                                                <MdDeleteOutline />
                                            </button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )) : <tr className='centered-row font-extrabold text-2xl py-10'>
                                <td colSpan="7" className='text-center py-5'>NO ITEMS TO DISPLAY!</td>
                            </tr> 
                        }
                    </tbody>
                </table>

            <div className='flex justify-center items-center py-3 cursor-pointer max-[566px]:flex-col max-[566px]:items-center'>
                <div className="">
                    <span className="text-sm">Items from { props.propsItem ? props.propsItem.length : 0} / { props.propsItem ? props.propsItem.length : 0 }</span>
                </div>

                <div className="flex justify-center items-center flex-grow gap-2">
                    <button
                        className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1 rounded-lg text-[14px]`}
                        onClick={() => props.propHandlePageChange(props.propCurrentPage - 1)}
                        disabled={props.propCurrentPage === 1}><AiOutlineLeft />
                    </button>

                        {startPage > 1 && (
                            <button
                                className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1  rounded-lg text-[14px]`}
                                onClick={() => props.propHandlePageChange(1)}
                            >
                                1
                            </button>
                        )}

                        {startPage > 2 && <span className="px-2 py-1 ">...</span>}
                        
                        {pageButtons}

                        {endPage < props.propTotalPages - 1 && <span className="px-2 py-1 ">...</span>}
                        
                        {endPage < props.propTotalPages && (
                            <button
                                className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1  rounded-lg text-[14px]`}
                                onClick={() => props.propHandlePageChange(props.propTotalPages)}>{props.propTotalPages}
                            </button>
                        )}

                    <button
                        className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-2 py-1 rounded-lg text-[14px]`}
                        onClick={() => props.propHandlePageChange(props.propCurrentPage + 1)}
                        disabled={props.propCurrentPage === props.propTotalPages}><AiOutlineRight />
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

export default DashboardTable

