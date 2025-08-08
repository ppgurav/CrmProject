// import React, { useState, useMemo } from "react";
// import { z } from "zod";

// const reportFilterSchema = z.object({
//   monthYear: z.string().min(1, "Select Month & Year"),
//   employeeType: z.enum(["All", "Payroll", "Intern", "Temporary"]),
//   paymentStatus: z.enum(["All", "Paid", "Unpaid", "Partial"]),
// });

// const SAMPLE_REPORT = [
//   {
//     name: "Ravi Sharma",
//     code: "EMP001",
//     month: "Aug 2025",
//     gross: 29500,
//     deductions: 3360,
//     net: 26140,
//     paymentStatus: "Paid",
//     paymentDate: "01-09-2025",
//     paymentMode: "Bank",
//     txnRef: "TXN123456",
//     breakdown: {
//       earnings: { Basic: 18000, HRA: 9000, Incentive: 2000, Overtime: 500 },
//       deductions: { PF: 2160, PT: 200, TDS: 0, Loan: 1000 },
//       attendance: { Present: 24, PaidLeave: 1, LOP: 1, OvertimeHrs: 4 },
//     },
//   },
//   {
//     name: "Anjali Verma",
//     code: "EMP002",
//     month: "Aug 2025",
//     gross: 27000,
//     deductions: 2200,
//     net: 24800,
//     paymentStatus: "Unpaid",
//     paymentDate: "",
//     paymentMode: "",
//     txnRef: "",
//     breakdown: {
//       earnings: { Basic: 18000, HRA: 9000, Incentive: 0, Overtime: 0 },
//       deductions: { PF: 2160, PT: 40, TDS: 0, Loan: 0 },
//       attendance: { Present: 25, PaidLeave: 0, LOP: 1, OvertimeHrs: 0 },
//     },
//   },
//   {
//     name: "Pooja Patil",
//     code: "EMP003",
//     month: "Aug 2025",
//     gross: 15000,
//     deductions: 0,
//     net: 15000,
//     paymentStatus: "Paid",
//     paymentDate: "31-08-2025",
//     paymentMode: "UPI",
//     txnRef: "UPI987654",
//     breakdown: {
//       earnings: { Basic: 15000, HRA: 0, Incentive: 0, Overtime: 0 },
//       deductions: { PF: 0, PT: 0, TDS: 0, Loan: 0 },
//       attendance: { Present: 26, PaidLeave: 0, LOP: 0, OvertimeHrs: 0 },
//     },
//   },
// ];

// export default function SalaryReport() {
//   const [filters, setFilters] = useState({
//     monthYear: "",
//     employeeType: "All",
//     department: "",
//     paymentStatus: "All",
//     search: "",
//     dateRange: { from: "", to: "" },
//     exportFormat: "PDF",
//   });
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [errors, setErrors] = useState(null);

//   const filteredData = useMemo(() => {
//     return SAMPLE_REPORT.filter((r) => {
//       if (filters.paymentStatus !== "All" && r.paymentStatus !== filters.paymentStatus) return false;
//       if (filters.search && !(r.name.toLowerCase().includes(filters.search.toLowerCase()) || r.code.toLowerCase().includes(filters.search.toLowerCase()))) return false;
//       return true;
//     });
//   }, [filters]);

//   const summary = useMemo(() => {
//     return {
//       totalEmployees: filteredData.length,
//       totalGross: filteredData.reduce((a, b) => a + b.gross, 0),
//       totalDeductions: filteredData.reduce((a, b) => a + b.deductions, 0),
//       totalNet: filteredData.reduce((a, b) => a + b.net, 0),
//       paidCount: filteredData.filter((e) => e.paymentStatus === "Paid").length,
//       unpaidCount: filteredData.filter((e) => e.paymentStatus === "Unpaid").length,
//     };
//   }, [filteredData]);

