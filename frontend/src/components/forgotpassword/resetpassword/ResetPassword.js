import React, { useState } from 'react'
import { RiVerifiedBadgeLine } from 'react-icons/ri'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { resultResetPassword } from '../../../pages/dashboard/DashboardCodes'



function ResetPassword() {

    const { accountId, token } = useParams()

    const [ password, setPassword ] = useState('')
    const [ repassword, setRePassword ] = useState('')
    const [ isSubmit, setIsSubmit ] = useState(false)

    const navigate = useNavigate()

    const forgotPassword = async(e) => {
        e.preventDefault()

        if(isSubmit) return

        setIsSubmit(true)

        if (password === repassword) {
            try {
                const response = await resultResetPassword (accountId, token, password)
                console.log(response.message)
                if (response && response.message === "Success") {
                    toast.success('Your password has been changed successfully!', { theme: 'colored' })
                    navigate('/resetpasswordsuccessfull')
                    return
                }
                
                toast.error('This link is already expired!', { theme: 'colored' })
                
                setIsSubmit(false)
            } catch (error) {
                console.log(error)
            }
        } else {
            toast.error(`Password and Retype Password doesn't match!`, { theme: 'colored' })
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center  bg-slate-200'>
            <div className="w-[350px] h-fit rounded-md shadow-md bg-white flex flex-col gap-10 p-5 ">
                <div className="flex justify-center items-center flex-col gap-1">
                    <RiVerifiedBadgeLine className='text-[34px] text-gray-600'/>
                    <span className="text-2xl font-bold text-[#d6543a] ">RESET PASSWORD</span>
                </div>
                <form action="" onSubmit={ forgotPassword }>
                    <div className="flex flex-col gap-14 h-full">
                        <div className="w-full flex flex-col gap-2">
                            <input type="password" className='w-full p-2 shadow-lg border text-center' onChange={ e => setPassword(e.target.value) } placeholder='Enter Password' required/>
                            <input type="password" className='w-full p-2 shadow-lg border text-center' onChange={ e => setRePassword(e.target.value) } placeholder='Retype Password' required/>
                        </div>
                        <div className="flex flex-col justify-between gap-4 h-full">
                            <button className='bg-green-700 hover:bg-green-500 w-full rounded-md p-2 text-white'>Confirm</button>
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

export default ResetPassword