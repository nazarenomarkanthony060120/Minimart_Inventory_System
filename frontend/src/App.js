import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/login/Login';
import ForgotPassword from './pages/forgotpassword/ForgotPassword';
import ForgotPasswordSuccess from './components/forgotpassword/forgotpasswordsuccess/ForgotPasswordSuccess';
import ResetPassword from './components/forgotpassword/resetpassword/ResetPassword';
import ResetPasswordSuccessfull from './components/forgotpassword/resetpassword/ResetPasswordSuccessfull';
import Register from './pages/register/Register';
import LandingPage from './pages/landingpage/LandingPage';
import Homepage from './pages/homepage/Homepage';
import Dashboard from './pages/dashboard/Dashboard'
import Stock from './pages/stocks/Stock';
import UpdateStock from './pages/dashboard/update/UpdateStock';
import DeleteStock from './pages/dashboard/delete/DeleteStock';
import AddStock from './pages/dashboard/add/AddStock';
import Cash from './pages/cashout/Cash';
import CashIn from './pages/cashout/cashin/CashIn';
import CashOut from './pages/cashout/cashout/CashOut';
import Report from './pages/report/Report';
import History from './pages/report/history/History';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <LandingPage />}></Route>
        <Route path='/login' element={ <Login />}></Route>
        <Route path='/forgotpassword' element={ <ForgotPassword /> }></Route>
        <Route path='/forgotpasswordsuccess' element={ <ForgotPasswordSuccess /> }></Route>
        <Route path='/resetpassword/:accountId/:token' element={ <ResetPassword /> }></Route>
        <Route path='/resetpasswordsuccessfull' element={ <ResetPasswordSuccessfull /> }></Route>
        <Route path='/register' element={ <Register />}></Route>
        <Route path='/homepage' element={ <Homepage />}>
          <Route index element={ <Dashboard />}></Route>
          <Route path='addStock' element= { <AddStock />}></Route>
          <Route path='updatestock/:accountId/:id' element={ <UpdateStock />}></Route>
          <Route path='deletestock/:accountId/:id' element={ <DeleteStock />}></Route>
          <Route path='stocks' element={ <Stock />}></Route>
          <Route path='cash' element={ <Cash />}></Route>
          <Route path='cash/cashIn' element={ <CashIn />}></Route>
          <Route path='cash/cashOut' element={ <CashOut />}></Route>
          <Route path='report' element={ <Report /> }></Route>
          <Route path='report/history' element={ <History />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
