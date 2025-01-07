import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import NotFound from './components/NotFound';

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
      <Route path='/' Component={Dashboard} />
      <Route path='/login' Component={Login} />
      <Route path='/register' Component={Register} />
      <Route path="*" Component={NotFound}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
