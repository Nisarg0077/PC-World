import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './components/Home';
import NotFound from './NotFound';
function App() {
  return (
   <>
    <BrowserRouter>
    <Routes>
        <Route>
          <Route path='/' Component={Home} />
          <Route path="*" Component={NotFound}/>
        </Route>
      </Routes>
    </BrowserRouter>
   </>
  );
}

export default App;
