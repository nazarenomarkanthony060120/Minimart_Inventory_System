import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { resultDeleteStock, resultDeletedStock, resultHistory, resultStockInfo } from '../../../pages/dashboard/DashboardCodes'
import Barcode from 'react-barcode'


function Delete() {
    const { accountId, id } = useParams()

    const navigate = useNavigate()

    const [ barcode, setBarcode ] = useState('')
    const [ productName, setProductName ] = useState('')
    const [ productQuantity, setProductQuantity ] = useState(0)
    const [ productPrice, setProductPrice ] = useState(0)
    const [ totalPrice, setTotalPrice ] = useState(0)
    const [ dateStockIn, setDateStockIn ] = useState('')
    const [ dateExpired, setDateExpire ] = useState('')

    const handleStock = async(e) => {
        e.preventDefault();
        try {
            const response = await resultDeleteStock (accountId, barcode, productName, productQuantity, productPrice, totalPrice, dateStockIn, dateExpired)
            if (response && response.message === "Success") {
                history(`Stock ${productName} has been deleted successfully!`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const history = async (message) => {
        try {
            const response = await resultHistory(message, accountId)
            if (response && response.message === "Success") {
                deletedStock()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deletedStock = async () => {
        try {
            const response = await resultDeletedStock(accountId, id)
            if (response && response.message === "Success"){ 
                toast.success(`${productName} stock has been deleted successfully!`, {
                    theme: 'colored'
                })
                navigate('/homepage')
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const fetchStock = async () => {
        try {
            const response = await resultStockInfo(id);
            if (response && response.message === "Success"){
                setBarcode(response.data[0].barcode_id)
                setProductName(response.data[0].product_name)
                setProductQuantity(response.data[0].quantity)
                setProductPrice(response.data[0].price)
                setTotalPrice(response.data[0].total_price)
                setDateStockIn(response.data[0].date_stock_in)
                setDateExpire(response.data[0].date_expired)
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchStock()
    }, [])
    
    return (
        <>
        <div className="w-full min-h-screen flex items-center justify-center py-10">
            <div className="w-[320px] h-fit rounded-md shadow-md bg-[#e8e8e8] flex flex-col gap-10 p-5 ">
                <form action="" onSubmit={ handleStock }>
                    <div className="flex flex-col gap-14 h-full">
                        <div className="w-full flex flex-col gap-8">
                            <span className="text-center tracking-wide text-black">Are you sure you want to <span className='uppercase font-bold text-red-600 tracking-wide text-lg'>delete</span> this stock?</span>
                            <div className="w-full flex flex-col gap-2">
                                <div className="flex justify-center">
                                    <Barcode value={barcode} height={20} font={'14'} width={1}/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className='text-slate-700 tracking-wide ' htmlFor="barcode">Barcode:</label>
                                    <input type="text" className='w-full p-2 shadow-lg text-black border rounded-lg text-center' name='barcode' id='barcode' value={ barcode } placeholder='Scan Barcode' disabled/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className='text-slate-700 tracking-wide ' htmlFor="productName">Product Name:</label>
                                    <input type="text" className='w-full p-2 shadow-lg text-black border rounded-lg text-center' name='productName' id='productName' value={ productName } placeholder='Enter Product Name' disabled/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className='text-slate-700 tracking-wide ' htmlFor="productQuantity">Product Quantity:</label>
                                    <input type="number" className='w-full p-2 shadow-lg text-black border rounded-lg text-center' name='productQuantity' id='productQuantity' value={ productQuantity } placeholder='Enter Product Quantity' disabled/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className='text-slate-700 tracking-wide ' htmlFor="productPrice">Product Price:</label>
                                    <input type="number" className='w-full p-2 shadow-lg text-black border rounded-lg text-center' name='productPrice' id='productPrice' value={ productPrice } placeholder='Enter Product Price' disabled/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className='text-slate-700 tracking-wide ' htmlFor="totalPrice">Total Price:</label>
                                    <input type="number" className='w-full p-2 shadow-lg text-black border rounded-lg text-center placeholder:text-slate-500' name='totalPrice' id='totalPrice' value={ totalPrice }  placeholder='Total Price' disabled/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-end gap-2">
                                        <label className='text-slate-700 tracking-wide ' htmlFor="dateStockIn">Date Stock In:</label>
                                        <span className='text-[10px] text-red-500 font-bold tracking-wide'>* MM/DD/YYYY</span>
                                    </div>
                                    <input
                                        type="text" className='w-full p-2 shadow-lg text-black border rounded-lg text-center' name='dateStockIn' id='dateStockIn' value={dateStockIn} disabled />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-end gap-2">
                                        <label className='text-slate-700 tracking-wide ' htmlFor="dateExpire">Date Expire: </label>
                                        <span className='text-[10px] text-red-500 font-bold tracking-wide'>* MM/DD/YYYY</span>
                                    </div>
                                    <input type="text" className='w-full p-2 shadow-lg text-black border rounded-lg text-center' name='dateExpire' id='dateExpire' value={ dateExpired } disabled />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-4 h-full">
                            <button className='bg-green-700 hover:bg-green-500 w-full rounded-md p-2 text-white'>Delete Stock</button>
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

export default Delete