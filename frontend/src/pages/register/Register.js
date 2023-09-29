import React, { useCallback, useEffect, useState } from 'react'
import { MdOutlineCreate } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { accountInfo, resultEmailIsNotRegistered, resultRegister } from '../dashboard/DashboardCodes'

function Register() {

    const navigate = useNavigate()

    const [ isClick, setIsClick ] = useState(false)
    const [ values, setValues ] = useState ({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        firstNameAndLastName: ''
    })

    axios.defaults.withCredentials = true;

    const getCookiesStatus = useCallback(async () => {
        const response = await accountInfo()
        if (response && response.message === "Success"){
            toast.success("Welcome back!", {
                theme: 'colored'
            })
            navigate('/homepage')
        } 
    }, [navigate]);

    useEffect(() => {
        document.title = 'Minimart | Register'
        getCookiesStatus()

    }, [getCookiesStatus])

    const registerAccount = async (e) => {
        e.preventDefault();

        
        if (isClick) {
            try {
                const response = await resultEmailIsNotRegistered(values)
                if (response && response.message === "Success"){
                    register()
                } else {
                    toast.info('Email is already exist!', {
                        theme: 'colored'
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const register = async () => {
        try {
            const response = await resultRegister(values)
            if (response && response.message) {
                toast.success('Account Created Successfully! \nLogging In!', {
                    theme: "colored",
                });
                navigate('/login')
            } else {
                toast.error('Account Created Failed!', {
                    theme: "colored",
                });
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div className='min-h-screen flex items-center justify-center  bg-slate-200'>
            <div className="w-[350px] h-[550px] rounded-md shadow-md bg-white flex flex-col gap-10 p-5 ">
                <div className="flex justify-center items-center flex-col gap-1">
                    <MdOutlineCreate className='text-[34px] text-gray-600'/>
                    <span className="text-2xl font-bold text-[#d6543a] ">REGISTER</span>
                </div>
                <form action="" onSubmit={ registerAccount }>
                    <div className="flex flex-col gap-14 h-full">
                        <div className="w-full flex flex-col gap-2">
                            <input type="text" className='w-full p-2 shadow-lg border text-center' onChange={ e => setValues({ ...values, firstName: e.target.value})} placeholder='Enter First Name' required/>
                            <input type="text" className='w-full p-2 shadow-lg border text-center' onChange={ e => setValues({ ...values, lastName: e.target.value})} placeholder='Enter Last Name' required/>
                            <input type="email" className='w-full p-2 shadow-lg border text-center' onChange={ e => setValues({ ...values, email: e.target.value})} placeholder='Enter Email' required/>
                            <input type="password" className='w-full p-2 shadow-lg border text-center' onChange={ e => setValues({ ...values, password: e.target.value})} placeholder='Enter Password' required/>
                        </div>
                        <div className="flex flex-col justify-between gap-4 h-full">
                            <button className='bg-green-700 hover:bg-green-500 w-full rounded-md p-2 text-white' onClick={ () => setIsClick (!isClick) }>Create Account</button>
                            <Link to={'/login'} className='flex items-center justify-center'>
                                <button className='text-sm'>Login</button>
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

export default Register