import axios from 'axios';
import React, { useCallback, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import { toast } from 'react-toastify';
import { accountInfo } from '../dashboard/DashboardCodes';

function Homepage() {

    const navigate = useNavigate()
    

    axios.defaults.withCredentials = true;

    const getCookiesMessage = useCallback(async () => {
        try {
            const response = await accountInfo()
            if (response && response.message !== "Success"){
                toast.info("You're was expired please login again!", {
                    theme: 'colored'
                })
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }, [navigate]);


    useEffect(() => {
        getCookiesMessage()
         
    }, [getCookiesMessage])

    return (
        <div className="dark:bg-gray-900 dark:text-white flex">
            <div className="relative">
                <Sidebar />
            </div>
            <div className="w-full min-h-screen">
                <Outlet />
            </div>
        </div>
    )
}

export default Homepage