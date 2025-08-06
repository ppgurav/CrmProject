"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { z } from 'zod';
import { Plus, Trash2, FileText, Calculator, Paperclip, User, CheckSquare, MessageCircle, DollarSign, Banknote, CalendarDays } from 'lucide-react';

// Schema for individual items in the invoice table
export const itemSchema = z.object({
  itemName: z.string().min(1, 'Item Name is required'),
  description: z.string().optional(),
  hsnSacCode: z.string().optional(),
  qty: z.number().min(0.01, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  rate: z.number().min(0.01, 'Rate must be greater than 0'),
  discount: z.number().min(0).max(100, 'Discount must be between 0 and 100').default(0),
  gst: z.number().min(0).max(100, 'GST must be between 0 and 100').default(0),
});

// Main schema for the entire purchase invoice form
export const purchaseInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice Number is required'),
  invoiceDate: z.string().min(1, 'Invoice Date is required'),
  purchaseOrderNo: z.string().optional(),
  billType: z.enum(['Goods', 'Services', 'Mixed'], { message: 'Bill Type is required' }),
  vendor: z.string().min(1, 'Vendor is required'),
  vendorGstin: z.string().optional(),
  referenceNo: z.string().optional(),
  deliveryLocation: z.string().optional(),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
  roundOff: z.number().default(0),
  tdsDeducted: z.number().default(0),
  paymentStatus: z.enum(['Paid', 'Unpaid', 'Partial'], { message: 'Payment Status is required' }),
  paymentMode: z.enum(['Bank', 'UPI', 'Cash', 'Credit'], { message: 'Payment Mode is required' }).optional(),
  paymentDate: z.string().optional(),
  bankAccountUsed: z.string().optional(),
  transactionRefNo: z.string().optional(),
  invoiceCopy: z.any().optional(), // For file input
  supportingDocs: z.any().optional(), // For file input
  createdBy: z.string().optional(),
  approvedBy: z.string().optional(),
  approvalStatus: z.enum(['Draft', 'Submitted', 'Approved', 'Cancelled'], { message: 'Approval Status is required' }),
  remarks: z.string().optional(),
});

// Dummy data for dropdowns
const vendors = [
  { id: 1, name: "Vendor A", gstin: "GSTIN001" },
  { id: 2, name: "Vendor B", gstin: "GSTIN002" },
  { id: 3, name: "Vendor C", gstin: "GSTIN003" },
];

const billTypeOptions = [
  { value: 'Goods', label: 'Goods' },
  { value: 'Services', label: 'Services' },
  { value: 'Mixed', label: 'Mixed' },
];

const paymentStatusOptions = [
  { value: 'Paid', label: 'Paid' },
  { value: 'Unpaid', label: 'Unpaid' },
  { value: 'Partial', label: 'Partial' },
];

