import React from 'react'
import { BsCart4 } from 'react-icons/bs'
import { AiFillDollarCircle } from 'react-icons/ai'

function ReportStats(props) {
    return (
        <>
        <div className="dark:bg-gray-900 dark:text-white px-3 py-2">
            <span className="font-semibold text-2xl max-sm:text-lg ">Report Stats</span>
        </div>
        
        <div className="dark:bg-gray-900 dark:text-white flex flex-wrap justify-center gap-5 text-white px-3 pt-2 pb-3 ">
            <div className="flex w-64 gap-5 bg-[#be38be] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <BsCart4 /> 
                </div>
                <div className="flex flex-col">
                    <span className='font-light text-sm'>Total Products Sold</span>
                    <span className='font-semibold text-lg'>{ props.products }</span>
                </div>
            </div>
            <div className="flex w-64 gap-5 bg-[#339f33] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <AiFillDollarCircle />
                </div>
                <div className="flex flex-col">
                    <span className='font-light text-sm'>Total Price</span>
                    <span className='font-semibold text-lg'>{ props.amount }</span>
                </div>
            </div>
        </div>
        </>
    )
}

export default ReportStats