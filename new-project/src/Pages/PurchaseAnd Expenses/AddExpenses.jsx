import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { Plus, Trash2, Save, Paperclip, Tag, Calendar, Banknote, Wallet, List, Filter, TrendingUp, Edit, Eye, XCircle, MessageCircle, DollarSign } from 'lucide-react';

// Zod schema for expense validation
const expenseCategoryOptions = ["Utilities", "Travel", "Office Supplies", "Salary Advance", "Maintenance", "Marketing", "Miscellaneous"];
const paymentModeOptions = ["Cash", "Bank Transfer", "UPI", "Card"];
const paymentStatusOptions = ["Paid", "Unpaid", "Partial"];

const expenseSchema = z.object({
  title: z.string().min(1, "Expense Title is required"),
  category: z.enum(expenseCategoryOptions, { message: "Please select a valid category" }),
  vendor: z.string().optional(),
  expenseDate: z.string().min(1, "Expense Date is required"),
  paymentMode: z.enum(paymentModeOptions, { message: "Please select a valid payment mode" }),
  referenceNo: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  taxPercent: z.number().min(0).max(100).optional().default(0),
  taxAmount: z.number().optional(), // Calculated, not directly validated by Zod
  totalAmount: z.number().optional(), // Calculated, not directly validated by Zod
  currency: z.string().default("INR"),
  supportingDocument: z.any().optional(), // For file input
  notes: z.string().optional(),
  status: z.enum(paymentStatusOptions, { message: "Payment Status is required" }),
  paymentDate: z.string().optional(),
  transactionRefNo: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.status === "Paid" && !data.paymentDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Payment Date is required if status is Paid",
      path: ["paymentDate"],
    });
  }
});

