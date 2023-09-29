import React, { useEffect, useState } from 'react'
import { BiLogOutCircle } from 'react-icons/bi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function UpdateStocks() {

    const navigate = useNavigate() 
    const { id } = useParams()

    const [ name, setName ] = useState('')
    const [ barcode, setBarcode ] = useState('')
    const [ productName, setProductName ] = useState('')
    const [ productPrice, setProductPrice ] = useState(0)
    const [ productQuantity, setProductQuantity ] = useState(0)
    const [ totalPrice, setTotalPrice ] = useState(0)
    const [ dateStockIn, setDateStockIn ] = useState('')
    const [ dateExpire, setDateExpire ] = useState('')

    const [ values, setValues ] = useState({
        barcode: '',
        productName: '',
        productPrice: productPrice,
        productQuantity: 0,
        totalPrice: 0,
        dateStockIn: '',
        dateExpired: ''
    })


    axios.defaults.withCredentials = true;

    useEffect(() => {
        // axios.get('http://localhost:8081/')
        // .then(res => {
        //     const data = res.data
        //     if (data.message === "Success"){
                axios.get('http://localhost:8081/getStock/' + id)
                .then((res) => {
                    const response = res.data;
                    console.log(response.data)
                    setBarcode(response.data[0].barcode_id)
                    setProductName(response.data[0].product_name)
                    setProductPrice(response.data[0].price)
                    setProductQuantity(response.data[0].quantity)
                    setTotalPrice(response.data[0].total_price)
                    setDateStockIn(response.data[0].date_stock_in)
                    setDateExpire(response.data[0].date_expired)
                })
        //         document.title = 'Minimart | Dashboard'
        //         setName(data.firstName)
        //     } 
        // })
         
    }, [])

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout')
        .then ((res) => {
            const data = res.data;
            if (data.message === "Success"){
                navigate('/')
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const formatDateForInput = (date) => {
        if (!date) {
            return ''; // Return an empty string if date is undefined
        }
        
        const parts = date.split('/');
        if (parts.length !== 3) {
            return ''; // Return empty string for invalid date format
        }
        
        const formattedDate = `${parts[1]}-${parts[0].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        return formattedDate;
    }

    const stockInDateToFormat = (e) => {
        const date = e.target.value.split('-')
        const month = date[1]
        const day = date[2]
        const year = date[0]
        setDateStockIn([month, day, year].join('-'))
    }

    const stockDateExpiredFormat = (e) => {
        const date = e.target.value.split('-')
        const month = date[1]
        const day = date[2]
        const year = date[0]
        setDateExpire([month, day, year].join('-'))
    }
        
    const handleTotalPrice = (e) => {
        setProductPrice(e) 
        const value = parseFloat(e, 10)
        setTotalPrice(productQuantity * value)
    }

    const updateStocks = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8081/updateStock/${id}`, [barcode, productName, productQuantity, productPrice, totalPrice, dateStockIn, dateExpire])
        .then((res) => {
            if (res.data.message === "Success"){
                console.log(3)
            } else {
                console.log(5)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
    <>
        <div className='flex justify-between items-center bg-[#123] text-slate-200 px-5 py-1 cursor-pointer'>
            <span className='text-lg font-extralight font-[Poppins] max-[440px]:text-[16px]'>Welcome back <span className='uppercase text-yellow-400'>{name}</span>! 🎉</span>
            <button className='hover:bg-[#4077ae44] rounded-md flex items-center gap-2 p-2' onClick={ handleLogout }> < BiLogOutCircle/> <span>Logout</span></button>
        </div>
        <div className="bg-[#123] text-white p-2 px-5">Dashboard &gt; Update Stocks</div>
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-[350px] h-fit rounded-md shadow-md bg-[#e8e8e8] flex flex-col gap-10 p-5 ">
                <form action="" onSubmit={ updateStocks }>
                    <div className="flex flex-col gap-14 h-full">
                        <div className="w-full flex flex-col gap-2">
                            <span className="text-center">UPDATE STOCKS</span>
                            <input type="text" className='w-full p-2 shadow-lg border rounded-lg text-center' value={ barcode } onChange={ e => setBarcode(e.target.value )} placeholder='Scan Barcode' required/>
                            <input type="text" className='w-full p-2 shadow-lg border rounded-lg text-center' value={ productName } onChange={ e => setProductName(e.target.value )} placeholder='Enter Product Name' required/>
                            <input type="number" className='w-full p-2 shadow-lg border rounded-lg text-center' value={ productQuantity } onChange={ e => setProductQuantity(e.target.value )} placeholder='Enter Product Quantity' required/>
                            <input type="number" className='w-full p-2 shadow-lg border rounded-lg text-center' value={ productPrice } onChange={ e => handleTotalPrice(e.target.value)} placeholder='Enter Product Price' required/>
                            <input type="number" className='w-full p-2 shadow-lg border rounded-lg text-center placeholder:text-slate-500' value={ totalPrice }  placeholder='Total Price' disabled/>
                            <input type="date" className='w-full p-2 shadow-lg border rounded-lg text-center' value={ formatDateForInput(dateStockIn) } onChange={ stockInDateToFormat } placeholder='Date Stock In' required/>
                            <input type="date" className='w-full p-2 shadow-lg border rounded-lg text-center' value={ formatDateForInput(dateExpire) } onChange={ stockDateExpiredFormat } placeholder='Expired Date' required/>
                        </div>
                        <div className="flex flex-col justify-between gap-4 h-full">
                            <button className='bg-green-700 hover:bg-green-500 w-full rounded-md p-2 text-white'>Update Stock</button>
                            <Link to={'/homepage'} className='flex items-center justify-center'>
                                <button className='text-sm'>Close</button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>
    )
}

export default UpdateStocks