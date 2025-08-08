// import React, { useState, useMemo } from "react";
// import { z } from "zod";

// // Plain JavaScript React component.
// // Notes: uses Tailwind CSS classes. Uses Zod for basic validation.
// // Icons are emoji (no SVG).

// const salarySchema = z.object({
//   monthYear: z.string().min(1, "Select month & year"),
//   employeeType: z.enum(["All", "Payroll", "Intern", "Temporary"]),
//   attendanceSource: z.enum(["Auto", "Manual"]),
// });

// const DEFAULT_EMPLOYEES = [
//   {
//     name: "Ravi",
//     code: "EMP001",
//     workingDays: 26,
//     presentDays: 24,
//     paidLeave: 1,
//     lopDays: 1,
//     overtimeHrs: 4,
//     structure: {
//       basic: 18000,
//       hra: 9000,
//       incentive: 2000,
//       overtime: 500,
//     },
//     deductions: {
//       pf: 2160,
//       pt: 200,
//       tds: 0,
//       loan: 1000,
//     },
//     payment: {
//       status: "Unpaid",
//       paymentMode: "Bank",
//       paymentDate: "",
//       txnRef: "",
//     },
//   },
//   {
//     name: "Anjali",
//     code: "EMP002",
//     workingDays: 26,
//     presentDays: 25,
//     paidLeave: 0,
//     lopDays: 1,
//     overtimeHrs: 0,
//     structure: {
//       basic: 18000,
//       hra: 9000,
//       incentive: 2000,
//       overtime: 0,
//     },
//     deductions: {
//       pf: 2160,
//       pt: 200,
//       tds: 0,
//       loan: 1000,
//     },
//     payment: {
//       status: "Unpaid",
//       paymentMode: "Bank",
//       paymentDate: "",
//       txnRef: "",
//     },
//   },
// ];

// export default function GenerateSalary() {
//   const [form, setForm] = useState({
//     monthYear: "",
//     employeeType: "All",
//     department: "",
//     includeEmployees: "All",
//     selectedEmployees: [],
//     attendanceSource: "Auto",
//   });

//   const [employees, setEmployees] = useState(DEFAULT_EMPLOYEES);
//   const [selectedEmpIndex, setSelectedEmpIndex] = useState(null);
//   const [errors, setErrors] = useState(null);
//   const [locked, setLocked] = useState(false);
//   const [draftGenerated, setDraftGenerated] = useState(false);

//   function handleFormChange(key, value) {
//     setForm((s) => ({ ...s, [key]: value }));
//   }

//   function validateStep1() {
//     try {
//       salarySchema.parse({
//         monthYear: form.monthYear,
//         employeeType: form.employeeType,
//         attendanceSource: form.attendanceSource === "Auto" ? "Auto" : "Manual",
//       });
//       setErrors(null);
//       return true;
//     } catch (e) {
//       setErrors(e.errors || e.message);
//       return false;
//     }
//   }

//   function updateEmployee(index, patch) {
//     setEmployees((list) => {
//       const copy = [...list];
//       copy[index] = { ...copy[index], ...patch };
//       return copy;
//     });
//   }

//   function updateStructure(index, path, value) {
//     setEmployees((list) => {
//       const copy = [...list];
//       copy[index] = { ...copy[index] };
//       copy[index].structure = { ...copy[index].structure, [path]: Number(value) || 0 };
//       return copy;
//     });
//   }

//   function updateDeductions(index, path, value) {
//     setEmployees((list) => {
//       const copy = [...list];
//       copy[index] = { ...copy[index] };
//       copy[index].deductions = { ...copy[index].deductions, [path]: Number(value) || 0 };
//       return copy;
//     });
//   }

//   function calcEmployeeSums(emp) {
//     const earnings = Object.values(emp.structure || {}).reduce((a, b) => a + Number(b || 0), 0);
//     const deductions = Object.values(emp.deductions || {}).reduce((a, b) => a + Number(b || 0), 0);
//     const net = earnings - deductions;
//     return { earnings, deductions, net };
//   }

//   const totals = useMemo(() => {
//     return employees.reduce(
//       (acc, e) => {
//         const sums = calcEmployeeSums(e);
//         acc.totalGross += sums.earnings;
//         acc.totalDeductions += sums.deductions;
//         acc.totalNet += sums.net;
//         return acc;
//       },
//       { totalGross: 0, totalDeductions: 0, totalNet: 0 }
//     );
//   }, [employees]);

//   function generateDraft() {
//     if (!validateStep1()) return;
//     setDraftGenerated(true);
//     setLocked(false);
//   }

//   function approveAndLock() {
//     if (!draftGenerated) {
//       alert("Generate draft first.");
//       return;
//     }
//     setLocked(true);
//     setDraftGenerated(false);
//   }

//   function generatePayslips() {
//     // For demo, just show alert with summary
//     const msg = employees
//       .map((e) => {
//         const s = calcEmployeeSums(e);
//         return `${e.name} (${e.code}) - Net: ₹${s.net.toFixed(2)}`;
//       })
//       .join("\n");
//     alert("Payslips generated (demo)\n\n" + msg);
//   }

