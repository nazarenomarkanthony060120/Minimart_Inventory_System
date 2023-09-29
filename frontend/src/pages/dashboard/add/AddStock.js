import React, { useEffect, useState } from 'react'
import DashboardHeader from '../../../components/dashboard/DashboardHeader'
import { accountInfo } from '../DashboardCodes';
import Add from '../../../components/dashboard/add/Add';

function AddStock() {


    const fetchData = async () => {
        const response = await accountInfo();
        if (response && response.message === "Success"){
            setName(response.firstName + ' ' + response.lastName)
        }
    }

    const [ name, setName ] = useState('')

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <>
            <DashboardHeader 
                propName={name} 
                propAdd={true}/>

            <Add />
        </>
    )
}

export default AddStock