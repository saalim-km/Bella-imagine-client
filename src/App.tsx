import { Routes , Route } from "react-router"
import VendorRoute from "./routes/VendorRoute"
import AdminRoute from "./routes/AdminRoute"
import ClientRoute from "./routes/ClientRoute"
import { Toaster } from "sonner"

const App = () => {
  return (
    <>
     <Toaster position="top-right" />
    <Routes>
      <Route path='/*' element = {<ClientRoute/>}/>
      <Route path="/vendor/*" element = {<VendorRoute/>}/>
      <Route path="/admin/*" element = {<AdminRoute/>}/>
    </Routes>
    </>
  )
}

export default App