//   function validateFilters() {
//     try {
//       reportFilterSchema.parse({
//         monthYear: filters.monthYear,
//         employeeType: filters.employeeType,
//         paymentStatus: filters.paymentStatus,
//       });
//       setErrors(null);
//       return true;
//     } catch (e) {
//       setErrors(e.errors || e.message);
//       return false;
//     }
//   }

//   function exportReport() {
//     if (!validateFilters()) return;
//     alert(`Exporting as ${filters.exportFormat}... (demo)`);
//   }

//   function sendSlips(channel) {
//     alert(`Sending slips via ${channel}... (demo)`);
//   }

//   function bulkUpdateStatus() {
//     alert("Bulk update payment status (demo)");
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-4">Salary Reports</h1>

//       {/* Filters */}
//       <section className="bg-white rounded-xl shadow p-4 mb-4">
//         <h2 className="font-medium mb-3">Filters</h2>
//         <div className="grid md:grid-cols-4 gap-3">
//           <input type="month" value={filters.monthYear} onChange={(e) => setFilters({ ...filters, monthYear: e.target.value })} className="border rounded px-3 py-2" />
//           <select value={filters.employeeType} onChange={(e) => setFilters({ ...filters, employeeType: e.target.value })} className="border rounded px-3 py-2">
//             <option>All</option><option>Payroll</option><option>Intern</option><option>Temporary</option>
//           </select>
//           <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} className="border rounded px-3 py-2">
//             <option value="">-- Department --</option><option>Finance</option><option>HR</option><option>Engineering</option>
//           </select>
//           <select value={filters.paymentStatus} onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })} className="border rounded px-3 py-2">
//             <option>All</option><option>Paid</option><option>Unpaid</option><option>Partial</option>
//           </select>
//           <input type="text" placeholder="Employee Name / Code" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="border rounded px-3 py-2 md:col-span-2" />
//           <div className="flex gap-2">
//             <input type="date" value={filters.dateRange.from} onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, from: e.target.value } })} className="border rounded px-3 py-2 w-full" />
//             <input type="date" value={filters.dateRange.to} onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, to: e.target.value } })} className="border rounded px-3 py-2 w-full" />
//           </div>
//           <select value={filters.exportFormat} onChange={(e) => setFilters({ ...filters, exportFormat: e.target.value })} className="border rounded px-3 py-2">
//             <option>PDF</option><option>Excel</option><option>CSV</option>
//           </select>
//           <button onClick={exportReport} className="bg-blue-600 text-white px-4 py-2 rounded">Export 📤</button>
//         </div>
//         {errors && <div className="mt-2 text-red-600 text-sm">{JSON.stringify(errors)}</div>}
//       </section>

//       {/* Report Table */}
//       <section className="bg-white rounded-xl shadow p-4 mb-4 overflow-x-auto">
//         <h2 className="font-medium mb-3">Report Table</h2>
//         <table className="min-w-full table-auto">
//           <thead>
//             <tr className="border-b text-left">
//               <th className="p-2">Employee Name</th><th className="p-2">Code</th><th className="p-2">Month</th><th className="p-2">Gross</th><th className="p-2">Deductions</th><th className="p-2">Net</th><th className="p-2">Payment Status</th><th className="p-2">Payment Date</th><th className="p-2">Mode</th><th className="p-2">Txn Ref</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((row, idx) => (
//               <tr key={idx} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedRow(selectedRow === idx ? null : idx)}>
//                 <td className="p-2">{row.name}</td>
//                 <td className="p-2">{row.code}</td>
//                 <td className="p-2">{row.month}</td>
//                 <td className="p-2">₹{row.gross.toLocaleString()}</td>
//                 <td className="p-2">₹{row.deductions.toLocaleString()}</td>
//                 <td className="p-2">₹{row.net.toLocaleString()}</td>
//                 <td className="p-2">{row.paymentStatus}</td>
//                 <td className="p-2">{row.paymentDate || "—"}</td>
//                 <td className="p-2">{row.paymentMode || "—"}</td>
//                 <td className="p-2">{row.txnRef || "—"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       {/* Summary */}
//       <section className="bg-white rounded-xl shadow p-4 mb-4">
//         <h2 className="font-medium mb-3">Summary</h2>
//         <div className="grid md:grid-cols-3 gap-4 text-sm">
//           <div>Total Employees: {summary.totalEmployees}</div>
//           <div>Total Gross: ₹{summary.totalGross.toLocaleString()}</div>
//           <div>Total Deductions: ₹{summary.totalDeductions.toLocaleString()}</div>
//           <div>Total Net Payable: ₹{summary.totalNet.toLocaleString()}</div>
//           <div>Paid Employees: {summary.paidCount}</div>
//           <div>Unpaid Employees: {summary.unpaidCount}</div>
//         </div>
//       </section>

