// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import Login from './Auth/Login';
// import Container from './Component/Container';
// import LeadForm from './Pages/Lead/LeadForm';
// import EmployeeList from './Pages/EmployeeList';
// import AddEmployee from './Pages/AddEmployee';
// import ProductService from './Pages/ProductService';

// import SupportTicket from './Pages/Ticket/SupportTicket';
// import CreateTicket from './Pages/Ticket/CreateTicket';
// import TicketDetails from './Pages/Ticket/TicketDetails';
// import AssignTicket from './Pages/Ticket/AssignTicket';

// import AttendanceDashboard from './Pages/Attendance/AttendanceDashboard';
// import DailyReport from './Pages/Attendance/DailyReport';
// import MonthlySheet from './Pages/Attendance/MonthlySheet';
// import Report from './Pages/Attendance/Report';
// import MarkAttend from './Pages/Attendance/MarkAttend';
// import ApplyLeave from './Pages/LeaveManagement/ApplyLeave';
// import WFTlist from './Pages/Attendance/WFTlist';
// import AttendanceEntry from './Pages/Attendance/AttendanceEntry';
// import Calender from './Pages/Attendance/Calender';
// import LeaveList from './Pages/LeaveManagement/LeaveList';

// import CustomersList from './Pages/Customerss/CustomersList';
// import VendorList from './Pages/Vendor/VendorList';
// import AddInvoice from './Pages/Invoice/AddInvoice';
// import Invoice from './Pages/Invoice/Invoice';
// import Customers from './Pages/Customerss/Customers';
// import Venders from './Pages/Vendor/Venders';

// import AddLead from './Pages/Lead/AddLead';
// import PurchaseOrder from './Pages/PurchaseAnd Expenses/PurchaseOrder';
// import PurchaseTable from './Pages/PurchaseAnd Expenses/PurchaseTable';
// import AllInvoices from './Pages/PurchaseAnd Expenses/AllInvoices';
// import SalaryStrucuture from './Pages/PayRoll/SalaryStrucuture';
// import MonthlySalary from './Pages/PayRoll/MonthlySalary';
// import GenerateSalary from './Pages/PayRoll/GenerateSalary';
// import SalaryReport from './Pages/PayRoll/SalaryReport';
// import Expenses from './Pages/PurchaseAnd Expenses/Expenses';
// import AllInvoiceTable from './Pages/PurchaseAnd Expenses/AllInvoiceTable';
// import UserList from './Pages/User/UserList';
// import AddUser from './Pages/User/AddUser';
// import Departments from './Pages/MasterFiels/Departments';
// import Categories from './Pages/MasterFiels/Categories';
// import AddDepartment from './Pages/MasterFiels/AddDepartment';
// import AddCategories from './Pages/MasterFiels/AddCategories';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public route without sidebar */}
//         <Route path="/" element={<Login />} />

//         {/* Protected routes with sidebar layout */}
//         <Route  element={<Container />}>
//           {/* <Route path="/dashboard" element={<Dashboard />} /> */}
//           <Route path="/leadform" element={<LeadForm />} />
//               <Route path="/leadform/addlead" element={<AddLead />} />

//               <Route path="/customersList/customers" element={<Customers />} />
//               <Route path="/customerslist" element={<CustomersList />} />

//               <Route path="/userList" element={<UserList />} />
//               <Route path="/adduser" element={<AddUser />} />

//               <Route path="/employee" element={<EmployeeList />} />
//               <Route path="/employee/addemployee" element={<AddEmployee />} />

//               <Route path="/vendorlist/vender" element={<Venders />} />
//               <Route path="/vendorlist" element={<VendorList />} />

//               <Route path="/sale/product-service" element={<ProductService />} />




// {/* Master Fiels */}
// <Route path="/department" element={<Departments />} />
// <Route path="/adddepartment" element={<AddDepartment />} />
// <Route path="/categories" element={<Categories />} />
// <Route path="/addcategories" element={<AddCategories />} />






//               <Route path="/sale/invoice" element={<Invoice />} />
//               <Route path="/sale/invoice/addInvoice" element={<AddInvoice />} />


//               <Route path="/ticket/ticket-list" element={<SupportTicket />} />
//               <Route path="/ticket/ticket-list/create-ticket" element={<CreateTicket />} />

//               <Route path="/ticket/ticket-details" element={<TicketDetails />} />
//               <Route path="/ticket/assign-ticket" element={<AssignTicket />} />
//               <Route path="/ticket/ticket-details/:ticketId" element={<TicketDetails />} />


//               <Route path="/attendance/dashboard" element={<AttendanceDashboard />} />
//               <Route path="/attendance/daily-report" element={<DailyReport />} />
//               <Route path="/attendance/monthly-report" element={<MonthlySheet />} />
//               <Route path="/attendance/report" element={<Report />} />
//               <Route path="/mark-attendance/my-report" element={<Calender />} />
//               <Route path="/attendance/markAttendance" element={<MarkAttend />} />
//               <Route path="/leave-management/apply-leave" element={<ApplyLeave />} />
//               <Route path="/leave-management/leavelist" element={<LeaveList />} />
//               <Route path="/attendance/wfh-report" element={<WFTlist />} />
//               <Route path="/attendance/attendance-entry" element={<AttendanceEntry />} />


