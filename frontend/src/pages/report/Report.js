import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReportStats from '../../components/report/ReportStats'
import ReportTable from '../../components/report/ReportTable'
import { accountInfo, resultFetchAllReports, resultFetchReports } from '../dashboard/DashboardCodes'

function Report() {

    const [ id, setId ] = useState(0)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ totalPages, setTotalPages ] = useState(1)
    const [ firstDate, setFirstDate ] = useState('')
    const [ secondDate, setSecondDate ] = useState('')
    const [ items, setItems ] = useState([])
    const [ products, setProducts ] = useState(0)
    const [ amount, setAmount ] = useState(0)


    const fetchData = async () => {
        try {
            const response = await accountInfo()
            if (response && response.message === "Success") {
                setId (response.id)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchReportsAllHistory = async () => {
        try {
            const response = await resultFetchAllReports(id, currentPage)
            if (response && response.message === "Success") {
                setItems(response.data)
                setProducts(response.products)
                setAmount(response.amount)
                setTotalPages(response.totalPages)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchReportsHistory = async () => {
        try {
            const response = await resultFetchReports(id, firstDate, secondDate, currentPage)
            if (response && response.message) {
                setItems(response.data)
                setProducts(response.products)
                setAmount(response.amount)
                setTotalPages(response.totalPages)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleReportsAllHistory = () => {
        document.getElementById('date1').value = ''
        document.getElementById('date2').value = ''
        fetchReportsAllHistory()
    }

    const handleReportsHistory = () => {
        fetchReportsHistory()
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        document.title ='Minimart | Reports'
        fetchData()
    }, [fetchData])

    useEffect(() => {
        fetchReportsAllHistory()
    }, [id, currentPage])

    return (
        <>
            <ReportStats 
                amount={amount}
                products={products} />

            <div className="flex justify-between items-center flex-wrap max-lg:justify-center gap-6 px-3 pt-14 pb-5">
                <div className="flex justify-start items-center flex-wrap gap-5">
                    <Link to={'history'}>
                        <button className='rounded-md border-2 border-cyan-500  px-7 py-2 hover:bg-cyan-500 ' onClick={ handleReportsHistory }>View History</button>
                    </Link>
                    <button className='rounded-md border-2 border-cyan-500  px-7 py-2 hover:bg-cyan-500 ' onClick={ handleReportsAllHistory }>Clear</button>
                </div>
                <div className="flex items-center flex-wrap max-lg:justify-center gap-5">
                    <div className="flex items-center gap-2">
                        <label htmlFor="date1">Start Date:</label>
                        <input type="date" className='rounded text-black text-center p-1' onChange={ e => setFirstDate( e.target.value )} name='date1' id='date1'/>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="date2">End Date:</label>
                        <input type="date" className='rounded text-black text-center p-1' onChange={ e => setSecondDate( e.target.value )} name='date2' id='date2'/>
                    </div>
                    <button className='rounded-md border-2 border-cyan-500  px-7 py-2 hover:bg-cyan-500 ' onClick={ handleReportsHistory }>Search</button>
                </div>
            </div>

            <ReportTable 
                items={items}
                handlePageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}/>
        </>
    )
}

export default Report