//       {/* Drill-down */}
//       {selectedRow !== null && (
//         <section className="bg-white rounded-xl shadow p-4 mb-4">
//           <h2 className="font-medium mb-3">Employee Salary Breakdown</h2>
//           <div className="grid md:grid-cols-3 gap-4">
//             <div>
//               <h3 className="font-semibold mb-2">Earnings</h3>
//               {Object.entries(filteredData[selectedRow].breakdown.earnings).map(([k, v]) => (
//                 <div key={k} className="flex justify-between border p-2 mb-1"><span>{k}</span><span>₹{v}</span></div>
//               ))}
//             </div>
//             <div>
//               <h3 className="font-semibold mb-2">Deductions</h3>
//               {Object.entries(filteredData[selectedRow].breakdown.deductions).map(([k, v]) => (
//                 <div key={k} className="flex justify-between border p-2 mb-1"><span>{k}</span><span>₹{v}</span></div>
//               ))}
//             </div>
//             <div>
//               <h3 className="font-semibold mb-2">Attendance</h3>
//               {Object.entries(filteredData[selectedRow].breakdown.attendance).map(([k, v]) => (
//                 <div key={k} className="flex justify-between border p-2 mb-1"><span>{k}</span><span>{v}</span></div>
//               ))}
//             </div>
//           </div>
//           <div className="mt-3">
//             <button className="bg-indigo-600 text-white px-4 py-2 rounded">Download Payslip 📄</button>
//           </div>
//         </section>
//       )}

//       {/* Actions */}
//       <section className="bg-white rounded-xl shadow p-4">
//         <h2 className="font-medium mb-3">Actions</h2>
//         <div className="flex gap-2 flex-wrap">
//           <button onClick={exportReport} className="bg-blue-500 text-white px-4 py-2 rounded">Export 📤</button>
//           <button onClick={() => sendSlips('Email')} className="bg-green-500 text-white px-4 py-2 rounded">Send to All (Email) 📧</button>
//           <button onClick={() => sendSlips('WhatsApp')} className="bg-green-600 text-white px-4 py-2 rounded">Send to All (WhatsApp) 💬</button>
//           <button onClick={bulkUpdateStatus} className="bg-yellow-500 text-white px-4 py-2 rounded">Bulk Update Status 🔄</button>
//           <button className="bg-gray-600 text-white px-4 py-2 rounded">View Archived 📚</button>
//         </div>
//       </section>
//     </div>
//   );
// }





import { useState, useMemo } from "react";
import { z } from "zod";
import { Filter, Calendar, Users, Briefcase, DollarSign, Search, Download, Mail, RefreshCw, Archive, X, Info, CreditCard, Clock, FileText, MessageCircle, ChevronDown, ChevronUp, Calculator, Send } from 'lucide-react';

// Zod schema for filter validation (optional, but good for structure)
const salaryReportFiltersSchema = z.object({
  monthYear: z.string().min(1, "Month & Year is required"),
  employeeType: z.enum(["All", "Payroll", "Intern", "Temporary"]),
  department: z.string().min(1, "Department is required"),
  paymentStatus: z.enum(["All", "Paid", "Unpaid", "Partial"]),
  employeeSearch: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  exportFormat: z.enum(["PDF", "Excel", "CSV"]),
});

