// import { useState, useEffect, useMemo } from "react";
// import { z } from "zod";
// import { Plus, Trash2, Save, Paperclip, Tag, Calendar, Banknote, Wallet, List, Filter, TrendingUp, Edit, Eye, XCircle, MessageCircle, DollarSign } from 'lucide-react';

// // Zod schema for expense validation
// const expenseCategoryOptions = ["Utilities", "Travel", "Office Supplies", "Salary Advance", "Maintenance", "Marketing", "Miscellaneous"];
// const paymentModeOptions = ["Cash", "Bank Transfer", "UPI", "Card"];
// const paymentStatusOptions = ["Paid", "Unpaid", "Partial"];

// const expenseSchema = z.object({
//   title: z.string().min(1, "Expense Title is required"),
//   category: z.enum(expenseCategoryOptions, { message: "Please select a valid category" }),
//   vendor: z.string().optional(),
//   expenseDate: z.string().min(1, "Expense Date is required"),
//   paymentMode: z.enum(paymentModeOptions, { message: "Please select a valid payment mode" }),
//   referenceNo: z.string().optional(),
//   amount: z.number().min(0.01, "Amount must be greater than 0"),
//   taxPercent: z.number().min(0).max(100).optional().default(0),
//   taxAmount: z.number().optional(), // Calculated, not directly validated by Zod
//   totalAmount: z.number().optional(), // Calculated, not directly validated by Zod
//   currency: z.string().default("INR"),
//   supportingDocument: z.any().optional(), // For file input
//   notes: z.string().optional(),
//   status: z.enum(paymentStatusOptions, { message: "Payment Status is required" }),
//   paymentDate: z.string().optional(),
//   transactionRefNo: z.string().optional(),
// }).superRefine((data, ctx) => {
//   if (data.status === "Paid" && !data.paymentDate) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "Payment Date is required if status is Paid",
//       path: ["paymentDate"],
//     });
//   }
// });

// export default function Expenses() {
//   const [expenses, setExpenses] = useState([]); // List of all expenses
//   const [formData, setFormData] = useState({ // Current form data
//     title: '',
//     category: '',
//     vendor: '',
//     expenseDate: new Date().toISOString().split('T')[0],
//     paymentMode: '',
//     referenceNo: '',
//     amount: 0,
//     taxPercent: 0,
//     taxAmount: 0,
//     totalAmount: 0,
//     currency: 'INR',
//     supportingDocument: null,
//     notes: '',
//     status: 'Unpaid',
//     paymentDate: '',
//     transactionRefNo: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);

//   // Filters for the list view
//   const [filters, setFilters] = useState({
//     dateRangeStart: '',
//     dateRangeEnd: '',
//     category: '',
//     vendor: '',
//     paymentStatus: '',
//     amountMin: '',
//     amountMax: '',
//   });

//   // Helper function to format currency
//   const formatCurrency = (amount) => {
//     return `₹${(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   // Calculate taxAmount and totalAmount whenever amount or taxPercent changes
//   useEffect(() => {
//     const amount = parseFloat(formData.amount) || 0;
//     const taxPercent = parseFloat(formData.taxPercent) || 0;
//     const calculatedTaxAmount = amount * (taxPercent / 100);
//     const calculatedTotalAmount = amount + calculatedTaxAmount;

//     setFormData(prev => ({
//       ...prev,
//       taxAmount: calculatedTaxAmount,
//       totalAmount: calculatedTotalAmount,
//     }));
//   }, [formData.amount, formData.taxPercent]);

//   // Handle form input changes
//   const handleFormChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === 'file') {
//       setFormData(prev => ({ ...prev, [name]: files[0] }));
//     } else if (type === 'number') {
//       setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   // Reset form to initial state
//   const resetForm = () => {
//     setFormData({
//       title: '',
//       category: '',
//       vendor: '',
//       expenseDate: new Date().toISOString().split('T')[0],
//       paymentMode: '',
//       referenceNo: '',
//       amount: 0,
//       taxPercent: 0,
//       taxAmount: 0,
//       totalAmount: 0,
//       currency: 'INR',
//       supportingDocument: null,
//       notes: '',
//       status: 'Unpaid',
//       paymentDate: '',
//       transactionRefNo: '',
//     });
//     setErrors({});
//     setIsEditing(false);
//     setEditIndex(null);
//   };

