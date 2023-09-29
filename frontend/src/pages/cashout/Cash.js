import React from 'react'
import CashHeader from '../../components/cash/CashHeader'
import CashBody from '../../components/cash/CashBody'
import CashHistory from '../../components/cash/CashHistory'

function Cash() {
    return (
        <>
            <CashHeader />
            <CashBody />
            <CashHistory />
        </>
    )
}

export default Cash