//   function sendPayslips(channel) {
//     // placeholder demo
//     alert(`Sending payslips via ${channel}... (demo)`);
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <header className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold">Salary Generator</h1>
//         <div className="text-sm text-gray-600">{draftGenerated ? "Draft Ready ✏️" : locked ? "Locked 🔒" : "Not locked"}</div>
//       </header>

//       {/* Step 1: Parameters */}
//       <section className="bg-white rounded-xl shadow p-4 mb-4">
//         <h2 className="font-medium mb-3">Step 1: Salary Generation Parameters</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//           <label className="flex flex-col">
//             <span className="text-sm mb-1">Month & Year *</span>
//             <input
//               type="month"
//               value={form.monthYear}
//               onChange={(e) => handleFormChange("monthYear", e.target.value)}
//               className="border rounded px-3 py-2"
//             />
//           </label>

//           <label className="flex flex-col">
//             <span className="text-sm mb-1">Employee Type</span>
//             <select
//               value={form.employeeType}
//               onChange={(e) => handleFormChange("employeeType", e.target.value)}
//               className="border rounded px-3 py-2"
//             >
//               <option>All</option>
//               <option>Payroll</option>
//               <option>Intern</option>
//               <option>Temporary</option>
//             </select>
//           </label>

//           <label className="flex flex-col">
//             <span className="text-sm mb-1">Department (Optional)</span>
//             <select
//               value={form.department}
//               onChange={(e) => handleFormChange("department", e.target.value)}
//               className="border rounded px-3 py-2"
//             >
//               <option value="">-- Any --</option>
//               <option>Finance</option>
//               <option>HR</option>
//               <option>Engineering</option>
//             </select>
//           </label>

//           <label className="flex flex-col">
//             <span className="text-sm mb-1">Include Employees</span>
//             <select
//               value={form.includeEmployees}
//               onChange={(e) => handleFormChange("includeEmployees", e.target.value)}
//               className="border rounded px-3 py-2"
//             >
//               <option>All</option>
//               <option>Select individually</option>
//             </select>
//           </label>

//           <label className="flex flex-col">
//             <span className="text-sm mb-1">Attendance Source</span>
//             <select
//               value={form.attendanceSource}
//               onChange={(e) => handleFormChange("attendanceSource", e.target.value)}
//               className="border rounded px-3 py-2"
//             >
//               <option value="Auto">Auto from Attendance Module</option>
//               <option value="Manual">Manual Entry</option>
//             </select>
//           </label>

//           <div className="flex items-end">
//             <button
//               onClick={generateDraft}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
//             >
//               {"Generate Draft Salary"}
//             </button>
//             <button
//               onClick={approveAndLock}
//               className="ml-3 bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
//             >
//               Approve & Lock Salary
//             </button>
//           </div>
//         </div>
//         {errors && (
//           <div className="mt-3 text-red-600 text-sm">
//             Error: {JSON.stringify(errors)}
//           </div>
//         )}
//       </section>