const paymentModeOptions = [
  { value: 'Bank', label: 'Bank' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Credit', label: 'Credit' },
];

const bankAccountOptions = [
  { value: 'Bank A/C 1', label: 'Bank A/C 1' },
  { value: 'Bank A/C 2', label: 'Bank A/C 2' },
];

const approvedByOptions = [
  { value: 'Manager A', label: 'Manager A' },
  { value: 'Manager B', label: 'Manager B' },
];

const approvalStatusOptions = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const productServices = [
  { id: 1, name: "Product A", description: "Description for Product A", hsnSac: "123456" },
  { id: 2, name: "Service X", description: "Description for Service X", hsnSac: "789012" },
  { id: 3, name: "Material Y", description: "Description for Material Y", hsnSac: "345678" },
];

const gstOptions = [
  { value: 0, label: '0%' },
  { value: 5, label: '5%' },
  { value: 12, label: '12%' },
  { value: 18, label: '18%' },
  { value: 28, label: '28%' },
];

export default function AllInvoices() {
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`,
    invoiceDate: new Date().toISOString().split('T')[0], // Default to today's date
    purchaseOrderNo: '',
    billType: '',
    vendor: '',
    vendorGstin: '',
    referenceNo: '',
    deliveryLocation: '',
    items: [{
      itemName: '',
      description: '',
      hsnSacCode: '',
      qty: 0,
      unit: '',
      rate: 0,
      discount: 0,
      gst: 0,
    }],
    roundOff: 0,
    tdsDeducted: 0,
    paymentStatus: '',
    paymentMode: '',
    paymentDate: '',
    bankAccountUsed: '',
    transactionRefNo: '',
    invoiceCopy: null,
    supportingDocs: null,
    createdBy: 'Current User', // Placeholder for auto-filled field
    approvedBy: '',
    approvalStatus: 'Draft',
    remarks: '',
  });

  const [errors, setErrors] = useState({});
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: '',
    description: '',
    hsnSacCode: '',
    qty: 1,
    unit: '',
    rate: 0,
    discount: 0,
    gst: 0,
  });
  const [newItemErrors, setNewItemErrors] = useState({});

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate item-wise totals
  const calculateItemTotals = (item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const discount = parseFloat(item.discount) || 0;
    const gst = parseFloat(item.gst) || 0;

    const baseAmount = qty * rate;
    const itemDiscountAmount = baseAmount * (discount / 100);
    const amountAfterDiscount = baseAmount - itemDiscountAmount;
    const itemGstAmount = amountAfterDiscount * (gst / 100);
    const itemTotal = amountAfterDiscount + itemGstAmount;

    return {
      baseAmount,
      itemDiscountAmount,
      itemGstAmount,
      itemTotal,
    };
  };

  // Calculate summary totals using useMemo for optimization
  const summary = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalGst = 0;

    formData.items.forEach(item => {
      const { baseAmount, itemDiscountAmount, itemGstAmount } = calculateItemTotals(item);
      subtotal += baseAmount;
      totalDiscount += itemDiscountAmount;
      totalGst += itemGstAmount;
    });

    const grandTotal = subtotal - totalDiscount + totalGst + (parseFloat(formData.roundOff) || 0);
    const netPayable = grandTotal - (parseFloat(formData.tdsDeducted) || 0);

    return {
      subtotal,
      totalDiscount,
      totalGst,
      grandTotal,
      netPayable,
    };
  }, [formData.items, formData.roundOff, formData.tdsDeducted]);

  // Generic handler for main form fields
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Autofill vendor GSTIN
      if (name === "vendor") {
        const selectedVendor = vendors.find(v => v.name === value);
        if (selectedVendor) {
          setFormData(prev => ({ ...prev, vendorGstin: selectedVendor.gstin }));
        } else {
          setFormData(prev => ({ ...prev, vendorGstin: '' }));
        }
      }
    }
  };

  // Handler for item table fields (for existing rows)
  const handleItemChange = (index, e) => {
    const { name, value, type } = e.target;
    const newItems = [...formData.items];
    let parsedValue = value;

    if (type === 'number' || name === "qty" || name === "rate" || name === "discount" || name === "gst") {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = 0;
    }

    newItems[index] = { ...newItems[index], [name]: parsedValue };

    // Autofill product/service description and HSN/SAC code
    if (name === "itemName") {
      const selectedProduct = productServices.find(p => p.name === value);
      if (selectedProduct) {
        newItems[index].description = selectedProduct.description;
        newItems[index].hsnSacCode = selectedProduct.hsnSac;
      } else {
        newItems[index].description = '';
        newItems[index].hsnSacCode = '';
      }
    }
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  // Removes a row from the items table
  const removeItemRow = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Handles form submission and Zod validation
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      purchaseInvoiceSchema.parse(formData);
      console.log('Form data submitted:', formData);
      setErrors({});
      alert('Form submitted successfully! Check console for data.');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = {};
        err.errors.forEach(error => {
          // Handle nested errors for items array
          if (error.path[0] === 'items' && typeof error.path[1] === 'number') {
            const itemIndex = error.path[1];
            const fieldName = error.path[2];
            newErrors[`items[${itemIndex}].${fieldName}`] = error.message;
          } else {
            newErrors[error.path[0]] = error.message;
          }
        });
        setErrors(newErrors);
        console.error('Validation errors:', newErrors);
      }
    }
  };

  // --- Modal Logic ---
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (name === "qty" || name === "rate" || name === "discount" || name === "gst") {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = 0;
    }
    setNewItem(prev => ({ ...prev, [name]: parsedValue }));

    // Autofill product/service description and HSN/SAC code for new item
    if (name === "itemName") {
      const selectedProduct = productServices.find(p => p.name === value);
      if (selectedProduct) {
        setNewItem(prev => ({
          ...prev,
          description: selectedProduct.description,
          hsnSacCode: selectedProduct.hsnSac,
          [name]: parsedValue // Ensure itemName is also updated
        }));
      } else {
        setNewItem(prev => ({
          ...prev,
          description: '',
          hsnSacCode: '',
          [name]: parsedValue
        }));
      }
    }
  };

  const handleAddNewItem = () => {
    try {
      itemSchema.parse(newItem);
      setNewItemErrors({});
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
      setNewItem({ // Reset new item form
        itemName: '',
        description: '',
        hsnSacCode: '',
        qty: 1,
        unit: '',
        rate: 0,
        discount: 0,
        gst: 0,
      });
      setShowAddItemModal(false); // Close modal
    } catch (e) {
      const newErrors = {};
      e.errors.forEach(err => {
        if (err.path.length > 0) {
          newErrors[err.path[0]] = err.message;
        }
      });
      setNewItemErrors(newErrors);
    }
  };

  const handleCloseAddItemModal = () => {
    setShowAddItemModal(false);
    setNewItem({ // Reset new item form
      itemName: '',
      description: '',
      hsnSacCode: '',
      qty: 1,
      unit: '',
      rate: 0,
      discount: 0,
      gst: 0,
    });
    setNewItemErrors({}); // Clear modal errors
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen p-6">
      <div className="max-w-full mx-auto">
        {/* <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Purchase Invoice</h1>
          <p className="text-gray-600">Manage and track your incoming invoices</p>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Invoice Details */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">1. Invoice Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                <input
                  type="text"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                />
                {errors.invoiceNumber && <p className="text-red-500 text-xs mt-1">{errors.invoiceNumber}</p>}
              </div>
              <div>
                <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-2">Invoice Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  id="invoiceDate"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {errors.invoiceDate && <p className="text-red-500 text-xs mt-1">{errors.invoiceDate}</p>}
              </div>
              <div>
                <label htmlFor="purchaseOrderNo" className="block text-sm font-medium text-gray-700 mb-2">Purchase Order No.</label>
                <input
                  type="text"
                  id="purchaseOrderNo"
                  name="purchaseOrderNo"
                  value={formData.purchaseOrderNo}
                  onChange={handleChange}
                  placeholder="e.g., PO-2023-001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {errors.purchaseOrderNo && <p className="text-red-500 text-xs mt-1">{errors.purchaseOrderNo}</p>}
              </div>
              <div>
                <label htmlFor="billType" className="block text-sm font-medium text-gray-700 mb-2">Bill Type <span className="text-red-500">*</span></label>
                <select
                  id="billType"
                  name="billType"
                  value={formData.billType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Bill Type</option>
                  {billTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.billType && <p className="text-red-500 text-xs mt-1">{errors.billType}</p>}
              </div>
              <div>
                <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-2">Vendor <span className="text-red-500">*</span></label>
                <select
                  id="vendor"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                  ))}
                </select>
                {errors.vendor && <p className="text-red-500 text-xs mt-1">{errors.vendor}</p>}
              </div>
              <div>
                <label htmlFor="vendorGstin" className="block text-sm font-medium text-gray-700 mb-2">Vendor GSTIN</label>
                <input
                  type="text"
                  id="vendorGstin"
                  name="vendorGstin"
                  value={formData.vendorGstin}
                  onChange={handleChange}
                  placeholder="Autofilled from vendor"
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                />
                {errors.vendorGstin && <p className="text-red-500 text-xs mt-1">{errors.vendorGstin}</p>}
              </div>
              <div>
                <label htmlFor="referenceNo" className="block text-sm font-medium text-gray-700 mb-2">Reference No.</label>
                <input
                  type="text"
                  id="referenceNo"
                  name="referenceNo"
                  value={formData.referenceNo}
                  onChange={handleChange}
                  placeholder="Optional external reference"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {errors.referenceNo && <p className="text-red-500 text-xs mt-1">{errors.referenceNo}</p>}
              </div>
              <div>
                <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
                <input
                  type="text"
                  id="deliveryLocation"
                  name="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={handleChange}
                  placeholder="Where items/services delivered"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {errors.deliveryLocation && <p className="text-red-500 text-xs mt-1">{errors.deliveryLocation}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Items Table */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">2. Items Table</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddItemModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="inline-block w-4 h-4 mr-2" /> Add Item
              </button>
            </div>
            {formData.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN/SAC Code</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount (%)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST (%)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="p-2 whitespace-nowrap">
                          <select
                            name="itemName"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="">Select Item</option>
                            {productServices.map(prod => (
                              <option key={prod.id} value={prod.name}>{prod.name}</option>
                            ))}
                          </select>
                          {errors[`items[${index}].itemName`] && (<p className="text-red-500 text-xs mt-1">{errors[`items[${index}].itemName`]}</p>)}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <textarea
                            name="description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, e)}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                            placeholder="Short description"
                          ></textarea>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <input
                            type="text"
                            name="hsnSacCode"
                            value={item.hsnSacCode}
                            onChange={(e) => handleItemChange(index, e)}
                            placeholder="Tax code"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <input
                            type="number"
                            name="qty"
                            value={item.qty}
                            onChange={(e) => handleItemChange(index, e)}
                            min="0.01"
                            step="0.01"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          {errors[`items[${index}].qty`] && (<p className="text-red-500 text-xs mt-1">{errors[`items[${index}].qty`]}</p>)}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <input
                            type="text"
                            name="unit"
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, e)}
                            placeholder="e.g., Nos, GB"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          {errors[`items[${index}].unit`] && (<p className="text-red-500 text-xs mt-1">{errors[`items[${index}].unit`]}</p>)}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <input
                            type="number"
                            name="rate"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, e)}
                            min="0.01"
                            step="0.01"
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          {errors[`items[${index}].rate`] && (<p className="text-red-500 text-xs mt-1">{errors[`items[${index}].rate`]}</p>)}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <input
                            type="number"
                            name="discount"
                            value={item.discount}
                            onChange={(e) => handleItemChange(index, e)}
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <select
                            name="gst"
                            value={item.gst}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            {gstOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(calculateItemTotals(item).itemTotal)}
                        </td>
                        <td className="p-2 whitespace-nowrap text-center">
                          <button
                            type="button"
                            onClick={() => removeItemRow(index)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200"
                            title="Delete Item"
                            disabled={formData.items.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No items added yet</p>
                <p className="text-sm">Click "Add Item" to start building your invoice</p>
              </div>
            )}
            {errors.items && typeof errors.items === 'string' && (<p className="text-red-500 text-xs mt-2">{errors.items}</p>)}
          </div>

          {/* Section 3: Summary Section */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">3. Summary Section</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">Invoice Summary</h3>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Total Discount:</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(summary.totalDiscount)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Total GST:</span>
                  <span className="font-semibold">{formatCurrency(summary.totalGst)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Grand Total (₹):</span>
                  <span>{formatCurrency(summary.grandTotal)}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="roundOff" className="block text-sm font-medium text-gray-700 mb-2">Round Off (₹)</label>
                  <input
                    type="number"
                    id="roundOff"
                    name="roundOff"
                    value={formData.roundOff}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.roundOff && <p className="text-red-500 text-xs mt-1">{errors.roundOff}</p>}
                </div>
                <div>
                  <label htmlFor="tdsDeducted" className="block text-sm font-medium text-gray-700 mb-2">TDS Deducted (₹)</label>
                  <input
                    type="number"
                    id="tdsDeducted"
                    name="tdsDeducted"
                    value={formData.tdsDeducted}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.tdsDeducted && <p className="text-red-500 text-xs mt-1">{errors.tdsDeducted}</p>}
                </div>
                <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Net Payable (₹):</span>
                  <span>{formatCurrency(summary.netPayable)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Payment Section */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">4. Payment Section</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">Payment Status <span className="text-red-500">*</span></label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Status</option>
                  {paymentStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.paymentStatus && <p className="text-red-500 text-xs mt-1">{errors.paymentStatus}</p>}
              </div>
              <div>
                <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
                <select
                  id="paymentMode"
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Mode</option>
                  {paymentModeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.paymentMode && <p className="text-red-500 text-xs mt-1">{errors.paymentMode}</p>}
              </div>
              <div>
                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                <input
                  type="date"
                  id="paymentDate"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {errors.paymentDate && <p className="text-red-500 text-xs mt-1">{errors.paymentDate}</p>}
              </div>
              <div>
                <label htmlFor="bankAccountUsed" className="block text-sm font-medium text-gray-700 mb-2">Bank Account Used</label>
                <select
                  id="bankAccountUsed"
                  name="bankAccountUsed"
                  value={formData.bankAccountUsed}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Account</option>
                  {bankAccountOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.bankAccountUsed && <p className="text-red-500 text-xs mt-1">{errors.bankAccountUsed}</p>}
              </div>
              <div>
                <label htmlFor="transactionRefNo" className="block text-sm font-medium text-gray-700 mb-2">Transaction Ref. No.</label>
                <input
                  type="text"
                  id="transactionRefNo"
                  name="transactionRefNo"
                  value={formData.transactionRefNo}
                  onChange={handleChange}
                  placeholder="UTR/UPI/NEFT ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {errors.transactionRefNo && <p className="text-red-500 text-xs mt-1">{errors.transactionRefNo}</p>}
              </div>
            </div>
          </div>

          {/* Section 5: Attachments */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-sky-500 rounded-lg flex items-center justify-center mr-3">
                <Paperclip className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">5. Attachments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="invoiceCopy" className="block text-sm font-medium text-gray-700 mb-2">Upload Invoice Copy</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="invoiceCopy"
                    name="invoiceCopy"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="invoiceCopy"
                    className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 flex items-center"
                  >
                    <Paperclip className="w-4 h-4 mr-2" /> Choose File
                  </label>
                  {formData.invoiceCopy && (<span className="text-sm text-gray-600">{formData.invoiceCopy.name}</span>)}
                </div>
                {errors.invoiceCopy && <p className="text-red-500 text-xs mt-1">{errors.invoiceCopy}</p>}
              </div>
              <div>
                <label htmlFor="supportingDocs" className="block text-sm font-medium text-gray-700 mb-2">Upload Supporting Docs</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="supportingDocs"
                    name="supportingDocs"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="supportingDocs"
                    className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 flex items-center"
                  >
                    <Paperclip className="w-4 h-4 mr-2" /> Choose File
                  </label>
                  {formData.supportingDocs && (<span className="text-sm text-gray-600">{formData.supportingDocs.name}</span>)}
                </div>
                {errors.supportingDocs && <p className="text-red-500 text-xs mt-1">{errors.supportingDocs}</p>}
              </div>
            </div>
          </div>

          {/* Section 6: Internal Tracking & Notes */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">6. Internal Tracking & Notes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-2">Created By</label>
                <input
                  type="text"
                  id="createdBy"
                  name="createdBy"
                  value={formData.createdBy}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                />
                {errors.createdBy && <p className="text-red-500 text-xs mt-1">{errors.createdBy}</p>}
              </div>
              <div>
                <label htmlFor="approvedBy" className="block text-sm font-medium text-gray-700 mb-2">Approved By</label>
                <select
                  id="approvedBy"
                  name="approvedBy"
                  value={formData.approvedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Approver</option>
                  {approvedByOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.approvedBy && <p className="text-red-500 text-xs mt-1">{errors.approvedBy}</p>}
              </div>
              <div>
                <label htmlFor="approvalStatus" className="block text-sm font-medium text-gray-700 mb-2">Approval Status <span className="text-red-500">*</span></label>
                <select
                  id="approvalStatus"
                  name="approvalStatus"
                  value={formData.approvalStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  {approvalStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.approvalStatus && <p className="text-red-500 text-xs mt-1">{errors.approvalStatus}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Internal comments only"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                ></textarea>
                {errors.remarks && <p className="text-red-500 text-xs mt-1">{errors.remarks}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Submit Invoice
            </button>
          </div>
        </form>
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Add New Item</h3>
              <button
                type="button"
                onClick={handleCloseAddItemModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <Plus className="w-6 h-6 rotate-45" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="modal-itemName" className="block text-sm font-medium text-gray-700 mb-2">Item Name <span className="text-red-500">*</span></label>
                <select
                  id="modal-itemName"
                  name="itemName"
                  value={newItem.itemName}
                  onChange={handleNewItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Item</option>
                  {productServices.map(prod => (
                    <option key={prod.id} value={prod.name}>{prod.name}</option>
                  ))}
                </select>
                {newItemErrors.itemName && <p className="text-red-500 text-xs mt-1">{newItemErrors.itemName}</p>}
              </div>
              <div>
                <label htmlFor="modal-hsnSacCode" className="block text-sm font-medium text-gray-700 mb-2">HSN/SAC Code</label>
                <input
                  type="text"
                  id="modal-hsnSacCode"
                  name="hsnSacCode"
                  value={newItem.hsnSacCode}
                  onChange={handleNewItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                  readOnly
                  placeholder="Auto-filled"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="modal-description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  id="modal-description"
                  name="description"
                  value={newItem.description}
                  onChange={handleNewItemChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Auto-filled or custom description"
                ></textarea>
              </div>
              <div>
                <label htmlFor="modal-qty" className="block text-sm font-medium text-gray-700 mb-2">Quantity <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  id="modal-qty"
                  name="qty"
                  value={newItem.qty}
                  onChange={handleNewItemChange}
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {newItemErrors.qty && <p className="text-red-500 text-xs mt-1">{newItemErrors.qty}</p>}
              </div>
              <div>
                <label htmlFor="modal-unit" className="block text-sm font-medium text-gray-700 mb-2">Unit <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="modal-unit"
                  name="unit"
                  value={newItem.unit}
                  onChange={handleNewItemChange}
                  placeholder="e.g., Nos, GB"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {newItemErrors.unit && <p className="text-red-500 text-xs mt-1">{newItemErrors.unit}</p>}
              </div>
              <div>
                <label htmlFor="modal-rate" className="block text-sm font-medium text-gray-700 mb-2">Rate (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  id="modal-rate"
                  name="rate"
                  value={newItem.rate}
                  onChange={handleNewItemChange}
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {newItemErrors.rate && <p className="text-red-500 text-xs mt-1">{newItemErrors.rate}</p>}
              </div>
              <div>
                <label htmlFor="modal-discount" className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                <input
                  type="number"
                  id="modal-discount"
                  name="discount"
                  value={newItem.discount}
                  onChange={handleNewItemChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="modal-gst" className="block text-sm font-medium text-gray-700 mb-2">GST (%)</label>
                <select
                  id="modal-gst"
                  name="gst"
                  value={newItem.gst}
                  onChange={handleNewItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {gstOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseAddItemModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNewItem}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="inline-block w-4 h-4 mr-2" /> Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
