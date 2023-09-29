import React from 'react'
import { MdOutlineMarkEmailUnread } from 'react-icons/md'
import { Link } from 'react-router-dom'

function ForgotPasswordSuccess() {
    
    return (
        <div className='min-h-screen flex justify-center  bg-slate-200 py-10'>
            <div className="w-[400px] h-fit rounded-md shadow-md bg-white flex flex-col gap-10 p-5 ">
                <div className="flex justify-center items-center flex-col gap-1">
                    <MdOutlineMarkEmailUnread className='text-[34px] text-gray-600'/>
                    <div className="flex flex-col gap-10">
                        <span className="text-2xl text-center font-bold text-[#d6543a] ">THANK YOU FOR YOUR INTEREST!</span>
                        <span className='text-justify'>WE SEND YOU A LINK TO RESET YOUR PASSWORD, PLEASE CHECK YOUR EMAIL!</span>
                    </div>
                </div>
                <div className="flex flex-col justify-between gap-4 h-full">
                    <Link to='/'>
                        <button className='bg-green-700 hover:bg-green-500 w-full rounded-md p-2 text-white'>Home</button>
                    </Link>
                </div>
            </div>
        </div>   
    )
}

export default ForgotPasswordSuccess