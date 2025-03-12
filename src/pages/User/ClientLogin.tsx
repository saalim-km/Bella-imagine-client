import Footer from '@/components/common/Footer'
import Header from '@/components/headers/Header'
import Login from '@/components/auth/Login'
import { useLoginMutation } from '@/hooks/auth/useLogin'
import { ILogin } from '@/types/User'
import { toast } from 'sonner'
import { handleError } from '@/utils/Error/errorHandler'
import { useDispatch } from 'react-redux'
import { clientLogin } from '@/store/slices/clientSlice'
import { useState } from 'react'


const ClientLogin = () => {
  const dispatch = useDispatch()
  const {mutate : login} = useLoginMutation()
  const [isSending , setIsSending] = useState(false)

  function handleLogin(user : ILogin) {
    setIsSending(true)
    login(user , {
      onSuccess : (data : any)=> {
        setIsSending(false)
        console.log(data);
        toast.success(data.message)
        dispatch(clientLogin(data.user))
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
    <div className='p-10'>
        <Login userType = "client" onSubmit = {handleLogin} isSending = {isSending}/>
    </div>
    <Footer/>
    </>
  )
}

export default ClientLogin