import React, { useEffect, useState } from 'react'
import DashboardHeader from '../../../components/dashboard/DashboardHeader'
import { accountInfo } from '../DashboardCodes'
import Update from '../../../components/dashboard/update/Update';


function UpdateStock() {

    const [ name, setName ] = useState('');

    const fetchData = async () => {
        try {
            const response = await accountInfo();
            if (response && response.message === "Success"){
                setName(response.firstName + ' ' + response.lastName)
            } 
        } catch (error) {
            console.error(error);
        }
    };

    useEffect( () => {
        document.title = 'Minimart | Add Stock'
        
        fetchData()
    }, [fetchData])

    return (
        <>
            <DashboardHeader 
                propName={name} 
                propsUpdate={true}/>

            <Update />
        </>
    )
}

export default UpdateStock;
