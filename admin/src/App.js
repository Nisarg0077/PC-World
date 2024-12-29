
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import AdminDesh from './components/AdminDesh';
import NotFound from './NotFound';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route>
          <Route path='/' Component={AdminDesh} />
          <Route path="*" Component={NotFound}/>
        </Route>
      </Routes>
    </BrowserRouter>
   </>
  );
}

export default App;