//       {/* Step 2: Attendance Preview */}
//       <section className="bg-white rounded-xl shadow p-4 mb-4">
//         <h2 className="font-medium mb-3">Step 2: Attendance Data (Preview Table)</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto">
//             <thead>
//               <tr className="text-left border-b">
//                 <th className="p-2">Employee</th>
//                 <th className="p-2">Code</th>
//                 <th className="p-2">Working Days</th>
//                 <th className="p-2">Present Days</th>
//                 <th className="p-2">Paid Leave</th>
//                 <th className="p-2">LOP Days</th>
//                 <th className="p-2">Overtime Hrs</th>
//                 <th className="p-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.map((emp, idx) => (
//                 <tr key={emp.code} className="border-b">
//                   <td className="p-2">{emp.name}</td>
//                   <td className="p-2">{emp.code}</td>
//                   <td className="p-2">{emp.workingDays}</td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={emp.presentDays}
//                       onChange={(e) => updateEmployee(idx, { presentDays: Number(e.target.value) })}
//                       className="w-20 border rounded px-2 py-1"
//                       disabled={locked}
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={emp.paidLeave}
//                       onChange={(e) => updateEmployee(idx, { paidLeave: Number(e.target.value) })}
//                       className="w-16 border rounded px-2 py-1"
//                       disabled={locked}
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={emp.lopDays}
//                       onChange={(e) => updateEmployee(idx, { lopDays: Number(e.target.value) })}
//                       className="w-16 border rounded px-2 py-1"
//                       disabled={locked}
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={emp.overtimeHrs}
//                       onChange={(e) => updateEmployee(idx, { overtimeHrs: Number(e.target.value) })}
//                       className="w-20 border rounded px-2 py-1"
//                       disabled={locked}
//                     />
//                   </td>
//                   <td className="p-2">
//                     <button
//                       onClick={() => setSelectedEmpIndex(idx === selectedEmpIndex ? null : idx)}
//                       className="text-sm px-2 py-1 border rounded"
//                     >
//                       {selectedEmpIndex === idx ? "Hide/Edit ✏️" : "View/Edit ✏️"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Step 3: Earnings & Deductions (per selected employee) */}
//       {selectedEmpIndex !== null && (
//         <section className="bg-white rounded-xl shadow p-4 mb-4">
//           <h2 className="font-medium mb-3">Step 3: Earnings & Deductions (Auto from Salary Structure)</h2>
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <h3 className="font-semibold mb-2">Earnings Table</h3>
//               <div className="space-y-2">
//                 {Object.keys(employees[selectedEmpIndex].structure).map((k) => (
//                   <div key={k} className="flex items-center justify-between border rounded p-2">
//                     <div className="capitalize">{k}</div>
//                     <input
//                       type="number"
//                       value={employees[selectedEmpIndex].structure[k]}
//                       onChange={(e) => updateStructure(selectedEmpIndex, k, e.target.value)}
//                       className="w-28 border rounded px-2 py-1"
//                       disabled={locked}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold mb-2">Deductions Table</h3>
//               <div className="space-y-2">
//                 {Object.keys(employees[selectedEmpIndex].deductions).map((k) => (
//                   <div key={k} className="flex items-center justify-between border rounded p-2">
//                     <div className="capitalize">{k}</div>
//                     <input
//                       type="number"
//                       value={employees[selectedEmpIndex].deductions[k]}
//                       onChange={(e) => updateDeductions(selectedEmpIndex, k, e.target.value)}
//                       className="w-28 border rounded px-2 py-1"
//                       disabled={locked}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Step 4: Salary Summary */}
//       <section className="bg-white rounded-xl shadow p-4 mb-4">
//         <h2 className="font-medium mb-3">Step 4: Salary Summary (Per Employee)</h2>
//         <div className="space-y-4">
//           {employees.map((emp, idx) => {
//             const s = calcEmployeeSums(emp);
//             return (
//               <div key={emp.code} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <div className="font-semibold">{emp.name} <span className="text-sm text-gray-500">({emp.code})</span></div>
//                   <div className="text-sm text-gray-600">Working Days: {emp.workingDays} • Present: {emp.presentDays}</div>
//                 </div>
//                 <div className="mt-3 md:mt-0 flex gap-4 items-center">
//                   <div className="text-sm">
//                     <div>Gross Earnings: <span className="font-medium">₹{s.earnings.toFixed(2)}</span></div>
//                     <div>Total Deductions: <span className="font-medium">₹{s.deductions.toFixed(2)}</span></div>
//                     <div>Net Payable: <span className="font-semibold">₹{s.net.toFixed(2)}</span></div>
//                   </div>

//                   <div>
//                     <label className="block text-sm">Payment Status</label>
//                     <select
//                       value={emp.payment.status}
//                       onChange={(e) => updateEmployee(idx, { payment: { ...emp.payment, status: e.target.value } })}
//                       className="border rounded px-2 py-1"
//                       disabled={locked}
//                     >
//                       <option>Unpaid</option>
//                       <option>Processing</option>
//                       <option>Paid</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm">Remarks</label>
//                     <input
//                       type="text"
//                       placeholder="Optional"
//                       className="border rounded px-2 py-1"
//                       disabled={locked}
//                       onChange={(e) => updateEmployee(idx, { remarks: e.target.value })}
//                     />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="mt-4 p-3 bg-gray-50 rounded">
//           <div className="flex justify-between">
//             <div>Total Gross Earnings:</div>
//             <div className="font-semibold">₹{totals.totalGross.toFixed(2)}</div>
//           </div>
//           <div className="flex justify-between">
//             <div>Total Deductions:</div>
//             <div className="font-semibold">₹{totals.totalDeductions.toFixed(2)}</div>
//           </div>
//           <div className="flex justify-between mt-2 border-t pt-2">
//             <div>Net Payable (All):</div>
//             <div className="font-bold">₹{totals.totalNet.toFixed(2)}</div>
//           </div>
//         </div>
//       </section>

//       {/* Step 5: Payment Details */}
//       <section className="bg-white rounded-xl shadow p-4 mb-4">
//         <h2 className="font-medium mb-3">Step 5: Payment Details (Optional Now or Later)</h2>
//         <div className="grid md:grid-cols-4 gap-3">
//           <label className="flex flex-col">
//             <span className="text-sm mb-1">Payment Date</span>
//             <input type="date" className="border rounded px-3 py-2" />
//           </label>
//           <label className="flex flex-col">
//             <span className="text-sm mb-1">Payment Mode</span>
//             <select className="border rounded px-3 py-2">
//               <option>Bank</option>
//               <option>UPI</option>
//               <option>Cash</option>
//             </select>
//           </label>
//           <label className="flex flex-col">
//             <span className="text-sm mb-1">Bank Account (Auto from Employee Master)</span>
//             <input type="text" className="border rounded px-3 py-2" placeholder="Auto-filled per employee" disabled />
//           </label>
//           <label className="flex flex-col">
//             <span className="text-sm mb-1">Transaction Reference No.</span>
//             <input type="text" className="border rounded px-3 py-2" />
//           </label>
//         </div>
//       </section>

