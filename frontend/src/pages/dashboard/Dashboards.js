import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { BiLogOutCircle } from 'react-icons/bi'
import { BsCart4, BsCartX, BsSearch, BsPencil } from 'react-icons/bs'
import { AiFillDollarCircle } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

function Dashboard() {
    
    const navigate = useNavigate()

    const [ name, setName ] = useState('')
    const [ items, setItems ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);

    const [ search, setSearch ] = useState('')

    const [ stockResults, setStockResults ] = useState([])
    const [ cash, setCash ] = useState([])

    let expired = 0, expire_total_price = 0, total_price = 0, stocks_length = 0, out_of_stocks_length = 0

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:8081')
        .then(res => {
            const data = res.data
            if (data.message === "Success"){
                document.title = 'Minimart | Dashboard'
                setName(data.firstName)
                fetchStocks(data.id);
            } else {
                navigate('/')
            }
        })
         
    }, [ navigate, currentPage, search ])

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

    const fetchStocks = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8081/dashboard?page=${currentPage}&search=${search}&id=${id}`);
            setItems(response.data.data);
            setTotalPages(response.data.totalPages);
            setStockResults(response.data.stocks);
            setCash(response.data.cash)

        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handleCash = (cash) => {
        let cashMoney = 0
        cash.map((data) => {
            cashMoney = data.cash
        })
        return parseInt(cashMoney)
    }

    const handleTotalStocks = (stockResults) => {
        stockResults.map((data) => {
            const quantity = data.quantity
            if (parseInt(quantity) >= 1){
                ++stocks_length
            } else {
                ++out_of_stocks_length
            }
        })
        return stocks_length
    }

    const handleTotalPriceTotalPrice = (stockResults) => {
        stockResults.map((data) => {
            const currentDate = new Date(); // Current date

            // Parse the input date string to a Date object
            const dateParts = data.date_expired.split('/');
            const inputDate = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
        
            // Calculate the difference in days
            const diffTime = (inputDate - currentDate);
            const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
            if (diffDay >= 1) {
                let sum = data.total_price
                total_price = total_price + parseInt(sum)
            }
        })

        return total_price
    }

    const handleExpired = (stockResults) => {
        stockResults.map((data) => {
            const currentDate = new Date(); // Current date

            // Parse the input date string to a Date object
            const dateParts = data.date_expired.split('/');
            const inputDate = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
        
            // Calculate the difference in days
            const diffTime = (inputDate - currentDate);
            const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
            if (diffDay <= 0) {
                ++expired
                let sum = data.total_price
                expire_total_price = expire_total_price + parseInt(sum)
            }
        })
        return expired
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleDateColor = (date1, quantity) => {
        const currentDate = new Date(); // Current date

        // Parse the input date string to a Date object
        const dateParts = date1.split('/');
        const inputDate = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);

        // Calculate the difference in days
        const diffTime = (inputDate - currentDate);
        const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (quantity <= 0 && diffDay >= 1) {
            return 'bg-red-300 hover:bg-red-500 hover:text-white'
        } else if (diffDay >= 61) {
            return 'bg-green-300 hover:bg-green-500 hover:text-white '
        }  else if (diffDay <=60 && diffDay >= 1) {
            return 'bg-blue-300 hover:bg-blue-500 hover:text-white'
        } else if (diffDay <= 0 ) {
            return 'bg-red-300 hover:bg-red-500 hover:text-white'
        }

        
    }

    return (
        <>
        
        <div className='flex justify-between items-center bg-[#123] text-slate-200 px-5 py-1 cursor-pointer'>
            <span className='text-lg font-extralight font-[Poppins] max-[440px]:text-[16px]'>Welcome back <span className='uppercase text-yellow-400'>{name}</span>! 🎉</span>
            <button className='hover:bg-[#4077ae44] rounded-md flex items-center gap-2 p-2' onClick={ handleLogout }> < BiLogOutCircle/> <span>Logout</span></button>
        </div>
        <div className="bg-[#123] text-white p-2 px-5">Dashboard</div>
        <div className="mx-5 py-2">
            <span className="font-semibold text-slate-700 text-2xl max-[635px]:text-lg ">Inventory Stats</span>
        </div>
        <div className="flex justify-center gap-5 text-white mx-5 pt-2 pb-3 max-[870px]:flex-wrap">
            <div className="flex w-64 gap-5 bg-[#be38be] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <BsCart4 /> 
                </div>
                <div className="flex flex-col">
                    <span className='font-light text-sm'>Total Products</span>
                    <span className='font-semibold text-lg'>{ handleTotalStocks(stockResults) }</span>
                </div>
            </div>
            <div className="flex w-64 gap-5 bg-[#339f33] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <AiFillDollarCircle />
                </div>
                <div className="flex flex-col">
                    <span className='font-light text-sm'>Total Store Value</span>
                    <span className='font-semibold text-lg'>{ handleTotalPriceTotalPrice(stockResults) }</span>
                </div>
            </div>
            <div className="flex w-64 gap-5  bg-[#f03f3f] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <BsCartX />
                </div>
                <div className="flex flex-col">
                    <span className='font-light text-sm'>Out of Stock</span>
                    <span className='font-semibold text-lg'>{ out_of_stocks_length }</span>
                </div>
            </div>
            <div className="flex w-64 gap-5  bg-[#4080f7] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <AiFillDollarCircle />
                </div>
                <div className="flex flex-col">
                    <span className='font-light text-sm'>Cash</span>
                    <span className='font-semibold text-lg'>{ handleCash(cash) }</span>
                </div>
            </div>
        </div>
        <div className="flex justify-center gap-5 border-b-2 border-b-gray-300 text-white mx-5 pt-2 pb-3 max-[870px]:flex-wrap">
            <div className="flex w-64 gap-5  bg-[#ba7b2e] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <AiFillDollarCircle />
                </div>
                <div className="flex flex-col">
                    <span className='font-light text-sm'>No. of Expired</span>
                    <span className='font-semibold text-lg' >{ handleExpired(stockResults) }</span>
                </div>
            </div>
            <div className="flex w-64 gap-5  bg-[#3ec4a0] rounded-md cursor-pointer px-5 py-2">
                <div className="flex items-center text-4xl font-extralight">
                    <AiFillDollarCircle />
                </div>
                <div className="flex flex-col">
                    <span className='font-light text-sm'>Expired Amount Loss</span>
                    <span className='font-semibold text-lg'>{ expire_total_price }</span>
                </div>
            </div>
        </div>
        <div className="flex justify-between items-center mx-5 mt-5 mb-3">
            <span className="font-semibold text-slate-700 text-2xl cursor-pointer max-[635px]:text-lg max-[420px]:text-sm">Inventory Items</span>
            <div className="flex items-center">
                <div className="absolute ml-4 text-slate-500">
                    <BsSearch />
                </div>
                <input type="text" className='border-2 border-gray-300 rounded-md pl-10 py-2  max-[635px]:w-40 max-[420px]:p' placeholder='Search Item' value={ search } onChange={ handleSearchChange }/>
            </div>
        </div>
        <div className="flex flex-grow justify-end items-center cursor-pointer gap-3 mx-5 mb-3">
            <span className="font-semibold text-md">Legend:</span>
            <div className="flex justify-center items-center gap-2" title='Above 1 Month before expire'>
                <span className="w-2 h-2 bg-green-600"></span>
                <p className='max-sm:text-sm max-md:text-lg'>Fresh</p>
            </div>
            <div className="flex justify-center items-center gap-2" title='Below 60 days before expire'>
                <span className="w-2 h-2 bg-blue-600"></span>
                <p className='max-sm:text-sm max-md:text-lg'>Nearly Expire</p>
            </div>
            <div className="flex justify-center items-center gap-2" title='In or Above days after expired'>
                <span className="w-2 h-2 bg-red-600"></span>
                <p className='max-sm:text-sm max-md:text-lg'>Expired | Out of Stocks</p>
            </div>
        </div>
        <div className="mx-5">
            <table className=" w-full table-auto border-none text-sm cursor-pointer ">
                <thead className='border-t-2 border-[#3ea1e3] border-b-2'>
                    <tr className="">
                        <th className="py-2 w-fit font-normal">#</th>
                        <th className="py-2 w-fit font-normal">Item</th>
                        <th className="py-2 w-fit font-normal">Quantity</th>
                        <th className="py-2 w-fit font-normal">Price</th>
                        <th className="py-2 w-fit font-normal">Total Price</th>
                        <th className="py-2 w-fit font-normal max-[459px]:hidden">Stock In</th>
                        <th className="py-2 w-fit font-normal max-[459px]:hidden">Expired</th>
                        <th className='w-fit'></th>
                    </tr>
                </thead>
                <tbody className=''>
                    {items.map((data, i) => (
                        <tr key={i} className={`${ handleDateColor(data.date_expired, data.quantity) }`}>
                            <td className="py-3 text-center">{i}</td>
                            <td className="py-3 text-center">{data.product_name}</td>
                            <td className="py-3 text-center">{data.quantity}</td>
                            <td className="py-3 text-center">{data.price}</td>
                            <td className="py-3 text-center">{data.total_price}</td>
                            <td className="py-3 text-center max-[459px]:hidden">{data.date_stock_in}</td>
                            <td className="py-3 text-center max-[459px]:hidden">{data.date_expired}</td>
                            <td className='w-fit'>
                                <div className="flex justify-center gap-4 text-[14px]">
                                    <Link to={`updatestocks/${name}/${data.id}`}>
                                        <button>
                                            <BsPencil />
                                        </button>
                                    </Link>
                                        <button value={data.id}>
                                            <MdDeleteOutline />
                                        </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex justify-center gap-4 p-4 cursor-pointer max-[400px]:flex-col max-[400px]:items-center'>
                <div className="">
                    <span className="text-sm">Items from { items.length } / { items.length }</span>
                </div>
                <div className="flex justify-center items-center flex-grow gap-2 ">
                    {Array.from({ length: totalPages }, ( _, index) => (
                        <button key={index} className={`${currentPage === index + 1 ? 'border-2 border-[#3ea1e3] text-sm' : ''} border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-3 py-1 text-black rounded-lg `} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                    ))}
                </div>
            </div>
        </div>
        </>
        
    )
}

export default Dashboard









{/* <div className="flex justify-center items-center flex-grow gap-2 ">
                    {Array.from({ length: props.propTotalPages }, ( _, index) => (
                        <button key={index} className={`${props.propCurrentPage === index + 1 ? 'border-2 border-[#3ea1e3] text-sm' : ''} border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-3 py-1 text-black rounded-lg `} onClick={() => props.propHandlePageChange(index + 1)}>{index + 1}</button>
                    ))}
                </div> */}

                {/* <div className="flex justify-center items-center flex-grow gap-2 ">
                    <button
                        className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-3 py-1 text-black rounded-lg `}
                        onClick={() => props.propHandlePageChange(props.propCurrentPage - 1)}
                        disabled={props.propCurrentPage === 1} // Disable the button if on the first page
                    >
                        Previous
                    </button>
                    {Array.from({ length: props.propTotalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`${props.propCurrentPage === index + 1 ? 'border-2 border-[#3ea1e3] text-sm' : ''} border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-3 py-1 text-black rounded-lg `}
                            onClick={() => props.propHandlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className={`border-2 border-[#3ea1e3] hover:bg-[#3ea1e3] hover:text-white px-3 py-1 text-black rounded-lg `}
                        onClick={() => props.propHandlePageChange(props.propCurrentPage + 1)}
                        disabled={props.propCurrentPage === props.propTotalPages} // Disable the button if on the last page
                    >
                        Next
                    </button>
                </div> */}