//   // Validate and save/update expense
//   const validateAndSave = (saveAndAddAnother = false) => {
//     try {
//       const validatedData = expenseSchema.parse(formData);
//       setErrors({});

//       if (isEditing) {
//         const updatedExpenses = [...expenses];
//         updatedExpenses[editIndex] = validatedData;
//         setExpenses(updatedExpenses);
//         alert("Expense updated successfully!");
//       } else {
//         setExpenses(prev => [...prev, validatedData]);
//         alert("Expense saved successfully!");
//       }

//       if (saveAndAddAnother) {
//         resetForm();
//       } else {
//         resetForm(); // For now, just reset the form after saving
//       }
//       return true;
//     } catch (e) {
//       const newErrors = {};
//       e.errors.forEach(err => {
//         newErrors[err.path[0]] = err.message;
//       });
//       setErrors(newErrors);
//       alert("Please correct the errors in the form.");
//       return false;
//     }
//   };

//   const handleSaveExpense = (e) => {
//     e.preventDefault();
//     validateAndSave(false);
//   };

//   const handleSaveAndAddAnother = (e) => {
//     e.preventDefault();
//     validateAndSave(true);
//   };

//   const handleCancel = () => {
//     resetForm();
//   };

//   // Handle filter input changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   // Filter expenses based on current filter criteria
//   const filteredExpenses = useMemo(() => {
//     return expenses.filter(expense => {
//       const expenseDate = new Date(expense.expenseDate);
//       const startDate = filters.dateRangeStart ? new Date(filters.dateRangeStart) : null;
//       const endDate = filters.dateRangeEnd ? new Date(filters.dateRangeEnd) : null;
//       const amount = parseFloat(expense.totalAmount);
//       const minAmount = parseFloat(filters.amountMin) || 0;
//       const maxAmount = parseFloat(filters.amountMax) || Infinity;

//       return (
//         (!startDate || expenseDate >= startDate) &&
//         (!endDate || expenseDate <= endDate) &&
//         (!filters.category || expense.category === filters.category) &&
//         (!filters.vendor || expense.vendor.toLowerCase().includes(filters.vendor.toLowerCase())) &&
//         (!filters.paymentStatus || expense.status === filters.paymentStatus) &&
//         (amount >= minAmount && amount <= maxAmount)
//       );
//     });
//   }, [expenses, filters]);

//   // Set form data for editing an existing expense
//   const handleViewEditExpense = (index) => {
//     setFormData({ ...expenses[index] }); // Create a copy to avoid direct state mutation
//     setIsEditing(true);
//     setEditIndex(index);
//     window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to show form
//   };

//   // Delete an expense from the list
//   const handleDeleteExpense = (index) => {
//     if (confirm("Are you sure you want to delete this expense?")) {
//       setExpenses(prev => prev.filter((_, i) => i !== index));
//       alert("Expense deleted successfully!");
//     }
//   };

//   // Calculate summary totals and top categories
//   const summaryTotals = useMemo(() => {
//     const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.totalAmount || 0), 0);
//     const paidExpenses = expenses.filter(exp => exp.status === 'Paid').reduce((sum, exp) => sum + (exp.totalAmount || 0), 0);
//     const unpaidExpenses = expenses.filter(exp => exp.status === 'Unpaid').reduce((sum, exp) => sum + (exp.totalAmount || 0), 0);

//     // Top 5 Expense Categories for chart
//     const categoryAmounts = expenses.reduce((acc, exp) => {
//       acc[exp.category] = (acc[exp.category] || 0) + (exp.totalAmount || 0);
//       return acc;
//     }, {});

//     const sortedCategories = Object.entries(categoryAmounts)
//       .sort(([, amountA], [, amountB]) => amountB - amountA)
//       .slice(0, 5);

