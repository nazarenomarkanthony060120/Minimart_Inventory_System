import React, { useCallback, useEffect, useState } from 'react'
import DashboardHeader from '../../../components/dashboard/DashboardHeader'
import { accountInfo } from '../DashboardCodes';
import Delete from '../../../components/dashboard/delete/Delete';


function DeleteStock() {

    const [ name, setName ] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const name = await accountInfo();
            setName(name.firstName + ' ' + name.lastName);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
        <DashboardHeader 
            propName={name} 
            propDelete={true}/>

        <Delete />
        </>
    )
}

export default DeleteStock