import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import LandingPageSVG from '../../assests/landingpage.json'
import { TypeAnimation } from 'react-type-animation'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import axios from 'axios'
import ContactDeveloper from '../contactdeveloper/ContactDeveloper'

function LandingPage() {

    const navigate = useNavigate()
    const [ contact, setContact ] = useState(false)

    const handleClose = (contact) => {
        setContact(contact)
    }

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:8081')
        .then(res => {
            const data = res.data;
            if (data.message === "Success") {
                navigate('/homepage');
            } else {
                document.title = "Minimart | Inventory System";
            }
        });

    }, [navigate]); // Add navigate as a dependency here

    const text = <TypeAnimation sequence={['Inventory Management System', 1000, 'Cash Management System', 1000, 'Stocks Management System', 1000]} speed={50} repeat={Infinity}/>;

    
    return (
        <>

            <div className={` ${contact ? '' : 'hidden'}`}>
                <ContactDeveloper isClick={handleClose}/>
            </div>
            <div className="bg-[#123] min-h-screen flex flex-col gap-16 ">
                <Header />
                <div className="flex items-center justify-center gap-5 max-md:flex-col ">
                    <Lottie className='w-96 h-96' loop={ true } animationData={ LandingPageSVG }></Lottie>
                    <div className="flex flex-col text-slate-200 gap-10 w-96 max-md:w-full max-md:text-center">  
                        <div className="flex flex-col gap-3 px-8">
                            <span className='text-[30px] font-bold font-[Poppins]'>{text}</span>
                            <span className='font-light text-justify max-md:text-center'>Inventory system to control and manage all producs in the minimart in real time and integrated to make it easier to develop your business</span>
                        </div>
                        <div className="flex items-center justify-center gap-5 max-[481px]:flex-col">
                            <button className='border border-white rounded-md p-2 w-44 hover:bg-slate-700'>Free Life Time Access</button>
                            <button className='border border-white rounded-md p-2 w-44 hover:bg-slate-700' onClick={ e => setContact(true) }>Contact Developer</button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-5 text-slate-200">
                    <Link to={'/login'}>
                        <button className='border border-white rounded-md p-2 w-20 hover:bg-slate-700'>Login</button>
                    </Link>
                    <Link to={'/register'}>
                        <button className='border border-white rounded-md p-2 w-20 hover:bg-slate-700'>Register</button>
                    </Link>
                </div>
                <div >
                    <Footer/>
                </div>
            </div>
        </>
        
    )
}

export default LandingPage