//     return {
//       totalExpenses,
//       paidExpenses,
//       unpaidExpenses,
//       topCategories: sortedCategories,
//     };
//   }, [expenses]);

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
//       {/* Main Content Area */}
//       <main className="p-6 ml-4 mr-4">
//         <div className="max-w-full mx-auto">
//           {/* Page Title */}
//           <div className="mb-8">
//             {/* <h1 className="text-4xl font-bold text-gray-900 mb-2">{isEditing ? "Edit Expense" : "Add New Expense"}</h1> */}
//             {/* <p className="text-gray-600">Enter details for your expense records</p> */}
//           </div>

//           <form onSubmit={handleSaveExpense} className="space-y-8">
//             {/* Section 1: Basic Details */}
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
//                   <Tag className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Basic Details</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Expense Title <span className="text-red-500">*</span></label>
//                   <input
//                     type="text"
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleFormChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                     placeholder="e.g., Internet Bill, Office Supplies"
//                   />
//                   {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
//                 </div>
//                 <div>
//                   <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Expense Category <span className="text-red-500">*</span></label>
//                   <select
//                     id="category"
//                     name="category"
//                     value={formData.category}
//                     onChange={handleFormChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                   >
//                     <option value="">Select Category</option>
//                     {expenseCategoryOptions.map(cat => (
//                       <option key={cat} value={cat}>{cat}</option>
//                     ))}
//                   </select>
//                   {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
//                 </div>
//                 <div>
//                   <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-2">Vendor / Payee</label>
//                   <input
//                     type="text"
//                     id="vendor"
//                     name="vendor"
//                     value={formData.vendor}
//                     onChange={handleFormChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                     placeholder="e.g., Airtel, Amazon"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700 mb-2">Expense Date <span className="text-red-500">*</span></label>
//                   <input
//                     type="date"
//                     id="expenseDate"
//                     name="expenseDate"
//                     value={formData.expenseDate}
//                     onChange={handleFormChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                   />
//                   {errors.expenseDate && <p className="text-red-500 text-xs mt-1">{errors.expenseDate}</p>}
//                 </div>
//                 <div>
//                   <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-2">Payment Mode <span className="text-red-500">*</span></label>
//                   <select
//                     id="paymentMode"
//                     name="paymentMode"
//                     value={formData.paymentMode}
//                     onChange={handleFormChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                   >
//                     <option value="">Select Payment Mode</option>
//                     {paymentModeOptions.map(mode => (
//                       <option key={mode} value={mode}>{mode}</option>
//                     ))}
//                   </select>
//                   {errors.paymentMode && <p className="text-red-500 text-xs mt-1">{errors.paymentMode}</p>}
//                 </div>
//                 <div>
//                   <label htmlFor="referenceNo" className="block text-sm font-medium text-gray-700 mb-2">Reference / Bill No.</label>
//                   <input
//                     type="text"
//                     id="referenceNo"
//                     name="referenceNo"
//                     value={formData.referenceNo}
//                     onChange={handleFormChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                     placeholder="Optional"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Section 2: Amount Details */}
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
//                   <DollarSign className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Amount Details</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div>
//                   <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) <span className="text-red-500">*</span></label>
//                   <input
//                     type="number"
//                     id="amount"
//                     name="amount"
//                     value={formData.amount}
//                     onChange={handleFormChange}
//                     min="0.01"
//                     step="0.01"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                   />
//                   {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
//                 </div>
//                 <div>
//                   <label htmlFor="taxPercent" className="block text-sm font-medium text-gray-700 mb-2">Tax %</label>
//                   <input
//                     type="number"
//                     id="taxPercent"
//                     name="taxPercent"
//                     value={formData.taxPercent}
//                     onChange={handleFormChange}
//                     min="0"
//                     max="100"
//                     step="0.01"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="taxAmount" className="block text-sm font-medium text-gray-700 mb-2">Tax Amount</label>
//                   <input
//                     type="text"
//                     id="taxAmount"
//                     name="taxAmount"
//                     value={formatCurrency(formData.taxAmount)}
//                     readOnly
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
//                   <input
//                     type="text"
//                     id="totalAmount"
//                     name="totalAmount"
//                     value={formatCurrency(formData.totalAmount)}
//                     readOnly
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
//                   <input
//                     type="text"
//                     id="currency"
//                     name="currency"
//                     value={formData.currency}
//                     readOnly
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Section 3: Supporting Documents & Notes */}
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
//                   <Paperclip className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Supporting Documents & Notes</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="supportingDocument" className="block text-sm font-medium text-gray-700 mb-2">Upload Bill / Receipt (PDF, JPG, PNG)</label>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="file"
//                       id="supportingDocument"
//                       name="supportingDocument"
//                       onChange={handleFormChange}
//                       className="hidden"
//                       accept=".pdf,.jpg,.jpeg,.png"
//                     />
//                     <label
//                       htmlFor="supportingDocument"
//                       className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 flex items-center"
//                     >
//                       <Paperclip className="w-4 h-4 mr-2" /> Choose File
//                     </label>
//                     {formData.supportingDocument && (
//                       <span className="text-sm text-gray-600">{formData.supportingDocument.name}</span>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Notes / Remarks</label>
//                   <textarea
//                     id="notes"
//                     name="notes"
//                     value={formData.notes}
//                     onChange={handleFormChange}
//                     rows="3"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
//                     placeholder="Any additional notes..."
//                   ></textarea>
//                 </div>
//               </div>
//             </div>

