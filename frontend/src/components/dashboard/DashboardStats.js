import React from 'react'
import { BsCart4, BsCartX } from 'react-icons/bs'
import { AiFillDollarCircle } from 'react-icons/ai'

function DashboardStats(props) {

    return (
        <>
        <div className="dark:bg-gray-900 dark:text-white px-3 py-2">
            <span className="font-semibold text-2xl max-sm:text-lg ">Inventory Stats</span>
        </div>
        
        <div className="dark:bg-gray-900 dark:text-white flex flex-wrap justify-center gap-5 text-white px-3 pt-2 pb-3 ">
            <div className="flex w-64 gap-5 bg-[#be38be] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <BsCart4 /> 
                </div>
                <div className="flex flex-col">
                    <span className='text-sm'>Total Products</span>
                    <span className='font-semibold text-lg'>{ props.propTotalStocks }</span>
                </div>
            </div>
            <div className="flex w-64 gap-5 bg-[#339f33] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <AiFillDollarCircle />
                </div>
                <div className="flex flex-col">
                    <span className='text-sm'>Total Store Value</span>
                    <span className='font-semibold text-lg'>{ props.propTotalStocksValue }</span>
                </div>
            </div>
            
            <div className="flex w-64 gap-5  bg-[#4080f7] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <AiFillDollarCircle />
                </div>
                <div className="flex flex-col">
                    <span className='text-sm'>Cash</span>
                    <span className='font-semibold text-lg'>{ props.propTotalCash }</span>
                </div>
            </div>
        </div>
        <div className="dark:bg-gray-900 dark:text-white flex flex-wrap justify-center gap-5 border-b-2 border-b-gray-300 text-white px-3 pt-2 pb-3  ">
            <div className="flex w-64 gap-5  bg-yellow-500 rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <BsCartX />
                </div>
                <div className="flex flex-col">
                    <span className='text-sm'>Out of Stock</span>
                    <span className='font-semibold text-lg'>{ props.propTotalOutOfStocks }</span>
                </div>
            </div>
            <div className="flex w-64 gap-5  bg-[#f03f3f] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <AiFillDollarCircle />
                </div>
                <div className="flex flex-col">
                    <span className='text-sm'>No. of Expired</span>
                    <span className='font-semibold text-lg' >{ props.propTotalExpired }</span>
                </div>
            </div>
            <div className="flex w-64 gap-5  bg-[#3ec4a0] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <AiFillDollarCircle />
                </div>
                <div className="flex flex-col">
                    <span className='text-sm'>Amount Loss</span>
                    <span className='font-semibold text-lg'>{ props.propTotalAmountLoss }</span>
                </div>
            </div>
        </div>
        </>
    )
}

export default DashboardStats