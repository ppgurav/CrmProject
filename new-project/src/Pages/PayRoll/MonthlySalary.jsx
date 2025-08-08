import { useState, useEffect } from "react";
import { User, Calendar, Briefcase, DollarSign, MinusCircle, FileText, Upload, Save, CheckCircle, File, Mail, MessageSquare, X, Plus } from 'lucide-react';
import { z } from 'zod';

// Zod Schemas for validation
const earningSchema = z.object({
  componentName: z.string().min(1, 'Component Name is required'),
  amount: z.number().min(0, 'Amount must be a non-negative number'),
});

const deductionSchema = z.object({
  componentName: z.string().min(1, 'Component Name is required'),
  amount: z.number().min(0, 'Amount must be a non-negative number'),
});

const monthlySalaryFormSchema = z.object({
  employeeName: z.string().min(1, 'Employee Name is required'),
  monthYear: z.string().min(1, 'Month & Year is required'),
  overtimeHours: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, 'Overtime Hours must be a non-negative number').optional()
  ),
  latePenalty: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, 'Late Penalty must be a non-negative number').optional()
  ),
  paymentStatus: z.string().min(1, 'Payment Status is required'),
  paymentDate: z.string().optional(), // Conditionally required
  paymentMode: z.string().optional(), // Conditionally required
  transactionReferenceNo: z.string().optional(),
  remarks: z.string().optional(),
  // supportingDocument: z.any().optional(), // File input validation is complex for Zod without specific file types/sizes
});

