import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import NotFound from './view/NotFound';
import Home from './view/Home';
import ShopNow from './view/ShopNow';
import {ViewProduct} from './view/ViewProduct';
import { Login } from './view/Login';
import Register from './view/Register';
import ClinetProfile from './view/ClientProfile';
import Cart from './view/Cart';
import Navbar from './view/Navbar';
import { CartProvider } from './components/CartContext';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import EditProfile from './view/EditProfile';
import Checkout from './view/Checkout';
import UserOrders from './view/UserOrders';
import ChooseBrand from './view/ChooseBrand';
import CustomBuild from './view/CustomBuild';
function App() {
  return (
    <CartProvider>

    <BrowserRouter>
      <Layout />
    </BrowserRouter>
    </CartProvider>
  );
}

function Layout() {
  const location = useLocation();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ['/login', '/register'];

  return (
    <>
      {/* Show Navbar only if NOT on login or register page */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/login' Component={Login} />
        <Route path='/register' Component={Register} /> 
        <Route path='/userProfile' Component={ClinetProfile}/>
        <Route path='/shopnow' Component={ShopNow}/>
        <Route path='/viewProduct' Component={ViewProduct}/>
        <Route path='/cart' Component={Cart}/>
        <Route path='/aboutus' Component={AboutUs}/>
        <Route path='/contactus' Component={ContactUs}/>
        <Route path='/editprofile' Component={EditProfile}/>
        <Route path='/checkout' Component={Checkout}/>
        <Route path='/orders' Component={UserOrders}/>
        <Route path='/custompc' Component={ChooseBrand} />
        <Route path='/custom-build/:brand' Component={CustomBuild} />
        <Route path="*" Component={NotFound}/>
      </Routes>
    </>
  );
}

export default App;
