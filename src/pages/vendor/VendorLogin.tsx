import Login from '@/components/auth/Login'
import Footer from '@/components/common/Footer'
import Header from '@/components/headers/Header'
import { useLoginMutation } from '@/hooks/auth/useLogin'
import { vendorLogin } from '@/store/slices/vendorSlice'
import { ILogin } from '@/types/User'
import { handleError } from '@/utils/Error/errorHandler'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'



const VendorLogin = () => {
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

        dispatch(vendorLogin(data.user))
      },
      onError : (error)=> {
        handleError(error)
        setIsSending(false)
      }
    })
  }

  return (
   <>
    <div>
      <Header />
      <div className='mt-20'>
      <Login userType='vendor' onSubmit={handleLogin} isSending={isSending} />
      </div>
    </div>
    <Footer/>
   </>
  )
}

export default VendorLogin