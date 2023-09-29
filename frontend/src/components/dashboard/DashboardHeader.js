import axios from 'axios';
import React from 'react'
import { BiLogOutCircle } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

function DashboardHeader(props) {
 
    const navigate = useNavigate()
 
    const handleLogout = () => {
        axios.get('http://localhost:8081/logout')
            .then((res) => {
                const data = res.data;
                if (data.message === "Success") {
                    toast.success('Logout Successfully!', {
                        theme: "colored",
                    });
                    navigate('/');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
    <>
        <div className='flex justify-between items-center dark:bg-gray-900 dark:text-slate-200 px-3 py-1 cursor-pointer'>
            <span className='text-lg font-extralight font-[Poppins] max-sm:text-[18px]'>Welcome back <span className='uppercase text-yellow-400'>{props.propName}</span>! 🎉</span>
            <button className='hover:bg-[#4077ae44] rounded-md flex items-center gap-2 p-2' onClick={ handleLogout }> < BiLogOutCircle/> <span>Logout</span></button>
        </div>
        <div className="dark:bg-gray-900 dark:text-white p-2 px-3">Dashboard {props.propsUpdate ? '> Update Stock' : ''} {props.propDelete ? '> Delete Stock' : ''} {props.propAdd ? '> Add Stock' : ''}</div>
        
    </>
    )
}

export default DashboardHeader