//             {/* Section 4: Payment Status */}
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mr-3">
//                   <Wallet className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Payment Status</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div>
//                   <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status <span className="text-red-500">*</span></label>
//                   <select
//                     id="status"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleFormChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                   >
//                     {paymentStatusOptions.map(status => (
//                       <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                   {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
//                 </div>
//                 {(formData.status === 'Paid' || formData.status === 'Partial') && (
//                   <>
//                     <div>
//                       <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
//                       <input
//                         type="date"
//                         id="paymentDate"
//                         name="paymentDate"
//                         value={formData.paymentDate}
//                         onChange={handleFormChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                       />
//                       {errors.paymentDate && <p className="text-red-500 text-xs mt-1">{errors.paymentDate}</p>}
//                     </div>
//                     <div>
//                       <label htmlFor="transactionRefNo" className="block text-sm font-medium text-gray-700 mb-2">Transaction Reference No.</label>
//                       <input
//                         type="text"
//                         id="transactionRefNo"
//                         name="transactionRefNo"
//                         value={formData.transactionRefNo}
//                         onChange={handleFormChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//                         placeholder="Optional"
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex flex-wrap gap-4 justify-end">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
//               >
//                 <XCircle className="inline-block w-5 h-5 mr-2" /> Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSaveAndAddAnother}
//                 className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
//               >
//                 <Plus className="inline-block w-5 h-5 mr-2" /> Save & Add Another
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
//               >
//                 <Save className="inline-block w-5 h-5 mr-2" /> {isEditing ? "Update Expense" : "Save Expense"}
//               </button>
//             </div>
//           </form>

//           {/* Expenses List (Admin View) */}
//           <div className="mt-12 bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center mb-6">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mr-3">
//                 <List className="w-5 h-5 text-white" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-900">Expenses List (Admin View)</h2>
//             </div>

//             {/* Filters */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               <div>
//                 <label htmlFor="filterDateStart" className="block text-sm font-medium text-gray-700 mb-2">Date Range (Start)</label>
//                 <input type="date" id="filterDateStart" name="dateRangeStart" value={filters.dateRangeStart} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
//               </div>
//               <div>
//                 <label htmlFor="filterDateEnd" className="block text-sm font-medium text-gray-700 mb-2">Date Range (End)</label>
//                 <input type="date" id="filterDateEnd" name="dateRangeEnd" value={filters.dateRangeEnd} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
//               </div>
//               <div>
//                 <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                 <select id="filterCategory" name="category" value={filters.category} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                   <option value="">All Categories</option>
//                   {expenseCategoryOptions.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="filterVendor" className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
//                 <input type="text" id="filterVendor" name="vendor" value={filters.vendor} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Search Vendor" />
//               </div>
//               <div>
//                 <label htmlFor="filterPaymentStatus" className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
//                 <select id="filterPaymentStatus" name="paymentStatus" value={filters.paymentStatus} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                   <option value="">All Statuses</option>
//                   {paymentStatusOptions.map(status => (
//                     <option key={status} value={status}>{status}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="filterAmountMin" className="block text-sm font-medium text-gray-700 mb-2">Amount Min (₹)</label>
//                 <input type="number" id="filterAmountMin" name="amountMin" value={filters.amountMin} onChange={handleFilterChange} min="0" step="0.01" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
//               </div>
//               <div>
//                 <label htmlFor="filterAmountMax" className="block text-sm font-medium text-gray-700 mb-2">Amount Max (₹)</label>
//                 <input type="number" id="filterAmountMax" name="amountMax" value={filters.amountMax} onChange={handleFilterChange} min="0" step="0.01" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
//               </div>
//             </div>

