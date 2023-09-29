import React, { useState } from 'react'
import { RiVerifiedBadgeLine } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { resultForgotPassword } from '../../pages/dashboard/DashboardCodes'

function ForgotPasswordForm() {
    const [ email, setEmail ] = useState('')
    const [ isSubmit, setIsSubmit ] = useState(false)

    const navigate = useNavigate()

    const forgotPassword = async (e) => {
        e.preventDefault()

        if (isSubmit) {
            toast.info(`'Please wait a moment. I'm still processing the confirmation link!`, { theme: 'colored' })
            return 
        }

        setIsSubmit(true)
        try {
            const response = await resultForgotPassword(email)
            if (response && response.message === "Success"){
                toast.info('Confirmation Link has been sent to your email, please check your email!', { theme: 'colored' })
                navigate('/forgotpasswordsuccess')
            } else if (response && response.message === "Email not found"){
                toast.error('Email not found!', { theme: 'colored' })
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center  bg-slate-200'>
            <div className="w-[350px] h-fit rounded-md shadow-md bg-white flex flex-col gap-10 p-5 ">
                <div className="flex justify-center items-center flex-col gap-1">
                    <RiVerifiedBadgeLine className='text-[34px] text-gray-600'/>
                    <span className="text-2xl font-bold text-[#d6543a] ">FORGOT PASSWORD</span>
                </div>
                <form action="" onSubmit={ forgotPassword }>
                    <div className="flex flex-col gap-14 h-full">
                        <div className="w-full flex flex-col gap-2">
                            <input type="text" className='w-full p-2 shadow-lg border text-center' onChange={ e => setEmail(e.target.value) } placeholder='Enter Email' required/>
                        </div>
                        <div className="flex flex-col justify-between gap-4 h-full">
                            <button className='bg-green-700 hover:bg-green-500 w-full rounded-md p-2 text-white'>Send Code</button>
                            <Link to={'/register'} className='flex items-center justify-center'>
                                <button className='text-sm'>Create Account</button>
                            </Link>
                            <Link to='/'>
                                <span className='text-sm '>Home</span>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>   
    )
}

export default ForgotPasswordForm