import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import VendorRoute from "./routes/VendorRoute";
import AdminRoute from "./routes/AdminRoute";
import ClientRoute from "./routes/UserRoute";
import { Toaster } from "sonner";
import { Custom404 } from "./components/404/Custom404";
import { SocketProvider } from "./context/SocketContext";


function AppLayout() {
  return (
    <SocketProvider>
      <App/>
    </SocketProvider>
  )
}


function App () {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      document.body.removeAttribute("data-scroll-locked");
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] });

    return () => observer.disconnect();
  }, []);
  return (
    <>
        <Toaster position="bottom-right" closeButton={false} expand={false} richColors/>
        <Routes>
          <Route path="/*" element={<ClientRoute />} />
          <Route path="/vendor/*" element={<VendorRoute />} />
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="*" element = {<Custom404 pathname={window.location.pathname}/>}/>
        </Routes>
    </>
  );
};

export default AppLayout;
