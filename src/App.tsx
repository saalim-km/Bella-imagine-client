import { Routes, Route } from "react-router-dom";
import VendorRoute from "./routes/VendorRoute";
import AdminRoute from "./routes/AdminRoute";
import ClientRoute from "./routes/UserRoute";
import { Toaster } from "sonner";


const App = () => {
  return (
    <>
        <Toaster position="bottom-right" closeButton expand={false} richColors/>
        <Routes>
          <Route path="/*" element={<ClientRoute />} />
          <Route path="/vendor/*" element={<VendorRoute />} />
          <Route path="/admin/*" element={<AdminRoute />} />
        </Routes>
    </>
  );
};

export default App;
