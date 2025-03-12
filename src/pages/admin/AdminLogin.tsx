import Login from '@/components/auth/Login'
import Footer from '@/components/common/Footer'
import Header from '@/components/headers/Header'
import { useLoginMutation } from '@/hooks/auth/useLogin'
import { adminLogin } from '@/store/slices/adminSlice'
import { ILogin } from '@/types/User'
import { handleError } from '@/utils/Error/errorHandler'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const AdminLogin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {mutate : login} = useLoginMutation()
    const [isSending , setIsSending] = useState(false)

    function handleLogin(user : ILogin) {
        setIsSending(true)
        login(user , {
          onSuccess : (data : any)=> {
            setIsSending(false)
            console.log(data);
            toast.success(data.message)
            dispatch(adminLogin(data.user))
            navigate('/admin/dashboard')
          },
          onError : (error)=> {
            handleError(error)
            setIsSending(false)
          }
        })
      }
  return (
    <>
        <Header/>
        <Login userType='admin' isSending = {isSending} onSubmit={handleLogin}/>
        <Footer/>
    </>
  )
}

export default AdminLogin