//             {/* Expenses Table */}
//             {filteredExpenses.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense Title</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredExpenses.map((expense, index) => (
//                       <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
//                         <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">{expense.title}</td>
//                         <td className="p-2 whitespace-nowrap text-sm text-gray-500">{expense.expenseDate}</td>
//                         <td className="p-2 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
//                         <td className="p-2 whitespace-nowrap text-sm text-gray-500">{expense.vendor || '-'}</td>
//                         <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(expense.totalAmount)}</td>
//                         <td className="p-2 whitespace-nowrap text-sm text-gray-500">{expense.paymentMode}</td>
//                         <td className="p-2 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             expense.status === 'Paid' ? 'bg-green-100 text-green-800' :
//                             expense.status === 'Unpaid' ? 'bg-red-100 text-red-800' :
//                             'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {expense.status}
//                           </span>
//                         </td>
//                         <td className="p-2 whitespace-nowrap text-center">
//                           <div className="flex items-center space-x-2">
//                             <button
//                               type="button"
//                               onClick={() => handleViewEditExpense(expenses.indexOf(expense))} // Use original index for editing
//                               className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
//                               title="Edit Expense"
//                             >
//                               <Edit className="w-4 h-4" />
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => handleDeleteExpense(expenses.indexOf(expense))} // Use original index for deleting
//                               className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200"
//                               title="Delete Expense"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                 <p className="text-lg font-medium">No expenses found</p>
//                 <p className="text-sm">Adjust your filters or add new expenses.</p>
//               </div>
//             )}
//           </div>

//           {/* Summary Section */}
//           <div className="mt-8 bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center mb-6">
//               <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-lime-600 rounded-lg flex items-center justify-center mr-3">
//                 <TrendingUp className="w-5 h-5 text-white" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//               <div className="bg-gray-50 rounded-xl p-4 text-center">
//                 <p className="text-sm font-medium text-gray-700">Total Expenses</p>
//                 <p className="text-2xl font-bold text-gray-900">{formatCurrency(summaryTotals.totalExpenses)}</p>
//               </div>
//               <div className="bg-gray-50 rounded-xl p-4 text-center">
//                 <p className="text-sm font-medium text-gray-700">Paid</p>
//                 <p className="text-2xl font-bold text-green-600">{formatCurrency(summaryTotals.paidExpenses)}</p>
//               </div>
//               <div className="bg-gray-50 rounded-xl p-4 text-center">
//                 <p className="text-sm font-medium text-gray-700">Unpaid</p>
//                 <p className="text-2xl font-bold text-red-600">{formatCurrency(summaryTotals.unpaidExpenses)}</p>
//               </div>
//             </div>

//             {/* Top 5 Expense Categories Chart (simple representation) */}
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Expense Categories</h3>
//             {summaryTotals.topCategories.length > 0 && summaryTotals.totalExpenses > 0 ? (
//               <div className="space-y-3">
//                 {summaryTotals.topCategories.map(([category, amount], index) => (
//                   <div key={category} className="flex items-center">
//                     <div className="w-32 text-sm text-gray-700 font-medium">{category}</div>
//                     <div className="flex-grow bg-gray-200 rounded-full h-4 relative">
//                       <div
//                         className="bg-indigo-500 h-full rounded-full"
//                         style={{ width: `${(amount / summaryTotals.totalExpenses) * 100}%` }}
//                       ></div>
//                     </div>
//                     <div className="ml-4 text-sm font-semibold text-gray-900">{formatCurrency(amount)}</div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-4 text-gray-500">
//                 <p className="text-sm">No expense data to display categories.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }





