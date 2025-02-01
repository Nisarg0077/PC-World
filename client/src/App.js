// import logo from './logo.svg';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './view/NotFound';
import Home from './view/Home';
import ShopNow from './view/ShopNow';
import { ViewProudct } from './view/ViewProudct';
import { Login } from './view/Login';


function App() {
  return (
    <>
    
    <BrowserRouter>
      <Routes>
      <Route path='/' Component={Home} />
       <Route path='/login' Component={Login} />
      {/*<Route path='/logout' Component={Logout} />
      <Route path='/register' Component={Register} /> */}
      <Route path="/shopnow" Component={ShopNow}/>
      <Route path='/viewProduct' Component={ViewProudct}/>
      <Route path="*" Component={NotFound}/>
      </Routes>
    </BrowserRouter>
    </>
    
  );
}

export default App;