import React, { useEffect, useState } from 'react'
import { accountInfo, date, resultFetchStocks, resultHistory, resultItemBought, resultItemBoughtCash, resultUpdateProductBought, totalProducts } from '../../pages/dashboard/DashboardCodes'
import { toast } from 'react-toastify'
import { IoMdAdd } from 'react-icons/io'
import { IoCloseSharp } from 'react-icons/io5'

function StockBody() {

    const [ id, setId ] = useState(0)
    const [ item, setItem ] = useState([])
    const [ search, setSearch ] = useState('')
    const [ products, setProducts ] = useState([]);
    const [ change, setChange ] = useState(0)
    const [ total, setTotal ] = useState('')
    const [ isSubmit, setIsSubmit ] = useState(false)


    const fetchData = async () => {
        try {
            const response = await accountInfo ()
            if (response?.message === "Success"){
                setId(response.id)
                fetchStocks(response.id)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchStocks = async(id) => {
        try {
            const response = await resultFetchStocks (search, id);
            if (response?.message !== "Success") {
                toast.info("You don't have data to fetch in your account!", {
                    theme: 'colored'
                })
            }
            
            setItem(response.data)
            
        } catch (error) {
            console.log(error)
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event);
    }; 

    const addProduct = async ( data, index ) => {
        if (data){
            const newProduct = {
                account_id: data.account_id,
                product_id: data.id,
                productIndex: index,
                product_name: data.product_name,
                quantity: 1,
                price: data.price,
                date_bought: date()
            };
            setProducts( (oldProduct) => [...oldProduct, newProduct] );
        }
    };

    const removeProduct = (index) => {
        setProducts(products.filter(product => product.productIndex !== index));
    }

    const totalChange = (totalAmount, cash) => {
        if (!isNaN(cash) && cash !== ''){
            setChange((cash - totalAmount).toFixed(2))
            setTotal(cash)
        } else 
            setChange(0)
    }

    const payProducts = async (e) => {
        e.preventDefault()

        if (isSubmit) return

        setIsSubmit(true)

        const totalAmount = totalProducts(products)
        if (total >= totalAmount && products.length >= 1) {
            try {
                const response = await resultItemBought(products);
                if (response && response.message === "Success") {
                    
                    updateStock()
                    history(`There are ${products.length} product/s has been bought today . Total amount is: ${totalAmount}!`)
                    insertCash(totalAmount)

                    setTotal('')
                    setChange(0)

                    setProducts([]);
                    setIsSubmit(false);

                }
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.error('You have no product/s to pay or input cash!', {
                theme: 'colored',
            });
            setIsSubmit(false);
        }
    }

    const updateStock = async () => {
        try {
            await  resultUpdateProductBought(products)
        } catch (error) {
            console.log(error)
        }
    }

    const history = async (message) => {
        try {
            const response = await resultHistory (message, id)
            if (response && response.message === "Success"){
                toast.success('Purchase Recorded Automatically!', {
                    theme: 'colored'
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const insertCash = async (totalAmount) => {
        try {
            const response = await resultItemBoughtCash (id, totalAmount)
            if (response && response.message === "Success") {
                toast.success('Item bought!', {
                    theme: 'colored',
                });
                document.getElementById('cash').value = ''
            } 
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        document.title = 'Minimart | Stocks'
        fetchData()
    }, [ search, products ])

    return (  
        <>
            <div className="grid grid-cols-2 max-[1015px]:grid-cols-1 gap-5 m-3">
                <div className="flex flex-col gap-10">
                    <div className="">
                        <input type="text" className="p-2 border-2 border-t-[#123] border-l-[#123] border-r-[#123] text-black rounded-tr-2xl rounded-tl-2xl focus:outline-none text-center w-full text-sm bg-gray-200 dark:bg-white" placeholder='Search Item | Scan Item' onChange={ e => handleSearchChange(e.target.value) } autoFocus/>
                        <div className="relative overflow-x-auto shadow-md rounded-lg font-poppins">
                            <table className="w-full text-sm text-left dark:bg-gray-900 dark:text-white">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th className="px-3 py-2">#</th>
                                        <th className="px-3 py-2 whitespace-pre">Product name</th>
                                        <th className="px-3 py-2 ">Quantity</th>
                                        <th className="px-3 py-2 ">Price</th>
                                        <th className="px-3 py-2 ">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item && item.length !== 0 ? item.map((data, i) => (
                                        <tr key={i} className={`${i % 2 === 0 ? 'border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600 dark:hover:text-white hover:bg-gray-600 hover:text-white' : 'bg-white border-b dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-600 dark:hover:text-white hover:bg-gray-600 hover:text-white '}  ` } onClick={ () => addProduct(data, products.length)} >
                                            <th className="px-3 py-2 font-medium">{++i}</th>
                                            <td className="px-3 py-2">{data.product_name}</td>
                                            <td className="px-3 py-2">{data.quantity}</td>
                                            <td className="px-3 py-2">{data.price}</td>
                                            <td className="px-3 py-2" > <button className='hover:bg-gray-500 rounded-xl w-full h-full flex justify-center py-2' > <IoMdAdd /></button></td>
                                        </tr>
                                    )) : <tr className='centered-row font-extrabold text-2xl py-10'>
                                            <td colSpan="5" className='text-center py-5'>NO ITEMS TO DISPLAY!</td>
                                        </tr> 
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* <div className='flex justify-center'> 
                        <button className='rounded-md bg-emerald-600 w-fit text-white hover:bg-emerald-400 hover:text-black px-5 py-2'>PRINT</button>
                    </div> */}
                </div>

                <div className="flex flex-col bg-[#e2e3e3] rounded-lg dark:text-black dark:bg-gray-200 h-fit">
                    <div className="text-center py-2">
                        <span className="text-center">Item List</span>
                    </div>
                    <div className={`relative overflow-x-auto ${products.length >= 10 ? 'h-[500px]' : ''}  shadow-md rounded-lg font-poppins`}>
                        <table className="w-full overflow-y-scroll text-sm text-left dark:bg-gray-900 dark:text-white">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-3 py-2">#</th>
                                    <th className="px-3 py-2 whitespace-pre">Product name</th>
                                    <th className="px-3 py-2 ">Quantity</th>
                                    <th className="px-3 py-2 ">Price</th>
                                    <th className="px-3 py-2 ">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products ? products.length === 0 
                                    ?   <tr className='centered-row font-extrabold text-2xl py-10'>
                                            <td colSpan="5" className='text-center py-5'>NO ITEMS SELECTED!</td>
                                        </tr> 

                                    :   products.map((data, i) => (
                                        <tr key={i} className={`${i % 2 === 0 ? 'border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600 dark:hover:text-white hover:bg-gray-600 hover:text-white' : 'bg-white border-b dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-600 dark:hover:text-white hover:bg-gray-600 hover:text-white '}  `}>
                                            <th className="px-3 py-2 font-medium">{++i}</th>
                                            <td className="px-3 py-2">{data.product_name}</td>
                                            <td className="px-3 py-2">1</td>
                                            <td className="px-3 py-2">Php {data.price}</td>
                                            <td className="px-3 py-2" > <button className='hover:bg-gray-500 rounded-xl w-full h-full flex justify-center py-2' onClick={ () => removeProduct(data.productIndex)}> <IoCloseSharp /></button></td>
                                        </tr>
                                        ))
                                    : ''
                                }
                            </tbody>
                        </table>
                    </div>
                    <form action="" onSubmit={ payProducts }>
                        <div className="flex justify-evenly max-sm:flex-col max-sm:items-center max-sm:gap-4 max-sm:text-sm py-4">
                            <div className="flex items-start flex-col w-fit gap-2">
                                <div className="flex items-center w-full">
                                    <label htmlFor="totalAmount">Total: </label>
                                    <div className="flex justify-center items-center w-full">
                                        <span>Php {totalProducts(products).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="cash">Cash: </label>
                                    <input type="number" className='rounded-md p-2 text-center' onChange={ e => totalChange( totalProducts(products), e.target.value) }  name='cash' id='cash'/>
                                </div>
                            </div>
                            <div className="flex items-start flex-col w-fit gap-2">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="cash">Change: </label>
                                    <div className="flex justify-center items-center w-full">
                                        <span>Php {change} </span>
                                    </div>
                                </div>
                                <div className="flex justify-center w-full">
                                    <button className='rounded-md bg-emerald-600 w-full text-white hover:bg-emerald-400 hover:text-black p-2'>PAY</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default StockBody