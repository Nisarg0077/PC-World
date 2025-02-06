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
import AdminProfile from './components/AdminProfile';
import AddMotherboardProduct from './components/Products/AddMotherboardProduct';
import AddRAMProduct from './components/Products/AddRAMProduct';
import AddStorageProduct from './components/Products/AddStorageProduct';
import EditProductPage from './components/Products/EditProductPage';
import categoriesMgmt from './components/categories/categoriesMgmt';
import AddCategoryPage from './components/categories/AddCategoryPage';
import EditCategoryPage from './components/categories/EditCategoryPage';
import AddPSUProduct from './components/Products/AddPSUProduct';
import BrandsManagement from './components/Brands/BrandsManagement';
import AddBrandForm from './components/Brands/AddBrandForm';
import EditBrandPage from './components/Brands/EditBrandPage';

function App() {
  return (
    <>
    <BrowserRouter>

      <Routes>
       
      <Route path='/' Component={Dashboard} />
      <Route path='/login' Component={Login} />
      <Route path='/logout' Component={Logout} />
      <Route path='/register' Component={Register} />
      <Route path='/adminProfile' Component={AdminProfile} />
      <Route path='/products' Component={Products} />
      <Route path='/add-cpu' Component={AddCPUProduct} />
      <Route path='/add-gpu' Component={AddGPUProduct} />
      <Route path='/add-motherboard' Component={AddMotherboardProduct} />
      <Route path='/add-ram' Component={AddRAMProduct} />
      <Route path='/add-storage' Component={AddStorageProduct} />
      <Route path='/add-psu' Component={AddPSUProduct} />
      <Route path='/product-info' Component={ProductInfo} />
      <Route path='/edit-product' Component={EditProductPage} />
      <Route path='/categories' Component={categoriesMgmt} />
      <Route path='/add-category' Component={AddCategoryPage} />
      <Route path='/edit-category' Component={EditCategoryPage} />
      <Route path='/brands' Component={BrandsManagement} />
      <Route path='/add-brands' Component={AddBrandForm} />
      <Route path='/edit-brand' Component={EditBrandPage} />
      <Route path="*" Component={NotFound}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