// Zod schema for employee salary breakdown
const earningsSchema = z.object({
  type: z.string(),
  amount: z.number(),
});

const deductionsSchema = z.object({
  type: z.string(),
  amount: z.number(),
});

const attendanceSummarySchema = z.object({
  presentDays: z.number(),
  paidLeaveDays: z.number(),
  lopDays: z.number(),
  overtimeHours: z.number(),
});

const paymentDetailsSchema = z.object({
  date: z.string(),
  mode: z.string(),
  transactionRefNo: z.string().optional(),
});

const employeeBreakdownSchema = z.object({
  employeeName: z.string(),
  employeeCode: z.string(),
  earnings: z.array(earningsSchema),
  deductions: z.array(deductionsSchema),
  attendanceSummary: attendanceSummarySchema,
  paymentDetails: paymentDetailsSchema.optional(),
});


// Dummy data for dropdowns and table
const months = [
  "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025",
  "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"
];
const employeeTypes = ["All", "Payroll", "Intern", "Temporary"];
const departments = ["All", "Sales", "Marketing", "Engineering", "HR", "Finance"];
const paymentStatuses = ["All", "Paid", "Unpaid", "Partial"];
const exportFormats = ["PDF", "Excel", "CSV"];

const dummySalaryData = [
  {
    employeeName: "Ravi Sharma",
    code: "EMP001",
    month: "Aug 2025",
    grossEarnings: 29500,
    totalDeductions: 3360,
    netPayable: 26140,
    paymentStatus: "Paid",
    paymentDate: "01-09-2025",
    paymentMode: "Bank",
    transactionRefNo: "TXN123456",
    breakdown: {
      employeeName: "Ravi Sharma",
      employeeCode: "EMP001",
      earnings: [
        { type: "Basic", amount: 15000 },
        { type: "HRA", amount: 7500 },
        { type: "Incentives", amount: 5000 },
        { type: "Overtime", amount: 2000 },
      ],
      deductions: [
        { type: "PF", amount: 1800 },
        { type: "ESIC", amount: 560 },
        { type: "Professional Tax", amount: 200 },
        { type: "TDS", amount: 800 },
      ],
      attendanceSummary: {
        presentDays: 22,
        paidLeaveDays: 2,
        lopDays: 0,
        overtimeHours: 8,
      },
      paymentDetails: {
        date: "01-09-2025",
        mode: "Bank Transfer",
        transactionRefNo: "TXN123456",
      },
    },
  },
  {
    employeeName: "Anjali Verma",
    code: "EMP002",
    month: "Aug 2025",
    grossEarnings: 27000,
    totalDeductions: 2200,
    netPayable: 24800,
    paymentStatus: "Unpaid",
    paymentDate: "—",
    paymentMode: "—",
    transactionRefNo: "—",
    breakdown: {
      employeeName: "Anjali Verma",
      employeeCode: "EMP002",
      earnings: [
        { type: "Basic", amount: 14000 },
        { type: "HRA", amount: 7000 },
        { type: "Incentives", amount: 6000 },
      ],
      deductions: [
        { type: "PF", amount: 1680 },
        { type: "ESIC", amount: 520 },
      ],
      attendanceSummary: {
        presentDays: 20,
        paidLeaveDays: 0,
        lopDays: 2,
        overtimeHours: 0,
      },
      paymentDetails: undefined, // Unpaid
    },
  },
  {
    employeeName: "Pooja Patil",
    code: "EMP003",
    month: "Aug 2025",
    grossEarnings: 15000,
    totalDeductions: 0,
    netPayable: 15000,
    paymentStatus: "Paid",
    paymentDate: "31-08-2025",
    paymentMode: "UPI",
    transactionRefNo: "UPI987654",
    breakdown: {
      employeeName: "Pooja Patil",
      employeeCode: "EMP003",
      earnings: [
        { type: "Basic", amount: 10000 },
        { type: "HRA", amount: 5000 },
      ],
      deductions: [],
      attendanceSummary: {
        presentDays: 24,
        paidLeaveDays: 0,
        lopDays: 0,
        overtimeHours: 0,
      },
      paymentDetails: {
        date: "31-08-2025",
        mode: "UPI",
        transactionRefNo: "UPI987654",
      },
    },
  },
  {
    employeeName: "Amit Kumar",
    code: "EMP004",
    month: "Aug 2025",
    grossEarnings: 22000,
    totalDeductions: 1500,
    netPayable: 20500,
    paymentStatus: "Partial",
    paymentDate: "05-09-2025",
    paymentMode: "Bank",
    transactionRefNo: "TXN789012",
    breakdown: {
      employeeName: "Amit Kumar",
      employeeCode: "EMP004",
      earnings: [
        { type: "Basic", amount: 12000 },
        { type: "HRA", amount: 6000 },
        { type: "Incentives", amount: 4000 },
      ],
      deductions: [
        { type: "PF", amount: 1440 },
        { type: "Loan", amount: 60 },
      ],
      attendanceSummary: {
        presentDays: 23,
        paidLeaveDays: 1,
        lopDays: 0,
        overtimeHours: 2,
      },
      paymentDetails: {
        date: "05-09-2025",
        mode: "Bank Transfer",
        transactionRefNo: "TXN789012",
      },
    },
  },
];