export default function AddExpenses() {
  const [expenses, setExpenses] = useState([]); // List of all expenses
  const [formData, setFormData] = useState({ // Current form data
    title: '',
    category: '',
    vendor: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMode: '',
    referenceNo: '',
    amount: 0,
    taxPercent: 0,
    taxAmount: 0,
    totalAmount: 0,
    currency: 'INR',
    supportingDocument: null,
    notes: '',
    status: 'Unpaid',
    paymentDate: '',
    transactionRefNo: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Filters for the list view
  const [filters, setFilters] = useState({
    dateRangeStart: '',
    dateRangeEnd: '',
    category: '',
    vendor: '',
    paymentStatus: '',
    amountMin: '',
    amountMax: '',
  });

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate taxAmount and totalAmount whenever amount or taxPercent changes
  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0;
    const taxPercent = parseFloat(formData.taxPercent) || 0;
    const calculatedTaxAmount = amount * (taxPercent / 100);
    const calculatedTotalAmount = amount + calculatedTaxAmount;

    setFormData(prev => ({
      ...prev,
      taxAmount: calculatedTaxAmount,
      totalAmount: calculatedTotalAmount,
    }));
  }, [formData.amount, formData.taxPercent]);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      vendor: '',
      expenseDate: new Date().toISOString().split('T')[0],
      paymentMode: '',
      referenceNo: '',
      amount: 0,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount: 0,
      currency: 'INR',
      supportingDocument: null,
      notes: '',
      status: 'Unpaid',
      paymentDate: '',
      transactionRefNo: '',
    });
    setErrors({});
    setIsEditing(false);
    setEditIndex(null);
  };

  // Validate and save/update expense
  const validateAndSave = (saveAndAddAnother = false) => {
    try {
      const validatedData = expenseSchema.parse(formData);
      setErrors({});

      if (isEditing) {
        const updatedExpenses = [...expenses];
        updatedExpenses[editIndex] = validatedData;
        setExpenses(updatedExpenses);
        alert("Expense updated successfully!");
      } else {
        setExpenses(prev => [...prev, validatedData]);
        alert("Expense saved successfully!");
      }

      if (saveAndAddAnother) {
        resetForm();
      } else {
        resetForm(); // For now, just reset the form after saving
      }
      return true;
    } catch (e) {
      const newErrors = {};
      e.errors.forEach(err => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      alert("Please correct the errors in the form.");
      return false;
    }
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    validateAndSave(false);
  };

  const handleSaveAndAddAnother = (e) => {
    e.preventDefault();
    validateAndSave(true);
  };

  const handleCancel = () => {
    resetForm();
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Filter expenses based on current filter criteria
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.expenseDate);
      const startDate = filters.dateRangeStart ? new Date(filters.dateRangeStart) : null;
      const endDate = filters.dateRangeEnd ? new Date(filters.dateRangeEnd) : null;
      const amount = parseFloat(expense.totalAmount);
      const minAmount = parseFloat(filters.amountMin) || 0;
      const maxAmount = parseFloat(filters.amountMax) || Infinity;

      return (
        (!startDate || expenseDate >= startDate) &&
        (!endDate || expenseDate <= endDate) &&
        (!filters.category || expense.category === filters.category) &&
        (!filters.vendor || expense.vendor.toLowerCase().includes(filters.vendor.toLowerCase())) &&
        (!filters.paymentStatus || expense.status === filters.paymentStatus) &&
        (amount >= minAmount && amount <= maxAmount)
      );
    });
  }, [expenses, filters]);

  // Set form data for editing an existing expense
  const handleViewEditExpense = (index) => {
    setFormData({ ...expenses[index] }); // Create a copy to avoid direct state mutation
    setIsEditing(true);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to show form
  };

  // Delete an expense from the list
  const handleDeleteExpense = (index) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setExpenses(prev => prev.filter((_, i) => i !== index));
      alert("Expense deleted successfully!");
    }
  };

  // Calculate summary totals and top categories
  const summaryTotals = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.totalAmount || 0), 0);
    const paidExpenses = expenses.filter(exp => exp.status === 'Paid').reduce((sum, exp) => sum + (exp.totalAmount || 0), 0);
    const unpaidExpenses = expenses.filter(exp => exp.status === 'Unpaid').reduce((sum, exp) => sum + (exp.totalAmount || 0), 0);

    // Top 5 Expense Categories for chart
    const categoryAmounts = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + (exp.totalAmount || 0);
      return acc;
    }, {});

    const sortedCategories = Object.entries(categoryAmounts)
      .sort(([, amountA], [, amountB]) => amountB - amountA)
      .slice(0, 5);

    return {
      totalExpenses,
      paidExpenses,
      unpaidExpenses,
      topCategories: sortedCategories,
    };
  }, [expenses]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6 ml-4 mr-4">
        <div className="max-w-full mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            {/* <h1 className="text-4xl font-bold text-gray-900 mb-2">{isEditing ? "Edit Expense" : "Add New Expense"}</h1> */}
            {/* <p className="text-gray-600">Enter details for your expense records</p> */}
          </div>

          <form onSubmit={handleSaveExpense} className="space-y-8">
            {/* Section 1: Basic Details */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Expense Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Internet Bill, Office Supplies"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Expense Category <span className="text-red-500">*</span></label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Category</option>
                    {expenseCategoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
                <div>
                  <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-2">Vendor / Payee</label>
                  <input
                    type="text"
                    id="vendor"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Airtel, Amazon"
                  />
                </div>
                <div>
                  <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700 mb-2">Expense Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    id="expenseDate"
                    name="expenseDate"
                    value={formData.expenseDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.expenseDate && <p className="text-red-500 text-xs mt-1">{errors.expenseDate}</p>}
                </div>
                <div>
                  <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-2">Payment Mode <span className="text-red-500">*</span></label>
                  <select
                    id="paymentMode"
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Payment Mode</option>
                    {paymentModeOptions.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                  {errors.paymentMode && <p className="text-red-500 text-xs mt-1">{errors.paymentMode}</p>}
                </div>
                <div>
                  <label htmlFor="referenceNo" className="block text-sm font-medium text-gray-700 mb-2">Reference / Bill No.</label>
                  <input
                    type="text"
                    id="referenceNo"
                    name="referenceNo"
                    value={formData.referenceNo}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Amount Details */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Amount Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    min="0.01"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <label htmlFor="taxPercent" className="block text-sm font-medium text-gray-700 mb-2">Tax %</label>
                  <input
                    type="number"
                    id="taxPercent"
                    name="taxPercent"
                    value={formData.taxPercent}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="taxAmount" className="block text-sm font-medium text-gray-700 mb-2">Tax Amount</label>
                  <input
                    type="text"
                    id="taxAmount"
                    name="taxAmount"
                    value={formatCurrency(formData.taxAmount)}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                  <input
                    type="text"
                    id="totalAmount"
                    name="totalAmount"
                    value={formatCurrency(formData.totalAmount)}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <input
                    type="text"
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Supporting Documents & Notes */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <Paperclip className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Supporting Documents & Notes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="supportingDocument" className="block text-sm font-medium text-gray-700 mb-2">Upload Bill / Receipt (PDF, JPG, PNG)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      id="supportingDocument"
                      name="supportingDocument"
                      onChange={handleFormChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="supportingDocument"
                      className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 flex items-center"
                    >
                      <Paperclip className="w-4 h-4 mr-2" /> Choose File
                    </label>
                    {formData.supportingDocument && (
                      <span className="text-sm text-gray-600">{formData.supportingDocument.name}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Notes / Remarks</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Any additional notes..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Section 4: Payment Status */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Payment Status</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status <span className="text-red-500">*</span></label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    {paymentStatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                </div>
                {(formData.status === 'Paid' || formData.status === 'Partial') && (
                  <>
                    <div>
                      <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                      <input
                        type="date"
                        id="paymentDate"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      {errors.paymentDate && <p className="text-red-500 text-xs mt-1">{errors.paymentDate}</p>}
                    </div>
                    <div>
                      <label htmlFor="transactionRefNo" className="block text-sm font-medium text-gray-700 mb-2">Transaction Reference No.</label>
                      <input
                        type="text"
                        id="transactionRefNo"
                        name="transactionRefNo"
                        value={formData.transactionRefNo}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Optional"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
              >
                <XCircle className="inline-block w-5 h-5 mr-2" /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAndAddAnother}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
              >
                <Plus className="inline-block w-5 h-5 mr-2" /> Save & Add Another
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
              >
                <Save className="inline-block w-5 h-5 mr-2" /> {isEditing ? "Update Expense" : "Save Expense"}
              </button>
            </div>
          </form>

          {/* Expenses List (Admin View) */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                <List className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Expenses List (Admin View)</h2>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label htmlFor="filterDateStart" className="block text-sm font-medium text-gray-700 mb-2">Date Range (Start)</label>
                <input type="date" id="filterDateStart" name="dateRangeStart" value={filters.dateRangeStart} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="filterDateEnd" className="block text-sm font-medium text-gray-700 mb-2">Date Range (End)</label>
                <input type="date" id="filterDateEnd" name="dateRangeEnd" value={filters.dateRangeEnd} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select id="filterCategory" name="category" value={filters.category} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">All Categories</option>
                  {expenseCategoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="filterVendor" className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                <input type="text" id="filterVendor" name="vendor" value={filters.vendor} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Search Vendor" />
              </div>
              <div>
                <label htmlFor="filterPaymentStatus" className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select id="filterPaymentStatus" name="paymentStatus" value={filters.paymentStatus} onChange={handleFilterChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">All Statuses</option>
                  {paymentStatusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="filterAmountMin" className="block text-sm font-medium text-gray-700 mb-2">Amount Min (₹)</label>
                <input type="number" id="filterAmountMin" name="amountMin" value={filters.amountMin} onChange={handleFilterChange} min="0" step="0.01" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="filterAmountMax" className="block text-sm font-medium text-gray-700 mb-2">Amount Max (₹)</label>
                <input type="number" id="filterAmountMax" name="amountMax" value={filters.amountMax} onChange={handleFilterChange} min="0" step="0.01" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            {/* Expenses Table */}
            {filteredExpenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredExpenses.map((expense, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">{expense.title}</td>
                        <td className="p-2 whitespace-nowrap text-sm text-gray-500">{expense.expenseDate}</td>
                        <td className="p-2 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                        <td className="p-2 whitespace-nowrap text-sm text-gray-500">{expense.vendor || '-'}</td>
                        <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(expense.totalAmount)}</td>
                        <td className="p-2 whitespace-nowrap text-sm text-gray-500">{expense.paymentMode}</td>
                        <td className="p-2 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            expense.status === 'Paid' ? 'bg-green-100 text-green-800' :
                            expense.status === 'Unpaid' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="p-2 whitespace-nowrap text-center">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleViewEditExpense(expenses.indexOf(expense))} // Use original index for editing
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                              title="Edit Expense"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(expenses.indexOf(expense))} // Use original index for deleting
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200"
                              title="Delete Expense"
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No expenses found</p>
                <p className="text-sm">Adjust your filters or add new expenses.</p>
              </div>
            )}
          </div>

          {/* Summary Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-lime-600 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-gray-700">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summaryTotals.totalExpenses)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-gray-700">Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(summaryTotals.paidExpenses)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-gray-700">Unpaid</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(summaryTotals.unpaidExpenses)}</p>
              </div>
            </div>

            {/* Top 5 Expense Categories Chart (simple representation) */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Expense Categories</h3>
            {summaryTotals.topCategories.length > 0 && summaryTotals.totalExpenses > 0 ? (
              <div className="space-y-3">
                {summaryTotals.topCategories.map(([category, amount], index) => (
                  <div key={category} className="flex items-center">
                    <div className="w-32 text-sm text-gray-700 font-medium">{category}</div>
                    <div className="flex-grow bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${(amount / summaryTotals.totalExpenses) * 100}%` }}
                      ></div>
                    </div>
                    <div className="ml-4 text-sm font-semibold text-gray-900">{formatCurrency(amount)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No expense data to display categories.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}