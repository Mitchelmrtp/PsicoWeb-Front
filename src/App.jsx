import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthStoreProvider } from "./store/authStore.jsx";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthStoreProvider>
      <Router>
        <AppRoutes />
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthStoreProvider>
  );
}

export default App;
