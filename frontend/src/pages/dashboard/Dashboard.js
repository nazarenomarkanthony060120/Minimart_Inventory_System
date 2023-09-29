import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardStats from '../../components/dashboard/DashboardStats';
import { handleTotalStocks, handleTotalPriceTotalPrice, handleDateColor, accountInfo, resultFetchStock, handleTotalOutOfStocks, resultTotalCash, resultTotalStocks, resultOutOfStocks, resultTotalExpired, handleTotalExpired, resultAmountLoss, handleAmountLoss } from './DashboardCodes';
import DashboardTable from '../../components/dashboard/DashboardTable';
import { toast } from 'react-toastify';

function Dashboard() {

    axios.defaults.withCredentials = true;

    const fetchData = async () => {
        try {
            const response = await accountInfo()
            if (response && response.message === "Success"){
                setId(response.id)
                setName(response.firstName + ' ' + response.lastName)
                fetchTotalStocks(response.id)
                fetchTotalOutOfStocks(response.id)
                fetchTotalCash(response.id)
                fetchTotalExpired(response.id)
                fetchAmountLoss(response.id)
                fetchStocks(response.id)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [ id, setId ] = useState()
    const [ name, setName ] = useState('')
    const [ items, setItems ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);
    const [ search, setSearch ] = useState('')

    const [ totalStock, setTotalStock ] = useState(0)
    const [ totalStocksValue, setTotalStocksValue ] = useState(0)
    const [ totalOutOfStock, setTotalOutOfStock ] = useState(0)
    const [ totalCash, setTotalCash ] = useState(0)
    const [ totalExpired, setTotalExpired ] = useState(0)
    const [ totalAmountLoss, setTotalAmountLoss ] = useState(0)


    useEffect( () => {
        document.title = 'Minimart | Dashboard'
        fetchData()
    }, [ currentPage, search ])

    const fetchStocks = async(id) => {
        try {
            const response = await resultFetchStock (currentPage, search, id);
            if (response && response.message !== "Success") {
                toast.info("You don't have data to fetch in your account!", {
                    theme: 'colored'
                })
            }
            setItems(response.data)
            setTotalPages(response.totalPages)
            
        } catch (error) {
            console.log(error)
        }
    };

    const fetchTotalStocks = async (id) => {
        try {
            const response = await resultTotalStocks (id)
            if (response && response.message === "Success") {
                setTotalStock(handleTotalStocks(response.data))
                setTotalStocksValue(handleTotalPriceTotalPrice(response.data))
            } else {
                return
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchTotalOutOfStocks = async (id) => {
        try {
            const response = await resultOutOfStocks(id)
            if (response && response.message === "Success"){
                setTotalOutOfStock(handleTotalOutOfStocks(response.data))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchTotalCash = async (id) => {
        try {
            const response = await resultTotalCash(id)
            if (response && response.message === "Success"){
                setTotalCash(response.amount)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchTotalExpired = async (id) => {
        try {
            const response = await resultTotalExpired (id)
            if (response && response.message === "Success") {
                setTotalExpired(handleTotalExpired(response.data))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAmountLoss = async (id) => {
        try {
            const response = await resultAmountLoss(id)
            if (response && response.message === "Success") {
                setTotalAmountLoss(handleAmountLoss(response.data))
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleSearchChange = (event) => {
        setSearch(event);
    }; 

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <> 
        <DashboardHeader 
            propName={name} 
            propsUpdate={false}/>

        <DashboardStats
            propTotalStocks={totalStock} 
            propTotalStocksValue={totalStocksValue} 
            propTotalOutOfStocks={totalOutOfStock}
            propTotalCash={totalCash.toFixed(2)}
            propTotalExpired={totalExpired}
            propTotalAmountLoss={totalAmountLoss}/>
        
        <div className="flex justify-between flex-grow flex-wrap gap-3 w-full items-center px-3 pt-5 pb-3">
            <span className="font-semibold cursor-pointer text-lg max-sm:text-[18px]">Inventory Items</span>
            <div className="flex items-center w-fit ">
                <div className="absolute pl-4 text-slate-500">
                    <BsSearch />
                </div>
                <input type="text" className='border-2 border-gray-300 rounded-md pl-10 py-2 text-black ' placeholder='Search Item' value={ search } onChange={ e => handleSearchChange(e.target.value) }/>
            </div>
        </div>

        <DashboardTable
            id={id}
            name={name}
            propsItem={items}
            propTotalPages={totalPages}
            propCurrentPage={currentPage}
            propHandleDateColor={handleDateColor}
            propHandlePageChange={handlePageChange}
            />
        </>
        
    )
}

export default Dashboard