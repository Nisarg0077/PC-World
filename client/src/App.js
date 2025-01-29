// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './view/NotFound';
import Home from './view/Home';
import ShopNow from './view/ShopNow';


function App() {
  return (
    <>
    
    <BrowserRouter>
      <Routes>
      <Route path='/' Component={Home} />
      {/* <Route path='/login' Component={Login} />
      <Route path='/logout' Component={Logout} />
      <Route path='/register' Component={Register} /> */}
      <Route path="/shopnow" Component={ShopNow}/>
      <Route path="*" Component={NotFound}/>
      </Routes>
    </BrowserRouter>
    </>
    
  );
}

export default App;