export default function MonthlySalary() {
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeCode: "",
    monthYear: "",
    employeeType: "",
    salaryStructure: "",
    totalWorkingDays: "",
    presentDays: "",
    paidLeaveDays: "",
    unpaidLeaveDays: "",
    overtimeHours: "",
    latePenalty: "",
    paymentStatus: "",
    paymentDate: "",
    paymentMode: "",
    transactionReferenceNo: "",
    remarks: "",
    supportingDocument: null,
  });

  const [earnings, setEarnings] = useState([
    { componentName: "Basic Salary", amount: 0 },
    { componentName: "HRA", amount: 0 },
    { componentName: "Conveyance", amount: 0 },
  ]);
  const [deductions, setDeductions] = useState([
    { componentName: "Provident Fund (PF)", amount: 0 },
    { componentName: "Professional Tax (PT)", amount: 0 },
  ]);
  const [errors, setErrors] = useState({});

  // Dummy Employee Master Data
  const employeeMasterData = [
    {
      name: "John Doe",
      code: "EMP001",
      type: "Full-time",
      structure: "Standard Monthly Payroll",
      attendance: {
        totalWorkingDays: 22,
        presentDays: 20,
        paidLeaveDays: 2,
        unpaidLeaveDays: 0,
      },
      defaultEarnings: [
        { componentName: "Basic Salary", amount: 30000 },
        { componentName: "HRA", amount: 15000 },
        { componentName: "Conveyance", amount: 2000 },
      ],
      defaultDeductions: [
        { componentName: "Provident Fund (PF)", amount: 3600 },
        { componentName: "Professional Tax (PT)", amount: 200 },
      ],
    },
    {
      name: "Jane Smith",
      code: "EMP002",
      type: "Part-time",
      structure: "Hourly Wage Structure",
      attendance: {
        totalWorkingDays: 22,
        presentDays: 18,
        paidLeaveDays: 0,
        unpaidLeaveDays: 4,
      },
      defaultEarnings: [
        { componentName: "Hourly Wage", amount: 25000 },
        { componentName: "Incentive", amount: 1000 },
      ],
      defaultDeductions: [
        { componentName: "Income Tax (TDS)", amount: 1500 },
      ],
    },
    {
      name: "Alice Johnson",
      code: "EMP003",
      type: "Contractor",
      structure: "Project Based Payout",
      attendance: {
        totalWorkingDays: 20,
        presentDays: 20,
        paidLeaveDays: 0,
        unpaidLeaveDays: 0,
      },
      defaultEarnings: [
        { componentName: "Project Fee", amount: 50000 },
      ],
      defaultDeductions: [
        { componentName: "Loan Repayment", amount: 5000 },
      ],
    },
  ];

  // Auto-fill employee details when employeeName changes
  useEffect(() => {
    const selectedEmployee = employeeMasterData.find(
      (emp) => emp.name === formData.employeeName
    );
    if (selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        employeeCode: selectedEmployee.code,
        employeeType: selectedEmployee.type,
        salaryStructure: selectedEmployee.structure,
        totalWorkingDays: selectedEmployee.attendance.totalWorkingDays,
        presentDays: selectedEmployee.attendance.presentDays,
        paidLeaveDays: selectedEmployee.attendance.paidLeaveDays,
        unpaidLeaveDays: selectedEmployee.attendance.unpaidLeaveDays,
      }));
      setEarnings(selectedEmployee.defaultEarnings);
      setDeductions(selectedEmployee.defaultDeductions);
    } else {
      // Clear auto-filled fields if no employee is selected
      setFormData((prev) => ({
        ...prev,
        employeeCode: "",
        employeeType: "",
        salaryStructure: "",
        totalWorkingDays: "",
        presentDays: "",
        paidLeaveDays: "",
        unpaidLeaveDays: "",
      }));
      setEarnings([]);
      setDeductions([]);
    }
  }, [formData.employeeName]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (type === "file" ? files[0] : value),
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEarningsChange = (index, e) => {
    const { name, value } = e.target;
    const newEarnings = [...earnings];
    newEarnings[index][name] = name === "amount" ? parseFloat(value) || 0 : value;
    setEarnings(newEarnings);
  };

  const addEarningRow = () => {
    setEarnings((prev) => [...prev, { componentName: "", amount: 0 }]);
  };

  const removeEarningRow = (index) => {
    setEarnings((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeductionsChange = (index, e) => {
    const { name, value } = e.target;
    const newDeductions = [...deductions];
    newDeductions[index][name] = name === "amount" ? parseFloat(value) || 0 : value;
    setDeductions(newDeductions);
  };

  const addDeductionRow = () => {
    setDeductions((prev) => [...prev, { componentName: "", amount: 0 }]);
  };

  const removeDeductionRow = (index) => {
    setDeductions((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateGrossEarnings = () => {
    return earnings.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const calculateTotalDeductions = () => {
    return deductions.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const grossEarnings = calculateGrossEarnings();
  const totalDeductions = calculateTotalDeductions();
  const netPayable = grossEarnings - totalDeductions;

  const validateForm = () => {
    const newErrors = {};

    // Validate main form data
    try {
      monthlySalaryFormSchema.parse(formData);
    } catch (e) {
      if (e instanceof z.ZodError) {
        e.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
      }
    }

    // Conditionally validate paymentDate and paymentMode
    if (formData.paymentStatus === "Paid" || formData.paymentStatus === "Partial") {
      if (!formData.paymentDate) {
        newErrors.paymentDate = "Payment Date is required for Paid/Partial status";
      }
      if (!formData.paymentMode) {
        newErrors.paymentMode = "Payment Mode is required for Paid/Partial status";
      }
    }

    // Validate earnings
    if (earnings.length === 0) {
      newErrors.earnings = "At least one earning component is required.";
    } else {
      earnings.forEach((earning, index) => {
        try {
          earningSchema.parse(earning);
        } catch (e) {
          if (e instanceof z.ZodError) {
            e.errors.forEach((err) => {
              if (err.path.length > 0) {
                newErrors[`earning_${index}_${err.path[0]}`] = err.message;
              }
            });
          }
        }
      });
    }

    // Validate deductions
    if (deductions.length === 0) {
      newErrors.deductions = "At least one deduction component is required.";
    } else {
      deductions.forEach((deduction, index) => {
        try {
          deductionSchema.parse(deduction);
        } catch (e) {
          if (e instanceof z.ZodError) {
            e.errors.forEach((err) => {
              if (err.path.length > 0) {
                newErrors[`deduction_${index}_${err.path[0]}`] = err.message;
              }
            });
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (actionType) => (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(`Action: ${actionType}`);
      console.log("Form Data:", formData);
      console.log("Earnings:", earnings);
      console.log("Deductions:", deductions);
      console.log("Gross Earnings:", grossEarnings);
      console.log("Total Deductions:", totalDeductions);
      console.log("Net Payable:", netPayable);
      alert(`Monthly Salary data ${actionType.toLowerCase()} successfully! Check console for details.`);
    } else {
      alert("Please correct the errors in the form.");
    }
  };

  return (
    <form className="max-w-full mx-auto p-6 bg-white bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen space-y-8 mb-8 mr-4 ml-4">
      {/* 1. Basic Details */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Basic Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee Name */}
          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-2">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <select
              id="employeeName"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.employeeName ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Employee</option>
              {employeeMasterData.map((emp) => (
                <option key={emp.code} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
            {errors.employeeName && <p className="mt-1 text-sm text-red-600">{errors.employeeName}</p>}
          </div>
          {/* Employee Code */}
          <div>
            <label htmlFor="employeeCode" className="block text-sm font-medium text-gray-700 mb-2">
              Employee Code
            </label>
            <input
              type="text"
              id="employeeCode"
              name="employeeCode"
              value={formData.employeeCode}
              readOnly
              className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed border-gray-300"
            />
          </div>
          {/* Month & Year */}
          <div>
            <label htmlFor="monthYear" className="block text-sm font-medium text-gray-700 mb-2">
              Month & Year <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              id="monthYear"
              name="monthYear"
              value={formData.monthYear}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.monthYear ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.monthYear && <p className="mt-1 text-sm text-red-600">{errors.monthYear}</p>}
          </div>
          {/* Employee Type */}
          <div>
            <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700 mb-2">
              Employee Type
            </label>
            <input
              type="text"
              id="employeeType"
              name="employeeType"
              value={formData.employeeType}
              readOnly
              className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed border-gray-300"
            />
          </div>
          {/* Salary Structure */}
          <div className="md:col-span-2">
            <label htmlFor="salaryStructure" className="block text-sm font-medium text-gray-700 mb-2">
              Salary Structure
            </label>
            <input
              type="text"
              id="salaryStructure"
              name="salaryStructure"
              value={formData.salaryStructure}
              readOnly
              className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* 2. Attendance & Work Data */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Attendance & Work Data</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Working Days */}
          <div>
            <label htmlFor="totalWorkingDays" className="block text-sm font-medium text-gray-700 mb-2">
              Total Working Days
            </label>
            <input
              type="number"
              id="totalWorkingDays"
              name="totalWorkingDays"
              value={formData.totalWorkingDays}
              readOnly
              className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed border-gray-300"
            />
          </div>
          {/* Present Days */}
          <div>
            <label htmlFor="presentDays" className="block text-sm font-medium text-gray-700 mb-2">
              Present Days
            </label>
            <input
              type="number"
              id="presentDays"
              name="presentDays"
              value={formData.presentDays}
              readOnly
              className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed border-gray-300"
            />
          </div>
          {/* Paid Leave Days */}
          <div>
            <label htmlFor="paidLeaveDays" className="block text-sm font-medium text-gray-700 mb-2">
              Paid Leave Days
            </label>
            <input
              type="number"
              id="paidLeaveDays"
              name="paidLeaveDays"
              value={formData.paidLeaveDays}
              readOnly
              className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed border-gray-300"
            />
          </div>
          {/* Unpaid Leave Days / LOP Days */}
          <div>
            <label htmlFor="unpaidLeaveDays" className="block text-sm font-medium text-gray-700 mb-2">
              Unpaid Leave Days / LOP Days
            </label>
            <input
              type="number"
              id="unpaidLeaveDays"
              name="unpaidLeaveDays"
              value={formData.unpaidLeaveDays}
              readOnly
              className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed border-gray-300"
            />
          </div>
          {/* Overtime Hours */}
          <div>
            <label htmlFor="overtimeHours" className="block text-sm font-medium text-gray-700 mb-2">
              Overtime Hours
            </label>
            <input
              type="number"
              id="overtimeHours"
              name="overtimeHours"
              value={formData.overtimeHours}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.overtimeHours ? "border-red-500" : "border-gray-300"}`}
              placeholder="e.g., 10"
            />
            {errors.overtimeHours && <p className="mt-1 text-sm text-red-600">{errors.overtimeHours}</p>}
          </div>
          {/* Late Penalty */}
          <div>
            <label htmlFor="latePenalty" className="block text-sm font-medium text-gray-700 mb-2">
              Late Penalty (₹)
            </label>
            <input
              type="number"
              id="latePenalty"
              name="latePenalty"
              value={formData.latePenalty}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.latePenalty ? "border-red-500" : "border-gray-300"}`}
              placeholder="e.g., 500"
            />
            {errors.latePenalty && <p className="mt-1 text-sm text-red-600">{errors.latePenalty}</p>}
          </div>
        </div>
      </div>

      {/* 3. Earnings */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Earnings</h2>
          </div>
          <button
            type="button"
            onClick={addEarningRow}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Earning
          </button>
        </div>
        {earnings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Component Name <span className="text-red-500">*</span>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (₹) <span className="text-red-500">*</span>
                  </th>
                  <th scope="col" className="relative px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earnings.map((earning, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="componentName"
                        value={earning.componentName}
                        onChange={(e) => handleEarningsChange(index, e)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`earning_${index}_componentName`] ? "border-red-500" : "border-gray-300"}`}
                        placeholder="e.g., Basic"
                      />
                      {errors[`earning_${index}_componentName`] && <p className="mt-1 text-xs text-red-600">{errors[`earning_${index}_componentName`]}</p>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="amount"
                        value={earning.amount}
                        onChange={(e) => handleEarningsChange(index, e)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`earning_${index}_amount`] ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Amount"
                      />
                      {errors[`earning_${index}_amount`] && <p className="mt-1 text-xs text-red-600">{errors[`earning_${index}_amount`]}</p>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {earnings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEarningRow(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
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
        {errors.earnings && <p className="mt-2 text-sm text-red-600">{errors.earnings}</p>}
      </div>

      {/* 4. Deductions */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
              <MinusCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Deductions</h2>
          </div>
          <button
            type="button"
            onClick={addDeductionRow}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Deduction
          </button>
        </div>
        {deductions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Component Name <span className="text-red-500">*</span>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (₹) <span className="text-red-500">*</span>
                  </th>
                  <th scope="col" className="relative px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deductions.map((deduction, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="componentName"
                        value={deduction.componentName}
                        onChange={(e) => handleDeductionsChange(index, e)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`deduction_${index}_componentName`] ? "border-red-500" : "border-gray-300"}`}
                        placeholder="e.g., PF"
                      />
                      {errors[`deduction_${index}_componentName`] && <p className="mt-1 text-xs text-red-600">{errors[`deduction_${index}_componentName`]}</p>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="amount"
                        value={deduction.amount}
                        onChange={(e) => handleDeductionsChange(index, e)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`deduction_${index}_amount`] ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Amount"
                      />
                      {errors[`deduction_${index}_amount`] && <p className="mt-1 text-xs text-red-600">{errors[`deduction_${index}_amount`]}</p>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {deductions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDeductionRow(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
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
        {errors.deductions && <p className="mt-2 text-sm text-red-600">{errors.deductions}</p>}
      </div>

      {/* 5. Salary Summary */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-sky-500 rounded-lg flex items-center justify-center mr-3">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Salary Summary</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gross Earnings */}
          <div>
            <label htmlFor="grossEarnings" className="block text-sm font-medium text-gray-700 mb-2">
              Gross Earnings (₹)
            </label>
            <input
              type="text"
              id="grossEarnings"
              value={grossEarnings.toFixed(2)}
              readOnly
              className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed border-gray-300 font-semibold text-lg"
            />
          </div>
          {/* Total Deductions */}
          <div>
            <label htmlFor="totalDeductions" className="block text-sm font-medium text-gray-700 mb-2">
              Total Deductions (₹)
            </label>
            <input
              type="text"
              id="totalDeductions"
              value={totalDeductions.toFixed(2)}
              readOnly
              className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed border-gray-300 font-semibold text-lg"
            />
          </div>
          {/* Net Payable */}
          <div>
            <label htmlFor="netPayable" className="block text-sm font-medium text-gray-700 mb-2">
              Net Payable (₹)
            </label>
            <input
              type="text"
              id="netPayable"
              value={netPayable.toFixed(2)}
              readOnly
              className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed border-gray-300 font-bold text-lg text-green-700"
            />
          </div>
        </div>
      </div>

      {/* 6. Payment Status */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Status */}
          <div>
            <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status <span className="text-red-500">*</span>
            </label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.paymentStatus ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Status</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
            </select>
            {errors.paymentStatus && <p className="mt-1 text-sm text-red-600">{errors.paymentStatus}</p>}
          </div>
          {/* Payment Date */}
          <div>
            <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Date
            </label>
            <input
              type="date"
              id="paymentDate"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleInputChange}
              disabled={formData.paymentStatus !== "Paid" && formData.paymentStatus !== "Partial"}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.paymentDate ? "border-red-500" : "border-gray-300"} ${formData.paymentStatus !== "Paid" && formData.paymentStatus !== "Partial" ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
            {errors.paymentDate && <p className="mt-1 text-sm text-red-600">{errors.paymentDate}</p>}
          </div>
          {/* Payment Mode */}
          <div>
            <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Mode
            </label>
            <select
              id="paymentMode"
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleInputChange}
              disabled={formData.paymentStatus !== "Paid" && formData.paymentStatus !== "Partial"}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.paymentMode ? "border-red-500" : "border-gray-300"} ${formData.paymentStatus !== "Paid" && formData.paymentStatus !== "Partial" ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="">Select Mode</option>
              <option value="Bank">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
            </select>
            {errors.paymentMode && <p className="mt-1 text-sm text-red-600">{errors.paymentMode}</p>}
          </div>
          {/* Transaction Reference No. */}
          <div>
            <label htmlFor="transactionReferenceNo" className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Reference No.
            </label>
            <input
              type="text"
              id="transactionReferenceNo"
              name="transactionReferenceNo"
              value={formData.transactionReferenceNo}
              onChange={handleInputChange}
              disabled={formData.paymentStatus !== "Paid" && formData.paymentStatus !== "Partial"}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${formData.paymentStatus !== "Paid" && formData.paymentStatus !== "Partial" ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"}`}
              placeholder="e.g., TXN123456789"
            />
          </div>
        </div>
      </div>

      {/* 7. Other */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg flex items-center justify-center mr-3">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Other</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {/* Remarks / Notes */}
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
              Remarks / Notes
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 border-gray-300"
              placeholder="Add any relevant notes here..."
            ></textarea>
          </div>
          {/* Upload Supporting Document */}
          <div>
            <label htmlFor="supportingDocument" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Supporting Document
            </label>
            <input
              type="file"
              id="supportingDocument"
              name="supportingDocument"
              onChange={handleInputChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {formData.supportingDocument && (
              <p className="mt-2 text-sm text-gray-600">File selected: {formData.supportingDocument.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* 8. Actions */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={handleSubmit("Save as Draft")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" /> Save as Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit("Approve & Process")}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" /> Approve & Process
          </button>
          <button
            type="button"
            onClick={handleSubmit("Generate Payslip")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-xl hover:from-blue-700 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
          >
            <File className="w-5 h-5 mr-2" /> Generate Payslip (PDF)
          </button>
          <button
            type="button"
            onClick={handleSubmit("Send to Employee")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
          >
            <Mail className="w-5 h-5 mr-2" /> Send to Employee
          </button>
        </div>
      </div>
    </form>
  );
}
