import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import NotFound from './view/NotFound';
import Home from './view/Home';
import ShopNow from './view/ShopNow';
import { ViewProudct } from './view/ViewProudct';
import { Login } from './view/Login';
import Register from './view/Register';
import ClinetProfile from './view/ClientProfile';
import Cart from './view/Cart';
import Navbar from './view/Navbar';
import { CartProvider } from './components/CartContext';
import Category from './view/Category';

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
        <Route path='/viewProduct' Component={ViewProudct}/>
        <Route path='/cart' Component={Cart}/>
        <Route path='/category' Component={Category}/>
        <Route path="*" Component={NotFound}/>
      </Routes>
    </>
  );
}

export default App;