//       {/* Step 6: Actions */}
//       <section className="bg-white rounded-xl shadow p-4 mb-8">
//         <h2 className="font-medium mb-3">Step 6: Actions</h2>
//         <div className="flex gap-3 flex-wrap">
//           <button onClick={generateDraft} disabled={locked} className="px-4 py-2 bg-yellow-500 rounded text-white">Generate Draft Salary ✏️</button>
//           <button onClick={approveAndLock} className="px-4 py-2 bg-green-600 rounded text-white">Approve & Lock 🔒</button>
//           <button onClick={generatePayslips} className="px-4 py-2 bg-indigo-600 rounded text-white">Generate Payslips 🧾</button>
//           <div className="flex items-center gap-2">
//             <button onClick={() => sendPayslips('Email')} className="px-4 py-2 bg-blue-500 rounded text-white">Send Payslips (Email) 📧</button>
//             <button onClick={() => sendPayslips('WhatsApp')} className="px-4 py-2 bg-green-500 rounded text-white">Send Payslips (WhatsApp) 💬</button>
//           </div>
//         </div>
//       </section>

//       <footer className="text-sm text-gray-500">Built with ❤️ using React + Tailwind + Zod — icons are emoji to avoid SVGs.</footer>
//     </div>
//   );
// }



import React, { useState, useMemo, useEffect } from "react";
import { User, Calendar, Briefcase, DollarSign, MinusCircle, FileText, Upload, Save, CheckCircle, File, Mail, MessageSquare, X, Plus } from 'lucide-react';
import { z } from "zod";

// Zod Schemas for validation
const earningSchema = z.object({
  componentName: z.string().min(1, 'Component Name is required'),
  amount: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().min(0, 'Amount must be a non-negative number')),
});

const deductionSchema = z.object({
  componentName: z.string().min(1, 'Component Name is required'),
  amount: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().min(0, 'Amount must be a non-negative number')),
});

const generateSalaryFormSchema = z.object({
  monthYear: z.string().min(1, "Month & Year is required"),
  employeeType: z.enum(["All", "Payroll", "Intern", "Temporary"]),
  attendanceSource: z.enum(["Auto", "Manual"]),
});

const employeeSchema = z.object({
  name: z.string(),
  code: z.string(),
  type: z.string(),
  structureName: z.string(),
  workingDays: z.number(),
  presentDays: z.number().min(0, "Present Days must be non-negative"),
  paidLeave: z.number().min(0, "Paid Leave must be non-negative"),
  lopDays: z.number().min(0, "LOP Days must be non-negative"),
  overtimeHrs: z.number().min(0, "Overtime Hours must be non-negative"),
  structure: z.record(z.string(), z.number()), // Dynamic earnings
  deductions: z.record(z.string(), z.number()), // Dynamic deductions
  payment: z.object({
    status: z.enum(["Unpaid", "Processing", "Paid"]),
    paymentMode: z.string(),
    paymentDate: z.string(),
    txnRef: z.string(),
  }),
  remarks: z.string().optional(),
});

const DEFAULT_EMPLOYEES_MASTER = [
  {
    name: "Ravi",
    code: "EMP001",
    type: "Payroll",
    structureName: "Standard Monthly Payroll",
    attendance: {
      totalWorkingDays: 26,
      presentDays: 24,
      paidLeaveDays: 1,
      unpaidLeaveDays: 1,
    },
    defaultEarnings: [
      { componentName: "Basic", amount: 18000 },
      { componentName: "HRA", amount: 9000 },
      { componentName: "Incentive", amount: 2000 },
      { componentName: "Overtime", amount: 500 },
    ],
    defaultDeductions: [
      { componentName: "PF", amount: 2160 },
      { componentName: "PT", amount: 200 },
      { componentName: "TDS", amount: 0 },
      { componentName: "Loan", amount: 1000 },
    ],
  },
  {
    name: "Anjali",
    code: "EMP002",
    type: "Payroll",
    structureName: "Standard Monthly Payroll",
    attendance: {
      totalWorkingDays: 26,
      presentDays: 25,
      paidLeaveDays: 0,
      unpaidLeaveDays: 1,
    },
    defaultEarnings: [
      { componentName: "Basic", amount: 18000 },
      { componentName: "HRA", amount: 9000 },
      { componentName: "Incentive", amount: 2000 },
      { componentName: "Overtime", amount: 0 },
    ],
    defaultDeductions: [
      { componentName: "PF", amount: 2160 },
      { componentName: "PT", amount: 200 },
      { componentName: "TDS", amount: 0 },
      { componentName: "Loan", amount: 1000 },
    ],
  },
];