//               <Route path="/purchase/purchase-order" element={<PurchaseOrder />} />
//               <Route path="/purchase/purchasetable" element={<PurchaseTable />} />
//               <Route path="/purchase/invoices/all" element={<AllInvoices />} />
//               <Route path="/purchase/invoices/allinvoictable" element={<AllInvoiceTable />} />
//               <Route path="/purchase/expenses" element={<Expenses />} />


//               <Route path="/payroll/salary-structure" element={<SalaryStrucuture />} />
//               <Route path="/payroll/monthly-salary" element={<MonthlySalary />} />
//               <Route path="/payroll/generate-salary" element={<GenerateSalary />} />
//               <Route path="/payroll/reports" element={<SalaryReport />} />

//         </Route>  
//       </Routes>
//     </Router>
//   );
// }

// export default App;




import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Auth/Login';
import Container from './Component/Container';
import LeadForm from './Pages/Lead/LeadForm';
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

import { AuthProvider } from './Auth/AuthContext';
import PrivateRoute from './Auth/PrivateRoute';
import AddLead from './Pages/Lead/AddLead';
import PurchaseOrder from './Pages/PurchaseAnd Expenses/PurchaseOrder';
import PurchaseTable from './Pages/PurchaseAnd Expenses/PurchaseTable';
import AllInvoices from './Pages/PurchaseAnd Expenses/AllInvoices';
import SalaryStrucuture from './Pages/PayRoll/SalaryStrucuture';
import MonthlySalary from './Pages/PayRoll/MonthlySalary';
import GenerateSalary from './Pages/PayRoll/GenerateSalary';
import SalaryReport from './Pages/PayRoll/SalaryReport';
import Expenses from './Pages/PurchaseAnd Expenses/Expenses';
import AllInvoiceTable from './Pages/PurchaseAnd Expenses/AllInvoiceTable';
import UserList from './Pages/User/UserList';
import AddUser from './Pages/User/AddUser';
import FollowupForm from './Pages/CRM Follow-Up/FollowupForm';
import AddFollowUp from './Pages/CRM Follow-Up/AddFollowUp';
import ReportAnaly from './Pages/Report&Analytics/ReportAnaly';
// import CustomerDetail from './Pages/Customerss/CustomerDetail';
import AddExpenses from './Pages/PurchaseAnd Expenses/AddExpenses';
import AddProduct from './Pages/AddProduct';
import Departments from './Pages/MasterFiels/Departments';
import Categories from './Pages/MasterFiels/Categories';
import AddDepartment from './Pages/MasterFiels/AddDepartment';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

//           {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
             <Route element={<Container />}>


               <Route path="/leadform" element={<LeadForm />} />
               <Route path="/leadform/addlead" element={<AddLead />} />

              <Route path="/customersList/customers" element={<Customers />} />
              <Route path="/customerslist" element={<CustomersList />} />
              
//               {/* <Route path="/customers" element={<CustomerDetail />} /> */}
               <Route path="/userList" element={<UserList />} />
              <Route path="/adduser" element={<AddUser />} />

               <Route path="/employee" element={<EmployeeList />} />
              <Route path="/employee/addemployee" element={<AddEmployee />} />

               <Route path="/vendorlist/vender" element={<Venders />} />
               <Route path="/vendorlist" element={<VendorList />} />

               <Route path="/sale/product-service" element={<ProductService />} />
               <Route path="/sale/addproduct" element={<AddProduct />} />


<Route path="/department" element={<Departments />} />
  <Route path="/adddepartment" element={<AddDepartment />} />
<Route path="/categories" element={<Categories />} />

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


               <Route path="/purchase/purchase-order" element={<PurchaseOrder />} />
               <Route path="/purchase/purchasetable" element={<PurchaseTable />} />
               <Route path="/purchase/invoices/all" element={<AllInvoices />} />
               <Route path="/purchase/invoices/allinvoictable" element={<AllInvoiceTable />} />
               <Route path="/purchase/expenses" element={<Expenses />} />

               <Route path="/purchase/addexpenses" element={<AddExpenses />} />
               <Route path="/payroll/salary-structure" element={<SalaryStrucuture />} />
               <Route path="/payroll/monthly-salary" element={<MonthlySalary />} />
               <Route path="/payroll/generate-salary" element={<GenerateSalary />} />
               <Route path="/payroll/reports" element={<SalaryReport />} />
             

               <Route path="/followupform" element={<FollowupForm />} />
               <Route path="/addfollowupform" element={<AddFollowUp />} />

               <Route path="/reportAnalytics" element={<ReportAnaly />} />
             </Route>
           </Route>
         </Routes>
       </Router>
     </AuthProvider>
   );
 }

 export default App;
