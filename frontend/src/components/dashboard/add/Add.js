import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { accountInfo, resultAddStock, resultHistory } from '../../../pages/dashboard/DashboardCodes'
import { toast } from 'react-toastify'
import Barcode from 'react-barcode'


function Add() {

    const navigate = useNavigate ()

    const [ isSubmitting, setIsSubmitting ] = useState(false)

    const [ barcode, setBarcode ] = useState('empty')
    const [ productName, setProductName ] = useState('')
    const [ productQuantity, setProductQuantity ] = useState(0)
    const [ productPrice, setProductPrice ] = useState(0)
    const [ totalPrice, setTotalPrice ] = useState(0)
    const [ dateStockIn, setDateStockIn ] = useState('')
    const [ dateExpired, setDateExpire ] = useState('')

    const fetchData = async () => {
        const response = await accountInfo();
        if (response && response.message === "Success"){
            setId(response.id)
        }

        if (!response)
            window.location.reload()
    }

    const [ id, setId ] = useState()

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const addStocks = async (e) => {
        e.preventDefault()
        if (isSubmitting) return;
        
        setIsSubmitting(true);

        try {
            const response = await resultAddStock(id, barcode, productName, productQuantity, productPrice, totalPrice, dateStockIn, dateExpired)
            if (response && response.message === "Success"){
                history(`New stock ${productName} has been added successfully!`)
                toast.success('Added Successfully!', {
                    theme: "colored",
                });
            } else {
                toast.error('Something Wrong Happen!', {
                    theme: "colored",
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const history = async (message) => {
        try {
            const response = await resultHistory(message, id)
            if (response.message === "Success"){
                toast.success('Recorded Stock Successfully!', {
                    theme: "colored",
                });
                navigate('/homepage')
            } else {
                toast.error('Something Wrong Happen!', {
                    theme: "colored",
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleTotalPrice = (e) => {
        const value = parseFloat(e, 10);
    
        if (isNaN(value)) {
            setTotalPrice(0);
        } else {
            setProductPrice(e) 
            const total = productQuantity * value
            setTotalPrice(total.toFixed(2))
        }
        
        
    }

    const handleTotalPrice2 = (e) => {
        const value = parseFloat(e, 10);
    
        if (isNaN(value)) {
            setTotalPrice(0);
        } else {
            setProductQuantity(value);
            const total = productPrice * value
            setTotalPrice(total.toFixed(2));
        }
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

    
    return (
        <>
        <div className="w-full min-h-screen flex items-center justify-center py-10">
            <div className="w-[320px] h-fit rounded-md shadow-md bg-[#e8e8e8] flex flex-col gap-10 p-5 ">
                <form action="" onSubmit={ addStocks }>
                    <div className="flex flex-col gap-8 h-full">
                        <span className="text-center font-bold tracking-wide text-black">ADD STOCKS</span>
                        <div className="w-full flex flex-col gap-2">
                            <div className="flex justify-center">
                                <Barcode value={barcode} height={20} font={'14'} width={1}/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className='text-black tracking-wide ' htmlFor="barcode">Barcode:</label>
                                {/* <button className='w-full p-2 shadow-lg border rounded-lg text-center' name='barcode' id='barcode' placeholder='Scan Barcode' > { barcode }</button> */}
                                <input type="text" className='w-full p-2 shadow-lg border rounded-lg text-center text-black' name='barcode' id='barcode' onChange={ e => setBarcode(e.target.value)} placeholder='Scan Barcode' required/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className='text-black tracking-wide ' htmlFor="productName">Product Name:</label>
                                <input type="text" className='w-full p-2 shadow-lg border rounded-lg text-center text-black' name='productName' id='productName' onChange={ e => setProductName(e.target.value )} placeholder='Enter Product Name' required/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className='text-black tracking-wide ' htmlFor="productQuantity">Product Quantity:</label>
                                <input type="number" className='w-full p-2 shadow-lg border rounded-lg text-center text-black' name='productQuantity' id='productQuantity' onChange={ e => handleTotalPrice2(e.target.value )} placeholder='Enter Product Quantity' required/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className='text-black tracking-wide ' htmlFor="productPrice">Product Price:</label>
                                <input type="number" step="0.01"  className='w-full p-2 shadow-lg border rounded-lg text-center text-black' name='productPrice' id='productPrice' onChange={ e => handleTotalPrice(e.target.value)} placeholder='Enter Product Price' required/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className='text-black tracking-wide ' htmlFor="totalPrice">Total Price:</label>
                                <input type="number" className='w-full p-2 shadow-lg border rounded-lg text-center text-black placeholder:text-slate-500' name='totalPrice' id='totalPrice' value={ totalPrice } placeholder='Total Price' disabled/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-end gap-2">
                                    <label className='text-black tracking-wide ' htmlFor="dateStockIn">Date Stock In:</label>
                                    <span className='text-[10px] text-red-500 font-bold tracking-wide'>* MM/DD/YYYY</span>
                                </div>
                                <input type="date" className='w-full p-2 shadow-lg border rounded-lg text-center text-black' name='dateStockIn' id='dateStockIn' onChange={ e => stockInDateToFormat(e) }/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-end gap-2">
                                    <label className='text-black tracking-wide ' htmlFor="dateExpire">Date Expire: </label>
                                    <span className='text-[10px] text-red-500 font-bold tracking-wide'>* MM/DD/YYYY</span>
                                </div>
                                <input type="date" className='w-full p-2 shadow-lg border rounded-lg text-center text-black' name='dateExpire' id='dateExpire' onChange={ e => stockDateExpiredFormat(e) } />
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-4 h-full">
                            <button className='bg-green-700 hover:bg-green-500 w-full rounded-md p-2 text-white'>Add Stock</button>
                            <Link to={'/homepage'} className='flex items-center justify-center'>
                                <button className='text-sm text-black'>Close</button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Add