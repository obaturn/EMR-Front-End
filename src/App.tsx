
import './App.css'
import { BrowserRouter as Router,  Route , Routes } from 'react-router-dom';
import Start from './Component/Start';
import CreateAccount from './Component/CreateAccount';
import Login from './Component/Login';
import ForgotPassword from './Component/ForgotPassoword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Add more routes as needed */}
        
      </Routes>
    </Router>
  );
}




export default App
