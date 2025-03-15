import { ForgotPassword } from '@/components/auth/ForgotPassword'
import Footer from '@/components/common/Footer'
import Header from '@/components/headers/Header'
import { TRole } from '@/types/User'
import React from 'react'

const ForgotPassPage = ({userType} : {userType : TRole}) => {
    console.log(`usertype =>  ${userType}`);
  return (
    <>
        <Header/>
        <ForgotPassword userType={userType}/>
    </>
  )
}

export default ForgotPassPage