export default function SalaryReports() {
  const [filters, setFilters] = useState({
    monthYear: "Aug 2025",
    employeeType: "All",
    department: "All",
    paymentStatus: "All",
    employeeSearch: "",
    startDate: "",
    endDate: "",
    exportFormat: "PDF",
  });

  const [showDrillDownModal, setShowDrillDownModal] = useState(false);
  const [selectedEmployeeBreakdown, setSelectedEmployeeBreakdown] = useState(null);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (dateString === "—") return "—";
    const [day, month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRowClick = (employeeData) => {
    setSelectedEmployeeBreakdown(employeeData.breakdown);
    setShowDrillDownModal(true);
  };

  const handleCloseDrillDownModal = () => {
    setShowDrillDownModal(false);
    setSelectedEmployeeBreakdown(null);
  };

  // Filtered data based on current filters
  const filteredSalaryData = useMemo(() => {
    return dummySalaryData.filter(employee => {
      const matchesMonthYear = filters.monthYear === "" || employee.month === filters.monthYear;
      const matchesEmployeeType = filters.employeeType === "All" || (employee.code.startsWith("EMP") && filters.employeeType === "Payroll") || (employee.code.startsWith("INT") && filters.employeeType === "Intern") || (employee.code.startsWith("TEMP") && filters.employeeType === "Temporary"); // Simplified logic for dummy data
      const matchesDepartment = filters.department === "All" || employee.department === filters.department; // Assuming department exists in dummy data for filtering
      const matchesPaymentStatus = filters.paymentStatus === "All" || employee.paymentStatus === filters.paymentStatus;
      const matchesSearch = filters.employeeSearch === "" ||
        employee.employeeName.toLowerCase().includes(filters.employeeSearch.toLowerCase()) ||
        employee.code.toLowerCase().includes(filters.employeeSearch.toLowerCase());

      // Date range filtering (simplified for dummy data, assuming paymentDate is within range)
      const matchesDateRange = (!filters.startDate || (employee.paymentDate !== "—" && new Date(employee.paymentDate.split('-').reverse().join('-')) >= new Date(filters.startDate))) &&
                               (!filters.endDate || (employee.paymentDate !== "—" && new Date(employee.paymentDate.split('-').reverse().join('-')) <= new Date(filters.endDate)));

      return matchesMonthYear && matchesEmployeeType && matchesDepartment && matchesPaymentStatus && matchesSearch && matchesDateRange;
    });
  }, [filters]);

  // Calculate summary totals
  const summaryTotals = useMemo(() => {
    let totalEmployees = filteredSalaryData.length;
    let totalGross = 0;
    let totalDeductions = 0;
    let totalNetPayable = 0;
    let paidEmployees = 0;
    let unpaidEmployees = 0;

    filteredSalaryData.forEach(employee => {
      totalGross += employee.grossEarnings;
      totalDeductions += employee.totalDeductions;
      totalNetPayable += employee.netPayable;
      if (employee.paymentStatus === "Paid") {
        paidEmployees++;
      } else if (employee.paymentStatus === "Unpaid") {
        unpaidEmployees++;
      }
    });

    return {
      totalEmployees,
      totalGross,
      totalDeductions,
      totalNetPayable,
      paidEmployees,
      unpaidEmployees,
    };
  }, [filteredSalaryData]);

  const handleExport = () => {
    alert(`Exporting report as ${filters.exportFormat}...`);
    // Implement actual export logic here
  };

  const handleSendSalarySlip = () => {
    alert("Sending salary slips to all employees...");
    // Implement actual sending logic here
  };

  const handleBulkUpdatePaymentStatus = () => {
    alert("Opening bulk update payment status tool...");
    // Implement bulk update logic here
  };

  const handleViewArchivedReports = () => {
    alert("Navigating to archived reports...");
    // Implement navigation to archived reports here
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      <main className="p-6 ml-4 mr-4">
        <div className="max-w-full mx-auto">
          <div className="mb-8">
            {/* <h1 className="text-4xl font-bold text-gray-900 mb-2">Salary Reports</h1> */}
            {/* <p className="text-gray-600">View and manage employee salary reports</p> */}
          </div>

          {/* Section 1: Filters */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">1. Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div>
                <label htmlFor="monthYear" className="block text-sm font-medium text-gray-700 mb-2">Month & Year <span className="text-red-500">*</span></label>
                <select
                  id="monthYear"
                  name="monthYear"
                  value={filters.monthYear}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700 mb-2">Employee Type</label>
                <select
                  id="employeeType"
                  name="employeeType"
                  value={filters.employeeType}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  {employeeTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  id="department"
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={filters.paymentStatus}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  {paymentStatuses.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2 xl:col-span-1">
                <label htmlFor="employeeSearch" className="block text-sm font-medium text-gray-700 mb-2">Employee Name / Code</label>
                <div className="relative">
                  <input
                    type="text"
                    id="employeeSearch"
                    name="employeeSearch"
                    value={filters.employeeSearch}
                    onChange={handleFilterChange}
                    placeholder="Search by name or code"
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="flex items-end gap-4 lg:col-span-2 xl:col-span-2">
                <div className="flex-1">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Date Range (Optional)</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2 sr-only">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <select
                  id="exportFormat"
                  name="exportFormat"
                  value={filters.exportFormat}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  {exportFormats.map((format, index) => (
                    <option key={index} value={format}>{format}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Report Table */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">2. Salary Report Table</h2>
            </div>
            {filteredSalaryData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Earnings (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deductions (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Payable (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Ref No.</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSalaryData.map((employee, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleRowClick(employee)}
                      >
                        <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.employeeName}</td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-500">{employee.code}</td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-500">{employee.month}</td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(employee.grossEarnings)}</td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(employee.totalDeductions)}</td>
                        <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(employee.netPayable)}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            employee.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                            employee.paymentStatus === "Unpaid" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {employee.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-500">{employee.paymentDate}</td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-500">{employee.paymentMode}</td>
                        <td className="p-4 whitespace-nowrap text-sm text-gray-500">{employee.transactionRefNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No salary records found for the selected filters.</p>
                <p className="text-sm">Try adjusting your filter criteria.</p>
              </div>
            )}
          </div>

          {/* Section 3: Summary */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">3. Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-gray-900">Total Employees</h3>
                <p className="text-3xl font-bold text-indigo-600">{summaryTotals.totalEmployees}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-gray-900">Total Gross</h3>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(summaryTotals.totalGross)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-gray-900">Total Deductions</h3>
                <p className="text-3xl font-bold text-red-600">{formatCurrency(summaryTotals.totalDeductions)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-gray-900">Total Net Payable</h3>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(summaryTotals.totalNetPayable)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-gray-900">Paid Employees</h3>
                <p className="text-3xl font-bold text-green-600">{summaryTotals.paidEmployees}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-gray-900">Unpaid Employees</h3>
                <p className="text-3xl font-bold text-red-600">{summaryTotals.unpaidEmployees}</p>
              </div>
            </div>
          </div>

          {/* Section 4: Actions */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                <Send className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">4. Actions</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleExport}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
              >
                <Download className="inline-block w-5 h-5 mr-2" /> Export Report
              </button>
              <button
                type="button"
                onClick={handleSendSalarySlip}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
              >
                <Mail className="inline-block w-5 h-5 mr-2" /> Send Salary Slip to All
              </button>
              <button
                type="button"
                onClick={handleBulkUpdatePaymentStatus}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
              >
                <RefreshCw className="inline-block w-5 h-5 mr-2" /> Bulk Update Payment Status
              </button>
              <button
                type="button"
                onClick={handleViewArchivedReports}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
              >
                <Archive className="inline-block w-5 h-5 mr-2" /> View Archived Reports
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Drill-down Modal */}
      {showDrillDownModal && selectedEmployeeBreakdown && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl transform transition-all duration-300 scale-100 opacity-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Salary Breakdown for {selectedEmployeeBreakdown.employeeName} ({selectedEmployeeBreakdown.employeeCode})
              </h3>
              <button
                type="button"
                onClick={handleCloseDrillDownModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              {/* Earnings Table */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center"><ChevronDown className="w-4 h-4 mr-2" /> Earnings</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedEmployeeBreakdown.earnings.map((earning, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{earning.type}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(earning.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Deductions Table */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center"><ChevronUp className="w-4 h-4 mr-2" /> Deductions</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedEmployeeBreakdown.deductions.map((deduction, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{deduction.type}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(deduction.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Attendance Summary */}
              <div className="bg-gray-50 rounded-xl p-4 md:col-span-1">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center"><Clock className="w-4 h-4 mr-2" /> Attendance Summary</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between"><span>Present Days:</span> <span className="font-medium">{selectedEmployeeBreakdown.attendanceSummary.presentDays}</span></div>
                  <div className="flex justify-between"><span>Paid Leave Days:</span> <span className="font-medium">{selectedEmployeeBreakdown.attendanceSummary.paidLeaveDays}</span></div>
                  <div className="flex justify-between"><span>LOP Days:</span> <span className="font-medium">{selectedEmployeeBreakdown.attendanceSummary.lopDays}</span></div>
                  <div className="flex justify-between"><span>Overtime Hours:</span> <span className="font-medium">{selectedEmployeeBreakdown.attendanceSummary.overtimeHours}</span></div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-xl p-4 md:col-span-1">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center"><CreditCard className="w-4 h-4 mr-2" /> Payment Details</h4>
                {selectedEmployeeBreakdown.paymentDetails ? (
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between"><span>Payment Date:</span> <span className="font-medium">{selectedEmployeeBreakdown.paymentDetails.date}</span></div>
                    <div className="flex justify-between"><span>Payment Mode:</span> <span className="font-medium">{selectedEmployeeBreakdown.paymentDetails.mode}</span></div>
                    <div className="flex justify-between"><span>Transaction Ref No:</span> <span className="font-medium">{selectedEmployeeBreakdown.paymentDetails.transactionRefNo || 'N/A'}</span></div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Payment details not available (Unpaid).</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => alert("Downloading Payslip PDF...")}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
              >
                <Download className="inline-block w-4 h-4 mr-2" /> Download Payslip (PDF)
              </button>
              <button
                type="button"
                onClick={handleCloseDrillDownModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

