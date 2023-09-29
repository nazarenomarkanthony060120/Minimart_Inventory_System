import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { BiLogIn } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { accountInfo, resultLogin } from '../dashboard/DashboardCodes'

function Login() {

    const navigate = useNavigate() 

    const [ values, setValues ] = useState({
        email: '',
        password: ''
    })

    const getCookiesStatus = useCallback(async () => {
        const response = await accountInfo()
        if (response && response.message === "Success"){
            toast.success("Welcome back!", {
                theme: 'colored'
            })
            navigate('/homepage')
        } 
    }, [navigate]);

    axios.defaults.withCredentials = true;

    const loginAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await resultLogin(values)
            if (response && response.message === "Success"){
                toast.success('Login Successfully!', {
                    theme: "colored",
                });
                navigate('/homepage')
            } else if(response && response.message === "Your account is not yet verified by the Developer!") {
                toast.info('Your account is not yet verified by the Developer!, Please contact the developer to verify your account!', {
                    theme: "colored",
                });
            } else {
                toast.error("Email or Password doesn't matched!", {
                    theme: "colored",
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        document.title = 'Minimart | Login'
        getCookiesStatus()

    }, [getCookiesStatus])

    return (
        <div className='min-h-screen flex items-center justify-center  bg-slate-200'>
            <div className="w-[350px] h-fit rounded-md shadow-md bg-white flex flex-col gap-10 p-5 ">
                <div className="flex justify-center items-center flex-col gap-1">
                    <BiLogIn className='text-[34px] text-gray-600'/>
                    <span className="text-2xl font-bold text-[#d6543a] ">LOGIN</span>
                </div>
                <form action="" onSubmit={ loginAccount }>
                    <div className="flex flex-col gap-14 h-full">
                        <div className="w-full flex flex-col gap-2">
                            <input type="text" className='w-full p-2 shadow-lg border text-center' onChange={ e => setValues({ ...values, email: e.target.value })} placeholder='Enter Email' required/>
                            <input type="password" className='w-full p-2 shadow-lg border text-center' onChange={ e => setValues({ ...values, password: e.target.value })} placeholder='Enter Password' required/>
                            <Link to={'/forgotpassword'}>
                                <div className="text-end">
                                    <span className='text-sm italic'>Forgot Password</span>
                                </div>
                            </Link>
                            
                        </div>
                        <div className="flex flex-col justify-between gap-4 h-full">
                            <button className='bg-green-700 hover:bg-green-500 w-full rounded-md p-2 text-white'>Login</button>
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

export default Login