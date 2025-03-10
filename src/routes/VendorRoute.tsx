import VendorLogin from '@/pages/vendor/VendorLogin'
import VendorSignup from '@/pages/vendor/VendorSignup'
import { NoClientAuthRoute } from '@/protected/PublicRoute'
import { Route, Routes } from 'react-router-dom'

const VendorRoute = () => {
  return (
    <Routes>
      <Route path='/login' element = {<NoClientAuthRoute element={<VendorLogin/>}/>} />
      <Route path='/signup' element = {<NoClientAuthRoute element={<VendorSignup/>}/>} />
    </Routes>
  )
}

export default VendorRoute