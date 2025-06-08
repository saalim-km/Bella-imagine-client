import Login from '@/components/auth/Login'
import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import { useLoginMutation } from '@/hooks/auth/useLogin'
import { adminLogin } from '@/store/slices/adminSlice'
import { ILogin } from '@/types/interfaces/User'
import { handleError } from '@/utils/Error/error-handler.utils'
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
            dispatch(adminLogin(data.data))
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
        <div className='mt-20'> 
          <Login userType='admin' isSending = {isSending} onSubmit={handleLogin}/>
        </div>
        <Footer/>
    </>
  )
}

export default AdminLogin