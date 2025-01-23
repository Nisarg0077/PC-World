import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import NotFound from './components/NotFound';
// import Navbar from './components/Navbar';
import Logout from './components/Logout';
import Products from './components/Products/Products';
import AddCPUProduct from './components/Products/AddCPUProduct';
import AddGPUProduct from './components/Products/AddGPUProduct';
import ProductInfo from './components/Products/ProductInfo';

function App() {
  return (
    <>
    <BrowserRouter>

      <Routes>
       
      <Route path='/' Component={Dashboard} />
      <Route path='/login' Component={Login} />
      <Route path='/logout' Component={Logout} />
      <Route path='/register' Component={Register} />
      <Route path='/products' Component={Products} />
      <Route path='/add-cpu' Component={AddCPUProduct} />
      <Route path='/add-gpu' Component={AddGPUProduct} />
      <Route path='/add-ram' Component={AddCPUProduct} />
      <Route path='/add-storage' Component={AddCPUProduct} />
      <Route path='/product-info' Component={ProductInfo} />
      <Route path="*" Component={NotFound}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
