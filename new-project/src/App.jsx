// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthContext';
import ProtectedRoute from './Auth/ProtectedRoute';

import Login from './Auth/Login';
import Container from './Component/Container';
import EmployeeList from './Pages/EmployeeList';
import AddEmployee from './Pages/AddEmployee';
import ProductService from './Pages/ProductService';

import SupportTicket from './Pages/Ticket/SupportTicket';
import CreateTicket from './Pages/Ticket/CreateTicket';
import TicketDetails from './Pages/Ticket/TicketDetails';
import AssignTicket from './Pages/Ticket/AssignTicket';
import AttendanceDashboard from './Pages/Attendance/AttendanceDashboard';
import DailyReport from './Pages/Attendance/DailyReport';
import MonthlySheet from './Pages/Attendance/MonthlySheet';
import Report from './Pages/Attendance/Report';

import MarkAttend from './Pages/Attendance/MarkAttend';
import ApplyLeave from './Pages/LeaveManagement/ApplyLeave';
import WFTlist from './Pages/Attendance/WFTlist';
import AttendanceEntry from './Pages/Attendance/AttendanceEntry';
import Calender from './Pages/Attendance/Calender';
import LeaveList from './Pages/LeaveManagement/LeaveList';
import CustomersList from './Pages/Customerss/CustomersList';
import VendorList from './Pages/Vendor/VendorList';
import AddInvoice from './Pages/Invoice/AddInvoice';
import Invoice from './Pages/Invoice/Invoice';
import Customers from './Pages/Customerss/Customers';
import Venders from './Pages/Vendor/Venders';
import LeadForm from './Pages/Lead/LeadForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route (Login) */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Container />
              </ProtectedRoute>
            }
          >
            <Route path="/customers" element={<Customers />} />
            <Route path="/customerslist" element={<CustomersList />} />
            <Route path="/employee" element={<EmployeeList />} />
            <Route path="/vender" element={<Venders />} />
            <Route path="/vendorlist" element={<VendorList />} />
            <Route path="/addemployee" element={<AddEmployee />} />
            <Route path="/sale/product-service" element={<ProductService />} />
            <Route path="/sale/invoice" element={<Invoice />} />
            <Route path="/sale/invoice/addInvoice" element={<AddInvoice />} />
            <Route path="/ticket/ticket-list" element={<SupportTicket />} />
            <Route path="/ticket/ticket-list/create-ticket" element={<CreateTicket />} />
            <Route path="/ticket/ticket-details" element={<TicketDetails />} />
            <Route path="/ticket/assign-ticket" element={<AssignTicket />} />
            <Route path="/ticket/ticket-details/:ticketId" element={<TicketDetails />} />
            <Route path="/attendance/dashboard" element={<AttendanceDashboard />} />
            <Route path="/attendance/daily-report" element={<DailyReport />} />
            <Route path="/attendance/monthly-report" element={<MonthlySheet />} />
            <Route path="/attendance/report" element={<Report />} />
            <Route path="/mark-attendance/my-report" element={<Calender />} />
            <Route path="/attendance/markAttendance" element={<MarkAttend />} />
            <Route path="/leave-management/apply-leave" element={<ApplyLeave />} />
            <Route path="/leave-management/leavelist" element={<LeaveList />} />
            <Route path="/attendance/wfh-report" element={<WFTlist />} />
            <Route path="/attendance/attendance-entry" element={<AttendanceEntry />} />
            <Route path="/leadform" element={<LeadForm />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
