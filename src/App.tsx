import { Routes , Route } from "react-router"
import ClientLandingPage from "./pages/client/ClientLandingPage"
import ClientSignup from "./pages/client/ClientSignup"
import ClientLogin from "./pages/client/ClientLogin"

const App = () => {
  return (
    <Routes>
      <Route path='/' element = {<ClientLandingPage/>}/>
      <Route path="register" element = {<ClientSignup/>}/>
      <Route path="login" element = {<ClientLogin/>}/>
    </Routes>
  )
}

export default App