import { useState, useEffect, useMemo } from "react"
import {
  Search,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  DollarSign,
  Receipt,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ExpenseTable() {
  // Sample expense data
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: "Internet Bill",
      category: "Utilities",
      vendor: "Airtel",
      expenseDate: "2024-01-15",
      paymentMode: "UPI",
      referenceNo: "REF001",
      amount: 1200.0,
      taxPercent: 18,
      taxAmount: 216.0,
      totalAmount: 1416.0,
      status: "Paid",
      paymentDate: "2024-01-15",
      transactionRefNo: "TXN123456",
      notes: "Monthly internet bill",
    },
    {
      id: 2,
      title: "Office Supplies",
      category: "Office Supplies",
      vendor: "Amazon",
      expenseDate: "2024-01-20",
      paymentMode: "Card",
      referenceNo: "REF002",
      amount: 2500.0,
      taxPercent: 12,
      taxAmount: 300.0,
      totalAmount: 2800.0,
      status: "Pending",
      paymentDate: "",
      transactionRefNo: "",
      notes: "Stationery and printer paper",
    },
    {
      id: 3,
      title: "Travel Expenses",
      category: "Travel",
      vendor: "Uber",
      expenseDate: "2024-01-10",
      paymentMode: "Cash",
      referenceNo: "REF003",
      amount: 850.0,
      taxPercent: 5,
      taxAmount: 42.5,
      totalAmount: 892.5,
      status: "Paid",
      paymentDate: "2024-01-10",
      transactionRefNo: "TXN789012",
      notes: "Client meeting travel",
    },
    {
      id: 4,
      title: "Marketing Campaign",
      category: "Marketing",
      vendor: "Google Ads",
      expenseDate: "2024-01-25",
      paymentMode: "Bank Transfer",
      referenceNo: "REF004",
      amount: 15000.0,
      taxPercent: 18,
      taxAmount: 2700.0,
      totalAmount: 17700.0,
      status: "Unpaid",
      paymentDate: "",
      transactionRefNo: "",
      notes: "Q1 digital marketing campaign",
    },
    {
      id: 5,
      title: "Equipment Maintenance",
      category: "Maintenance",
      vendor: "TechCorp",
      expenseDate: "2024-01-30",
      paymentMode: "UPI",
      referenceNo: "REF005",
      amount: 3200.0,
      taxPercent: 18,
      taxAmount: 576.0,
      totalAmount: 3776.0,
      status: "Paid",
      paymentDate: "2024-01-30",
      transactionRefNo: "TXN345678",
      notes: "Server maintenance",
    },
    {
      id: 6,
      title: "Salary Advance",
      category: "Salary Advance",
      vendor: "Employee",
      expenseDate: "2024-02-01",
      paymentMode: "Bank Transfer",
      referenceNo: "REF006",
      amount: 25000.0,
      taxPercent: 0,
      taxAmount: 0.0,
      totalAmount: 25000.0,
      status: "Paid",
      paymentDate: "2024-02-01",
      transactionRefNo: "TXN901234",
      notes: "Employee advance payment",
    },
  ])

  // Table state
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedExpenses, setSelectedExpenses] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Modal state
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [expenseToDelete, setExpenseToDelete] = useState(null)

  // Navigation state for expense details page
  const [currentView, setCurrentView] = useState("table") // 'table' or 'details'
  const [viewingExpense, setViewingExpense] = useState(null)

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    const filtered = expenses.filter((expense) => {
      const matchesSearch =
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !statusFilter || expense.status === statusFilter
      const matchesCategory = !categoryFilter || expense.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })

    // Sort expenses
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue, bValue

        switch (sortColumn) {
          case "title":
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          case "category":
            aValue = a.category.toLowerCase()
            bValue = b.category.toLowerCase()
            break
          case "vendor":
            aValue = a.vendor.toLowerCase()
            bValue = b.vendor.toLowerCase()
            break
          case "expenseDate":
            aValue = new Date(a.expenseDate)
            bValue = new Date(b.expenseDate)
            break
          case "totalAmount":
            aValue = a.totalAmount
            bValue = b.totalAmount
            break
          case "status":
            aValue = a.status
            bValue = b.status
            break
          default:
            return 0
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [expenses, searchTerm, statusFilter, categoryFilter, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex)

  // Helper functions
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Unpaid":
        return "bg-red-100 text-red-800"
      case "Partial":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedExpenses(currentExpenses.map((exp) => exp.id))
    } else {
      setSelectedExpenses([])
    }
  }

  const handleSelectExpense = (id, checked) => {
    if (checked) {
      setSelectedExpenses([...selectedExpenses, id])
    } else {
      setSelectedExpenses(selectedExpenses.filter((expId) => expId !== id))
      setSelectAll(false)
    }
  }

  const viewExpense = (id) => {
    const expense = expenses.find((exp) => exp.id === id)
    setSelectedExpense(expense)
    setExpenseModalOpen(true)
  }

  const navigateToExpenseDetails = (id) => {
    const expense = expenses.find((exp) => exp.id === id)
    setViewingExpense(expense)
    setCurrentView("details")
  }

  const navigateBackToTable = () => {
    setCurrentView("table")
    setViewingExpense(null)
  }

  const confirmDelete = () => {
    if (expenseToDelete) {
      setExpenses(expenses.filter((exp) => exp.id !== expenseToDelete.id))
      setDeleteModalOpen(false)
      setExpenseToDelete(null)
    }
  }

  const exportExpenses = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,Category,Vendor,Date,Amount,Tax,Total,Status,Payment Mode\\n" +
      filteredExpenses
        .map(
          (exp) =>
            `"${exp.title}","${exp.category}","${exp.vendor}","${exp.expenseDate}","${formatCurrency(exp.amount)}","${formatCurrency(exp.taxAmount)}","${formatCurrency(exp.totalAmount)}","${exp.status}","${exp.paymentMode}"`,
        )
        .join("\\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "expenses.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const deleteExpense = (id) => {
    const expense = expenses.find((exp) => exp.id === id)
    setExpenseToDelete(expense)
    setDeleteModalOpen(true)
  }
  const navigate = useNavigate()

  const handleAddExpress = () => {
    navigate("/purchase/addexpenses")
  }
  // Calculate stats
  const totalExpenses = expenses.length
  const paidExpenses = expenses.filter((exp) => exp.status === "Paid").length
  const pendingExpenses = expenses.filter((exp) => exp.status === "Pending").length
  const unpaidExpenses = expenses.filter((exp) => exp.status === "Unpaid").length
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.totalAmount, 0)
  const paidAmount = expenses.filter((exp) => exp.status === "Paid").reduce((sum, exp) => sum + exp.totalAmount, 0)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, categoryFilter])

  if (currentView === "details" && viewingExpense) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={navigateBackToTable}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Expense Details</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button className="text-gray-400 hover:text-gray-600 p-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">All Expenses</h2>
                <button  className="px-3 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Expense List Item */}
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{viewingExpense.title}</h3>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(viewingExpense.totalAmount)}</span>
                </div>
                <p className="text-sm text-gray-500">{new Date(viewingExpense.expenseDate).toLocaleDateString()}</p>
                <div className="flex items-center justify-end mt-2">
                  <span className="text-xs text-gray-400">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 p-6">
            {/* Expense Amount Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Amount</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-red-500">{formatCurrency(viewingExpense.totalAmount)}</span>
                <span className="text-gray-500 ml-2">
                  on {new Date(viewingExpense.expenseDate).toLocaleDateString()}
                </span>
              </div>
              <div className="text-gray-600 mb-4">NON-BILLABLE</div>

              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
                {viewingExpense.category}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Ref #</label>
                  <p className="text-gray-900">{viewingExpense.referenceNo}</p>
                </div>

                <div>
                  <p className="text-gray-700">{viewingExpense.notes}</p>
                </div>
              </div>
            </div>

            {/* Upload Files Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
              <div className="mb-4 flex items-center justify-center space-x-3">
  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
    <svg
      className="w-6 h-6 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  </div>
  <h4 className="text-lg font-medium text-gray-900">Upload your Files</h4>
</div>



                

                <div className="flex justify-center space-x-4 mb-4">
                  <div className="w-16 h-20 bg-gray-100 rounded border-2 border-dashed border-gray-300"></div>

                </div>

                <p className="text-sm text-gray-500">1 of 1 Files</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6 ml-4 mr-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
          {/* Total Expenses */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-900">{totalExpenses}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+2</span> this month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Paid Expenses */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-3xl font-bold text-gray-900">{paidExpenses}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">{formatCurrency(paidAmount)}</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Pending Expenses */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{pendingExpenses}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  <span className="font-medium">Awaiting approval</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                <p className="text-sm text-blue-600 mt-1">
                  <span className="font-medium">All expenses</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Utilities">Utilities</option>
                <option value="Travel">Travel</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Salary Advance">Salary Advance</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Marketing">Marketing</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={exportExpenses}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Export
              </button>
              <button 
              onClick={handleAddExpress}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                <Plus className="inline-block w-5 h-5 mr-2" />
                Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* Expense Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Expenses</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Showing</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number.parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th
                    onClick={() => handleSort("title")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Expense Title
                  </th>
                  <th
                    onClick={() => handleSort("category")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Category
                  </th>
                  <th
                    onClick={() => handleSort("vendor")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Vendor
                  </th>
                  <th
                    onClick={() => handleSort("expenseDate")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Date
                  </th>
                  <th
                    onClick={() => handleSort("totalAmount")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Amount
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedExpenses.includes(expense.id)}
                        onChange={(e) => handleSelectExpense(expense.id, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                        onClick={() => navigateToExpenseDetails(expense.id)}
                      >
                        {expense.title}
                      </div>
                      <div className="text-sm text-gray-500">{expense.referenceNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{expense.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {expense.vendor
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{expense.vendor}</div>
                          <div className="text-sm text-gray-500">{expense.paymentMode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.expenseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(expense.totalAmount)}</div>
                      <div className="text-sm text-gray-500">Tax: {formatCurrency(expense.taxAmount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}
                      >
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewExpense(expense.id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span>{startIndex + 1}</span> to <span>{Math.min(endIndex, filteredExpenses.length)}</span> of{" "}
                <span>{filteredExpenses.length}</span> entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 border rounded-lg ${
                          page === currentPage
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Expense Details Modal */}
      {expenseModalOpen && selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Expense Details</h3>
                  <button onClick={() => setExpenseModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Expense Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Title</label>
                        <p className="text-gray-900">{selectedExpense.title}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Category</label>
                        <p className="text-gray-900">{selectedExpense.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Expense Date</label>
                        <p className="text-gray-900">{new Date(selectedExpense.expenseDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Reference No</label>
                        <p className="text-gray-900">{selectedExpense.referenceNo || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Payment Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Vendor</label>
                        <p className="text-gray-900">{selectedExpense.vendor}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment Mode</label>
                        <p className="text-gray-900">{selectedExpense.paymentMode}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedExpense.status)}`}
                        >
                          {selectedExpense.status}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total Amount</label>
                        <p className="text-2xl font-bold text-indigo-600">
                          {formatCurrency(selectedExpense.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount Breakdown */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Amount Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-500">Base Amount</label>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedExpense.amount)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-gray-500">Tax ({selectedExpense.taxPercent}%)</label>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedExpense.taxAmount)}</p>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-4">
                      <label className="text-sm font-medium text-indigo-600">Total Amount</label>
                      <p className="text-lg font-semibold text-indigo-900">
                        {formatCurrency(selectedExpense.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedExpense.notes && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Notes</h4>
                    <p className="text-gray-700">{selectedExpense.notes}</p>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Edit Expense
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Download Receipt
                  </button>
                  <button
                    onClick={() => setExpenseModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Expense</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete expense <span className="font-semibold">{expenseToDelete.title}</span>
                  ? This will permanently remove the expense from the system.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
