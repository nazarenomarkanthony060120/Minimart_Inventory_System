import React, { useEffect } from 'react'
import ForgotPasswordSuccess from '../../components/forgotpassword/forgotpasswordsuccess/ForgotPasswordSuccess'
import ForgotPasswordForm from '../../components/forgotpassword/ForgotPasswordForm'

function ForgotPassword() {

    useEffect(() => {
        document.title = 'Minimart | Forgot Password'
    }, [])
    
    return (
        <>
            <ForgotPasswordForm />
        </>
    )
}

export default ForgotPassword