export default function GenerateSalary() {
  const [form, setForm] = useState({
    monthYear: "",
    employeeType: "All",
    department: "",
    includeEmployees: "All",
    attendanceSource: "Auto",
  });

  const [employees, setEmployees] = useState([]);
  const [selectedEmpIndex, setSelectedEmpIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [locked, setLocked] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);

  // Initialize employees based on DEFAULT_EMPLOYEES_MASTER when component mounts
  useEffect(() => {
    const initialEmployees = DEFAULT_EMPLOYEES_MASTER.map(emp => {
      const structure = emp.defaultEarnings.reduce((acc, item) => {
        acc[item.componentName.toLowerCase().replace(/\s/g, '')] = item.amount;
        return acc;
      }, {});
      const deductions = emp.defaultDeductions.reduce((acc, item) => {
        acc[item.componentName.toLowerCase().replace(/\s/g, '')] = item.amount;
        return acc;
      }, {});

      return {
        name: emp.name,
        code: emp.code,
        type: emp.type,
        structureName: emp.structureName,
        workingDays: emp.attendance.totalWorkingDays,
        presentDays: emp.attendance.presentDays,
        paidLeave: emp.attendance.paidLeaveDays,
        lopDays: emp.attendance.unpaidLeaveDays,
        overtimeHrs: 0, // Default to 0, can be edited
        structure,
        deductions,
        payment: {
          status: "Unpaid",
          paymentMode: "Bank",
          paymentDate: "",
          txnRef: "",
        },
        remarks: "",
      };
    });
    setEmployees(initialEmployees);
  }, []);

  function handleFormChange(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  }

  function updateEmployee(index, patch) {
    setEmployees((list) => {
      const copy = [...list];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  }

  function updateEmployeeNested(index, path, subPath, value) {
    setEmployees((list) => {
      const copy = [...list];
      copy[index] = { ...copy[index] };
      copy[index][path] = { ...copy[index][path], [subPath]: value };
      return copy;
    });
  }

  function updateEmployeeDynamicComponent(index, type, componentName, value) {
    setEmployees((list) => {
      const copy = [...list];
      copy[index] = { ...copy[index] };
      const currentComponents = { ...copy[index][type] };
      currentComponents[componentName] = Number(value) || 0;
      copy[index][type] = currentComponents;
      return copy;
    });
  }

  function addDynamicComponent(index, type) {
    setEmployees((list) => {
      const copy = [...list];
      copy[index] = { ...copy[index] };
      const currentComponents = { ...copy[index][type] };
      let newComponentName = `New ${type === 'structure' ? 'Earning' : 'Deduction'}`;
      let counter = 1;
      while (currentComponents[`${newComponentName}${counter}`.toLowerCase().replace(/\s/g, '')] !== undefined) {
        counter++;
      }
      currentComponents[`${newComponentName}${counter}`.toLowerCase().replace(/\s/g, '')] = 0;
      copy[index][type] = currentComponents;
      return copy;
    });
  }

  function removeDynamicComponent(index, type, componentName) {
    setEmployees((list) => {
      const copy = [...list];
      copy[index] = { ...copy[index] };
      const currentComponents = { ...copy[index][type] };
      delete currentComponents[componentName];
      copy[index][type] = currentComponents;
      return copy;
    });
  }

  function calcEmployeeSums(emp) {
    const earnings = Object.values(emp.structure || {}).reduce((a, b) => a + Number(b || 0), 0);
    const deductions = Object.values(emp.deductions || {}).reduce((a, b) => a + Number(b || 0), 0);
    const net = earnings - deductions;
    return { earnings, deductions, net };
  }

  const totals = useMemo(() => {
    return employees.reduce((acc, e) => {
      const sums = calcEmployeeSums(e);
      acc.totalGross += sums.earnings;
      acc.totalDeductions += sums.deductions;
      acc.totalNet += sums.net;
      return acc;
    },
      { totalGross: 0, totalDeductions: 0, totalNet: 0 }
    );
  }, [employees]); // The useMemo hook ensures this calculation only re-runs when the 'employees' array changes [^2].

  const validateForm = () => {
    const newErrors = {};

    // Validate main form parameters
    try {
      generateSalaryFormSchema.parse(form);
    } catch (e) {
      if (e instanceof z.ZodError) {
        e.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
      }
    }

    // Validate each employee's data
    employees.forEach((emp, empIdx) => {
      try {
        employeeSchema.parse(emp);
      } catch (e) {
        if (e instanceof z.ZodError) {
          e.errors.forEach((err) => {
            if (err.path.length > 0) {
              newErrors[`employee_${empIdx}_${err.path[0]}`] = err.message;
            }
          });
        }
      }

      // Validate dynamic earnings
      if (Object.keys(emp.structure).length === 0) {
        newErrors[`employee_${empIdx}_earnings`] = "At least one earning component is required.";
      } else {
        for (const key in emp.structure) {
          try {
            earningSchema.parse({ componentName: key, amount: emp.structure[key] });
          } catch (e) {
            if (e instanceof z.ZodError) {
              e.errors.forEach((err) => {
                newErrors[`employee_${empIdx}_earning_${key}_${err.path[0]}`] = err.message;
              });
            }
          }
        }
      }

      // Validate dynamic deductions
      if (Object.keys(emp.deductions).length === 0) {
        newErrors[`employee_${empIdx}_deductions`] = "At least one deduction component is required.";
      } else {
        for (const key in emp.deductions) {
          try {
            deductionSchema.parse({ componentName: key, amount: emp.deductions[key] });
          } catch (e) {
            if (e instanceof z.ZodError) {
              e.errors.forEach((err) => {
                newErrors[`employee_${empIdx}_deduction_${key}_${err.path[0]}`] = err.message;
              });
            }
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function generateDraft() {
    if (validateForm()) {
      setDraftGenerated(true);
      setLocked(false);
      alert("Draft Salary Generated Successfully!");
    } else {
      alert("Please correct the errors in the form before generating draft.");
    }
  }

  function approveAndLock() {
    if (!draftGenerated) {
      alert("Generate draft first.");
      return;
    }
    setLocked(true);
    setDraftGenerated(false);
    alert("Salary Approved & Locked!");
  }

  function generatePayslips() {
    if (!locked) {
      alert("Please approve and lock the salary first.");
      return;
    }
    // For demo, just show alert with summary
    const msg = employees.map((e) => {
      const s = calcEmployeeSums(e);
      return `${e.name} (${e.code}) - Net: ₹${s.net.toFixed(2)}`;
    }).join("\n");
    alert("Payslips generated (demo)\n\n" + msg);
  }

  function sendPayslips(channel) {
    if (!locked) {
      alert("Please approve and lock the salary first.");
      return;
    }
    // placeholder demo
    alert(`Sending payslips via ${channel}... (demo)`);
  }

  return (
    <form className="max-w-full mx-auto p-6 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen space-y-8 mb-8 mr-4 ml-4">
      <header className="flex items-center justify-between mb-6 ">
        {/* <h1 className="text-3xl font-bold text-gray-900">Salary Generator</h1> */}
        <div className={` ml-auto text-sm font-medium px-3 py-1 rounded-full ${draftGenerated ? "bg-yellow-100 text-yellow-800" : locked ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
          {draftGenerated ? "Draft Ready ✏️" : locked ? "Locked 🔒" : "Not locked"}
        </div>
      </header>

      {/* 1. Salary Generation Parameters */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Step 1: Salary Generation Parameters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Month & Year */}
          <div>
            <label htmlFor="monthYear" className="block text-sm font-medium text-gray-700 mb-2">
              Month & Year <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              id="monthYear"
              name="monthYear"
              value={form.monthYear}
              onChange={(e) => handleFormChange("monthYear", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.monthYear ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.monthYear && <p className="mt-1 text-sm text-red-600">{errors.monthYear}</p>}
          </div>
          {/* Employee Type */}
          <div>
            <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700 mb-2">
              Employee Type
            </label>
            <select
              id="employeeType"
              name="employeeType"
              value={form.employeeType}
              onChange={(e) => handleFormChange("employeeType", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-gray-300"
            >
              <option>All</option>
              <option>Payroll</option>
              <option>Intern</option>
              <option>Temporary</option>
            </select>
          </div>
          {/* Department (Optional) */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department (Optional)
            </label>
            <select
              id="department"
              name="department"
              value={form.department}
              onChange={(e) => handleFormChange("department", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-gray-300"
            >
              <option value="">-- Any --</option>
              <option>Finance</option>
              <option>HR</option>
              <option>Engineering</option>
            </select>
          </div>
          {/* Include Employees */}
          <div>
            <label htmlFor="includeEmployees" className="block text-sm font-medium text-gray-700 mb-2">
              Include Employees
            </label>
            <select
              id="includeEmployees"
              name="includeEmployees"
              value={form.includeEmployees}
              onChange={(e) => handleFormChange("includeEmployees", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-gray-300"
            >
              <option>All</option>
              <option>Select individually</option>
            </select>
          </div>
          {/* Attendance Source */}
          <div>
            <label htmlFor="attendanceSource" className="block text-sm font-medium text-gray-700 mb-2">
              Attendance Source
            </label>
            <select
              id="attendanceSource"
              name="attendanceSource"
              value={form.attendanceSource}
              onChange={(e) => handleFormChange("attendanceSource", e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.attendanceSource ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="Auto">Auto from Attendance Module</option>
              <option value="Manual">Manual Entry</option>
            </select>
            {errors.attendanceSource && <p className="mt-1 text-sm text-red-600">{errors.attendanceSource}</p>}
          </div>
          <div className="flex items-end col-span-full lg:col-span-1">
            <button
              type="button"
              onClick={generateDraft}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-xl hover:from-blue-700 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
            >
              <File className="w-5 h-5 mr-2" /> Generate Draft Salary
            </button>
            <button
              type="button"
              onClick={approveAndLock}
              className="ml-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Approve & Lock Salary
            </button>
          </div>
        </div>
      </div>

      {/* 2. Attendance & Work Data (Preview Table) */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Step 2: Attendance Data (Preview Table)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Days</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Leave</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOP Days</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime Hrs</th>
                <th scope="col" className="relative px-4 py-3"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp, idx) => (
                <tr key={emp.code}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{emp.code}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{emp.workingDays}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={emp.presentDays}
                      onChange={(e) => updateEmployee(idx, { presentDays: Number(e.target.value) })}
                      className={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`employee_${idx}_presentDays`] ? "border-red-500" : "border-gray-300"}`}
                      disabled={locked}
                    />
                    {errors[`employee_${idx}_presentDays`] && <p className="mt-1 text-xs text-red-600">{errors[`employee_${idx}_presentDays`]}</p>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={emp.paidLeave}
                      onChange={(e) => updateEmployee(idx, { paidLeave: Number(e.target.value) })}
                      className={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`employee_${idx}_paidLeave`] ? "border-red-500" : "border-gray-300"}`}
                      disabled={locked}
                    />
                    {errors[`employee_${idx}_paidLeave`] && <p className="mt-1 text-xs text-red-600">{errors[`employee_${idx}_paidLeave`]}</p>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={emp.lopDays}
                      onChange={(e) => updateEmployee(idx, { lopDays: Number(e.target.value) })}
                      className={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`employee_${idx}_lopDays`] ? "border-red-500" : "border-gray-300"}`}
                      disabled={locked}
                    />
                    {errors[`employee_${idx}_lopDays`] && <p className="mt-1 text-xs text-red-600">{errors[`employee_${idx}_lopDays`]}</p>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={emp.overtimeHrs}
                      onChange={(e) => updateEmployee(idx, { overtimeHrs: Number(e.target.value) })}
                      className={`w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`employee_${idx}_overtimeHrs`] ? "border-red-500" : "border-gray-300"}`}
                      disabled={locked}
                    />
                    {errors[`employee_${idx}_overtimeHrs`] && <p className="mt-1 text-xs text-red-600">{errors[`employee_${idx}_overtimeHrs`]}</p>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => setSelectedEmpIndex(idx === selectedEmpIndex ? null : idx)}
                      className="text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                    >
                      {selectedEmpIndex === idx ? "Hide/Edit" : "View/Edit"} <span className="ml-1">✏️</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Earnings & Deductions (per selected employee) */}
      {selectedEmpIndex !== null && (
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-sky-500 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Step 3: Earnings & Deductions for {employees[selectedEmpIndex]?.name}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Earnings Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-800">Earnings Table</h3>
                <button
                  type="button"
                  onClick={() => addDynamicComponent(selectedEmpIndex, 'structure')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={locked}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Earning
                </button>
              </div>
              {Object.keys(employees[selectedEmpIndex].structure).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component Name</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                        <th scope="col" className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(employees[selectedEmpIndex].structure).map(([key, value]) => (
                        <tr key={key}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => updateEmployeeDynamicComponent(selectedEmpIndex, 'structure', key, e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`employee_${selectedEmpIndex}_earning_${key}_amount`] ? "border-red-500" : "border-gray-300"}`}
                              disabled={locked}
                            />
                            {errors[`employee_${selectedEmpIndex}_earning_${key}_amount`] && <p className="mt-1 text-xs text-red-600">{errors[`employee_${selectedEmpIndex}_earning_${key}_amount`]}</p>}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => removeDynamicComponent(selectedEmpIndex, 'structure', key)}
                              className="text-red-600 hover:text-red-900"
                              disabled={locked}
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium">No earning components added yet</p>
                  <p className="text-sm">Click "Add Earning" to define salary components</p>
                </div>
              )}
              {errors[`employee_${selectedEmpIndex}_earnings`] && <p className="mt-2 text-sm text-red-600">{errors[`employee_${selectedEmpIndex}_earnings`]}</p>}
            </div>

            {/* Deductions Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-800">Deductions Table</h3>
                <button
                  type="button"
                  onClick={() => addDynamicComponent(selectedEmpIndex, 'deductions')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={locked}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Deduction
                </button>
              </div>
              {Object.keys(employees[selectedEmpIndex].deductions).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component Name</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                        <th scope="col" className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(employees[selectedEmpIndex].deductions).map(([key, value]) => (
                        <tr key={key}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => updateEmployeeDynamicComponent(selectedEmpIndex, 'deductions', key, e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`employee_${selectedEmpIndex}_deduction_${key}_amount`] ? "border-red-500" : "border-gray-300"}`}
                              disabled={locked}
                            />
                            {errors[`employee_${selectedEmpIndex}_deduction_${key}_amount`] && <p className="mt-1 text-xs text-red-600">{errors[`employee_${selectedEmpIndex}_deduction_${key}_amount`]}</p>}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => removeDynamicComponent(selectedEmpIndex, 'deductions', key)}
                              className="text-red-600 hover:text-red-900"
                              disabled={locked}
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MinusCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium">No deduction components added yet</p>
                  <p className="text-sm">Click "Add Deduction" to define salary deductions</p>
                </div>
              )}
              {errors[`employee_${selectedEmpIndex}_deductions`] && <p className="mt-2 text-sm text-red-600">{errors[`employee_${selectedEmpIndex}_deductions`]}</p>}
            </div>
          </div>
        </div>
      )}

      {/* 4. Salary Summary (Per Employee) */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Step 4: Salary Summary (Per Employee)</h2>
        </div>
        <div className="space-y-6">
          {employees.map((emp, idx) => {
            const s = calcEmployeeSums(emp);
            return (
              <div key={emp.code} className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50">
                <div>
                  <div className="font-semibold text-lg text-gray-900">{emp.name} <span className="text-sm text-gray-500">({emp.code})</span></div>
                  <div className="text-sm text-gray-600">Working Days: {emp.workingDays} • Present: {emp.presentDays}</div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="text-sm grid grid-cols-1 gap-1">
                    <div>Gross Earnings: <span className="font-medium text-gray-800">₹{s.earnings.toFixed(2)}</span></div>
                    <div>Total Deductions: <span className="font-medium text-gray-800">₹{s.deductions.toFixed(2)}</span></div>
                    <div className="font-bold text-base text-green-700">Net Payable: ₹{s.net.toFixed(2)}</div>
                  </div>
                  <div>
                    <label htmlFor={`paymentStatus-${idx}`} className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <select
                      id={`paymentStatus-${idx}`}
                      value={emp.payment.status}
                      onChange={(e) => updateEmployeeNested(idx, 'payment', 'status', e.target.value)}
                      className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${locked ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"}`}
                      disabled={locked}
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Processing">Processing</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`remarks-${idx}`} className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <input
                      type="text"
                      id={`remarks-${idx}`}
                      placeholder="Optional"
                      value={emp.remarks || ''}
                      onChange={(e) => updateEmployee(idx, { remarks: e.target.value })}
                      className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${locked ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"}`}
                      disabled={locked}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
          <div className="flex justify-between text-lg font-semibold text-gray-800">
            <div>Total Gross Earnings:</div>
            <div>₹{totals.totalGross.toFixed(2)}</div>
          </div>
          <div className="flex justify-between mt-2 text-lg font-semibold text-gray-800">
            <div>Total Deductions:</div>
            <div>₹{totals.totalDeductions.toFixed(2)}</div>
          </div>
          <div className="flex justify-between mt-4 border-t border-indigo-300 pt-4 text-xl font-bold text-green-800">
            <div>Net Payable (All):</div>
            <div>₹{totals.totalNet.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* 5. Payment Details (Optional Now or Later) */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Step 5: Payment Details (Optional Now or Later)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
            <input type="date" id="paymentDate" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-gray-300" disabled={locked} />
          </div>
          <div>
            <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
            <select id="paymentMode" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-gray-300" disabled={locked}>
              <option>Bank</option>
              <option>UPI</option>
              <option>Cash</option>
            </select>
          </div>
          <div>
            <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 mb-2">Bank Account (Auto from Employee Master)</label>
            <input type="text" id="bankAccount" className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed border-gray-300" placeholder="Auto-filled per employee" disabled />
          </div>
          <div>
            <label htmlFor="transactionReferenceNo" className="block text-sm font-medium text-gray-700 mb-2">Transaction Reference No.</label>
            <input type="text" id="transactionReferenceNo" className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-gray-300" disabled={locked} />
          </div>
        </div>
      </div>

      {/* 6. Actions */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
  <div className="flex items-center mb-6">
    <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg flex items-center justify-center mr-3">
      <Briefcase className="w-5 h-5 text-white" />
    </div>
    <h2 className="text-xl font-semibold text-gray-900">Step 6: Actions</h2>
  </div>

  <div className="flex flex-col sm:flex-row gap-4 justify-end">
    {/* Draft Salary Button */}
    <button
      onClick={generateDraft}
      disabled={locked}
      className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50"
    >
      ✏️ Generate Draft Salary
    </button>

    {/* Generate Payslip Button */}
    <button
      type="button"
      onClick={generatePayslips}
      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
    >
      <File className="w-5 h-5 mr-2" /> Generate Payslip (PDF)
    </button>

    {/* Send Email Button */}
    <button
      type="button"
      onClick={() => sendPayslips('Email')}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl hover:from-blue-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
    >
      <Mail className="w-5 h-5 mr-2" /> Send Payslips (Email)
    </button>

    {/* Send WhatsApp Button */}
    <button
      type="button"
      onClick={() => sendPayslips('WhatsApp')}
      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
    >
      <MessageSquare className="w-5 h-5 mr-2" /> Send Payslips (WhatsApp)
    </button>
  </div>
</div>


      <footer className="text-sm text-gray-500 text-center py-4">Built with ❤️ using React + Tailwind + Zod — icons from Lucide React.</footer>
    </form>
  );
}
