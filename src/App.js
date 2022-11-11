import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router,Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import { Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useSelector } from 'react-redux';
import NewProduct from './pages/NewProduct';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from "./pages/CartPage";
import ScrollToTop from './components/ScrollToTop';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import EditProductPage from "./pages/EditProductPage";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { addNotification } from "./features/userSlice";
import { useDispatch } from 'react-redux';

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
      const socket = io("ws://localhost:8080");
      socket.off("notification").on("notification", (msgObj, user_id) => {
          // logic for notification
          if (user_id === user._id) {
              dispatch(addNotification(msgObj));
          }
      });

      socket.off("new-order").on("new-order", (msgObj) => {
          if (user.isAdmin) {
              dispatch(addNotification(msgObj));
          }
      });
  }, []);
  return (
    <div className="App">
      <Router>
        <ScrollToTop/>
      <Navigation/>
      <Routes>
        <Route index element={<Home/>}></Route>

        {!user && (
                        <>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                        </>
                    )}

{user && (
                        <>
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            
                            
                        </>
                    )}
                     {user && user.isAdmin && (
                        <>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/product/:id/edit" element={<EditProductPage />} />
                        </>
                    )}

        <Route path='*' element={<Home/>}></Route>
        <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/category/:category" element={<CategoryPage />} />

        <Route path="/new-product" element={<NewProduct />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
