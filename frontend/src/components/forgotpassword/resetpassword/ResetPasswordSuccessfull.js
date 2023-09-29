import React, { useEffect, useState } from 'react'
import { RiLockPasswordLine } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'

function ResetPasswordSuccessfull() {

    const [ seconds, setSeconds ] = useState(5)
    const navigate = useNavigate()

    useEffect(() => {

        if (seconds <= 0) {
            navigate('/')
        } 

        const timeout = setInterval(() => {
            setSeconds(seconds - 1)
        }, 1000)

        return () => clearInterval(timeout)

    }, [seconds])

    return (
        <div className='min-h-screen flex justify-center  bg-slate-200 py-10'>
            <div className="w-[400px] h-fit rounded-md shadow-md bg-white flex flex-col gap-10 p-5 ">
                <div className="flex justify-center items-center flex-col gap-1">
                    <RiLockPasswordLine className='text-[34px] text-gray-600'/>
                    <div className="flex flex-col gap-10">
                        <span className="text-2xl text-center font-bold text-[#d6543a] ">THANK YOU FOR YOUR INTEREST!</span>
                        <span className='text-justify'>Your password has been successfully change!</span>
                        <span className='text-justify'>You will redirect to homepage in <span className='font-bold text-red-600 text-lg'>{seconds}</span> seconds!</span>
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

export default ResetPasswordSuccessfull