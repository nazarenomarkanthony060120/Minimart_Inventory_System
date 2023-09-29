import React, { useEffect, useState } from 'react'
import { HiMenuAlt3, HiOutlineCash } from 'react-icons/hi'
import { LuLayoutGrid } from 'react-icons/lu'
import { BiAddToQueue } from 'react-icons/bi'
import { MdOutlineDarkMode } from 'react-icons/md'
import { BsSun } from 'react-icons/bs'
import { TbReportAnalytics } from 'react-icons/tb'
import { Link } from 'react-router-dom'

function Sidebar() {

    const menus = [
        { name: "Dashboard", link: "/homepage", icon: LuLayoutGrid },
        { name: "Stocks", link: "stocks", icon: BiAddToQueue },
        { name: "Cash Out", link: "cash", icon: HiOutlineCash },
        { name: "Reports", link: "report", icon: TbReportAnalytics },
    ]
    
    const [open, setOpen] = useState(false)

    const [ theme, setTheme ] = useState('dark')

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [theme])

    const handleThemeSwitch = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }
    return (
        <div className={`flex dark:bg-gray-900 dark:text-white text-black w-16 ${open ? 'w-44' : 'w-16'} duration-500`}>
            <div className={`fixed dark:bg-gray-900 dark:text-white top-0 left-0 bottom-0 ${open ? 'w-44' : 'w-16'} duration-500 px-4 text-black w-16  overflow-hidden`}>
                <div className="flex justify-end py-3 ">
                    <HiMenuAlt3 size={26} className="cursor-pointer" onClick={() => setOpen(!open)}/>
                </div>

                <Link to={'/homepage'} className="flex items-center text-md font-medium whitespace-pre overflow-hidden gap-3 ml-1">
                    <img src="../minimart.png" alt="Just-In Minimart Logo" height={25} width={25} />
                    
                    <div className={`whitespace-pre duration-500 ${ !open && 'opacity-0 translate-x-28 overflow-hidden' }`}>
                        <p>Inventory</p>
                        <p>System</p> 
                    </div>
                </Link>

                <div className='mt-10 flex flex-col gap-4 relative'>
                    {menus?.map((menus, i) => (
                        <Link to={menus?.link} key={i} className='group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-700 hover:text-white rounded-md'>
                            <div>{React.createElement(menus?.icon, { size: "20" })}</div>
                            <h2 style={{transition: `${ i + 8 }00ms`}} className={`whitespace-pre duration-500 ${ !open && 'opacity-0 translate-x-28 overflow-hidden' }`}>{menus?.name}</h2> 
                            <h2 className={`${open && 'hidden'} absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 w-0 overflow-hidden group-hover:w-fit`}>{menus?.name}</h2>
                        </Link>
                    ))}
                </div>  

                <div className="group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-700 hover:text-white rounded-md mt-4 cursor-pointer" onClick={ handleThemeSwitch }>
                    <div>{theme === "dark" ? <BsSun size={20}/> : <MdOutlineDarkMode size={20}/>}</div>
                    <h2 style={{transition: `800ms`}} className={`whitespace-pre duration-500 ${ !open && 'opacity-0 translate-x-28 overflow-hidden' }`}>{theme === "dark" ? "Light" : "Dark"} Mode</h2> 
                </div>    
            </div>
        </div>
    )
}

export default Sidebar