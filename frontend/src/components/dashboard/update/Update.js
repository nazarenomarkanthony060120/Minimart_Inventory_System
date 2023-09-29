import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { resultHistory, resultStockInfo, resultUpdateStocks } from '../../../pages/dashboard/DashboardCodes'
import Barcode from 'react-barcode'


function Update() {
    const { accountId, id } = useParams()

    const navigate = useNavigate ()
    const [ isClicked, setIsClick ] = useState(false)

    // old variables
    const [ barcode, setBarcode ] = useState('')
    const [ productName, setProductName ] = useState('')
    const [ productQuantity, setProductQuantity ] = useState(0)
    const [ productPrice, setProductPrice ] = useState(0)
    const [ totalPrice, setTotalPrice ] = useState(0)
    const [ dateStockIn, setDateStockIn ] = useState('')
    const [ dateExpired, setDateExpire ] = useState('')

    // new variables
    // barcode, datestockin, dateexpired
    // productname, quantity, price, totalprice
    const [ pName, setPName ] = useState('')
    const [ quantity, setQuantity ] = useState(0)
    const [ pPrice, setPPrice ] = useState(0)
    const [ pTotalPrice, setPTotalPrice ] = useState(0)

    const fetchStockInfo = useCallback(async () => {
        try {
            const response = await resultStockInfo(id)
            if (response && response.message === "Success") {
                setBarcode(response.data[0].barcode_id)
                setProductName(response.data[0].product_name)
                setProductQuantity(response.data[0].quantity)
                setProductPrice(response.data[0].price)
                setTotalPrice(response.data[0].total_price)
                setDateStockIn(response.data[0].date_stock_in)
                setDateExpire(response.data[0].date_expired)
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        document.title = "Minimart | Update"
        fetchStockInfo()
    }, [])

    const updateStocks = async(e) => {
        e.preventDefault();

        if (isClicked) return

        setIsClick(true)

        try {
            const response = await resultUpdateStocks(accountId, id, barcode, pName, quantity, pPrice, pTotalPrice, dateStockIn, dateExpired)
            if (response && response.message === "Success") {
                toast.success('Updated Successfully!', {
                    theme: "colored",
                });
                history(`Stock ${productName} has been updated successfully!`)
            } else {
                toast.error('Something Wrong Happen!', {
                    theme: "colored",
                });
                console.log(response)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const history = async (message) => {
        try {
            const response = await resultHistory(message, accountId)
            if (response && response.message === "Success") {
                toast.success('Updated Successfully!', {
                    theme: "colored",
                });
                navigate('/homepage')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleTotalPrice = (e) => {
        const inputValue = parseFloat(e, 10)
        
        if (isNaN(inputValue)) {
            setPTotalPrice(0)
        } else {
            const value = parseFloat(inputValue, 10);
            setQuantity(value);
            setPTotalPrice(pPrice * value);
        }
    };
      
    const handleTotalPrice2 = (e) => {
        const inputValue = parseFloat(e, 10)
        
        if (isNaN(inputValue)) {
            setPTotalPrice(0)
        } else {
            const value = parseFloat(inputValue, 10);
            setPPrice(value);
            setPTotalPrice(quantity * value);
        }
    }
    
    const handleDateFormat = (e) => {
        // Split the input date string into an array
        const dateParts = e.split('-');
      
        // Check if the dateParts array has 3 elements (month, day, and year)
        if (dateParts.length === 3) {
          // Create a Date object from the parts (assuming MM-dd-yyyy format)
          const formattedDate = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
      
          // Check if the formattedDate is a valid date
          if (!isNaN(formattedDate.getTime())) {
            // Convert the Date object back to the "yyyy-MM-dd" format
            const year = formattedDate.getFullYear();
            const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
            const day = String(formattedDate.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          }
        }
      
        // Handle invalid input (e.g., show an error message or return the original value)
        return e;
    };
      
    const stockDateStockInFormat = (e) => {
        const date = e.target.value.split('-')
        const month = date[1]
        const day = date[2]
        const year = date[0]
        setDateExpire([month, day, year].join('-'))
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
            <div className="w-fit h-fit rounded-md shadow-md bg-[#e8e8e8] flex flex-col gap-10 p-5 ">
                <form action="" onSubmit={ updateStocks }>
                    <div className="flex flex-col gap-14 h-full">
                        <div className="w-full flex flex-col gap-8">
                            <span className="text-center tracking-wide text-black">UPDATE STOCKS</span>
                            <div className="flex flex-col gap-3">
                                <div className='flex justify-center flex-grow'>
                                    <Barcode fontSize={15} height={30} width={1} value={barcode}/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className='text-slate-700 tracking-wide ' htmlFor="barcode">Barcode:</label>
                                    <input type="text" className='w-full p-2 text-black shadow-lg border rounded-lg text-center' name='barcode' id='barcode' defaultValue={ barcode } placeholder='Scan Barcode' disabled/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className='text-slate-700 tracking-wide ' htmlFor="productName">Product Name:</label>
                                    <div className="flex justify-center items-center flex-wrap-reverse gap-2">
                                        <span className='max-sm:w-full px-5 py-2 text-black shadow-lg border border-black rounded-lg text-center whitespace-pre' name='productQuantity' id='productQuantity'>{ productName }</span>
                                        <input type="text" className='max-sm:w-full p-2 text-black shadow-lg border rounded-lg text-center' name='productName' id='productName' onChange={ (e) => setPName(e.target.value)} placeholder='Enter Product Name' required/>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className='text-slate-700 tracking-wide ' htmlFor="productQuantity">Product Quantity:</label>
                                    <div className="flex flex-wrap gap-2">
                                        <span className='w-full px-5 py-2 text-black shadow-lg border border-black rounded-lg text-center' name='productQuantity' id='productQuantity'>{ productQuantity }</span>
                                        <input type="number" className='w-full p-2 text-black shadow-lg border rounded-lg text-center' name='productQuantity' id='productQuantity' onChange={ e => handleTotalPrice (e.target.value)} placeholder='Enter Product Quantity' required/>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className='text-slate-700 tracking-wide ' htmlFor="productPrice">Product Price:</label>
                                    <div className="flex flex-wrap gap-2">
                                        <span className='w-full px-5 py-2 text-black shadow-lg border border-black rounded-lg text-center' name='productQuantity' id='productQuantity'>{ productPrice }</span>
                                        <input type="number" className='w-full p-2 text-black shadow-lg border rounded-lg text-center' name='productPrice' id='productPrice' onChange={ e => handleTotalPrice2 (e.target.value) } placeholder='Enter Product Price' required/>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className='text-slate-700 tracking-wide ' htmlFor="totalPrice">Total Price:</label>
                                    <div className="flex flex-wrap gap-2">
                                        <span className='w-full px-5 py-2 text-black shadow-lg border border-black rounded-lg text-center' name='productQuantity' id='productQuantity'>{ totalPrice }</span>
                                        <input type="number" step="0.01" className='w-full p-2 text-black shadow-lg border rounded-lg text-center placeholder:text-slate-500' value={ pTotalPrice } name='totalPrice' id='totalPrice' placeholder='Total Price' disabled/>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-end gap-2">
                                        <label className='text-slate-700 tracking-wide ' htmlFor="dateStockIn">Date Stock In:</label>
                                        <span className='text-[10px] text-red-500 font-bold tracking-wide'>* MM/DD/YYYY</span>
                                    </div>
                                    <input type="date" className='w-full p-2 text-black shadow-lg border rounded-lg text-center' name='dateStockIn' id='dateStockIn' defaultValue={ handleDateFormat(dateStockIn)} onChange={ e => stockDateStockInFormat }/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-end gap-2">
                                        <label className='text-slate-700 tracking-wide ' htmlFor="dateExpire">Date Expire: </label>
                                        <span className='text-[10px] text-red-500 font-bold tracking-wide'>* MM/DD/YYYY</span>
                                    </div>
                                    <input type="date" className='w-full p-2 text-black shadow-lg border rounded-lg text-center' name='dateExpire' id='dateExpire' defaultValue={ handleDateFormat(dateExpired) } onChange={ stockDateExpiredFormat }/>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-4 h-full">
                            <button className='bg-green-700 hover:bg-green-500 w-full rounded-md p-2 text-white'>Update Stock</button>
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

export default Update