import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Auth/Login';
import Dashboard from './Dashboard';
import Customers from './Pages/Customers';
import Container from './Component/Container';
import EmployeeList from './Pages/EmployeeList';
import Vender from './Pages/Vender';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route without sidebar */}
        <Route path="/" element={<Login />} />

        {/* Protected routes with sidebar layout */}
        <Route  element={<Container />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/employee" element={<EmployeeList />} />
          <Route path="/vender" element={<Vender />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
