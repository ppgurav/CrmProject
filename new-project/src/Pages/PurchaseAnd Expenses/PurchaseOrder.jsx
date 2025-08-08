import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { Plus, Trash2, Download, Mail, Save, Send, Paperclip, User, CheckSquare, Calculator, FileText, MessageCircle } from 'lucide-react';

// Zod schema for purchase order validation
const poItemSchema = z.object({
  productService: z.string().min(1, "Product/Service is required"),
  description: z.string().optional(),
  hsnSacCode: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit Price cannot be negative"),
  discount: z.number().min(0).max(100).optional().default(0), // Percentage
  gst: z.number().min(0).max(100).optional().default(0), // Percentage
});

const purchaseOrderSchema = z.object({
  poNumber: z.string().min(1, "PO Number is required"),
  poDate: z.string().min(1, "PO Date is required"),
  vendor: z.string().min(1, "Vendor is required"),
  vendorContactPerson: z.string().optional(),
  vendorMobileEmail: z.string().optional(),
  referenceNo: z.string().optional(),
  deliveryDate: z.string().min(1, "Delivery Date is required"),
  paymentTerms: z.string().min(1, "Payment Terms are required"),
  purchaseType: z.enum(["Goods", "Services"], { message: "Purchase Type must be Goods or Services" }),
  items: z.array(poItemSchema).min(1, "At least one item is required"),
  additionalNotes: z.string().optional(),
  attachment: z.any().optional(), // For file input
});

// Dummy data for dropdowns
const vendors = [
  { id: 1, name: "CloudHost Solutions", contact: "Alice Smith", email: "alice@cloudhost.com", mobile: "9876543210" },
  { id: 2, name: "Hardware Hub Inc.", contact: "Bob Johnson", email: "bob@hardwarehub.com", mobile: "9988776655" },
  { id: 3, name: "Software Innovations", contact: "Charlie Brown", email: "charlie@softwareinnovations.com", mobile: "9123456789" },
];

const paymentTermsOptions = ["Net 15", "Net 30", "Net 45", "Net 60", "Advance 50%", "Advance 100%"];

const productServices = [
  { id: 1, name: "Domain Registration (1 year)", description: "Annual domain registration for .com", hsnSac: "998313" },
  { id: 2, name: "Cloud Hosting (Standard)", description: "Standard cloud hosting package, 10GB SSD", hsnSac: "998314" },
  { id: 3, name: "Laptop (Dell XPS 15)", description: "Dell XPS 15, i7, 16GB RAM, 512GB SSD", hsnSac: "847130" },
  { id: 4, name: "Microsoft Office 365 (Annual)", description: "Annual subscription for Microsoft Office 365 Business Standard", hsnSac: "998430" },
  { id: 5, name: "IT Consulting Services", description: "Hourly IT consulting for network setup", hsnSac: "998311" },
];

export default function PurchaseOrder() {
  const [poData, setPoData] = useState({
    poNumber: `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`,
    poDate: new Date().toISOString().split('T')[0],
    vendor: '',
    vendorContactPerson: '',
    vendorMobileEmail: '',
    referenceNo: '',
    deliveryDate: '',
    paymentTerms: '',
    purchaseType: 'Goods',
    items: [{
      productService: '',
      description: '',
      hsnSacCode: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      gst: 0,
    }],
    additionalNotes: '',
    attachment: null,
  });

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    productService: "",
    description: "",
    hsnSacCode: "",
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    gst: 0,
  });
  const [newItemErrors, setNewItemErrors] = useState({}); // State for modal item errors

  const [errors, setErrors] = useState({});

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate item-wise totals
  const calculateItemTotals = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const discount = parseFloat(item.discount) || 0;
    const gst = parseFloat(item.gst) || 0;

    const amountBeforeDiscount = quantity * unitPrice;
    const itemDiscountAmount = amountBeforeDiscount * (discount / 100);
    const amountAfterDiscount = amountBeforeDiscount - itemDiscountAmount;
    const itemGSTAmount = amountAfterDiscount * (gst / 100);
    const itemTotal = amountAfterDiscount + itemGSTAmount;

    return {
      amountBeforeDiscount,
      itemDiscountAmount,
      itemGSTAmount,
      itemTotal,
    };
  };

  // Calculate summary totals using useMemo for optimization
  const summaryTotals = useMemo(() => {
    let subtotal = 0; // Sum of (Qty * Rate)
    let totalDiscount = 0; // Sum of (Qty * Rate * Discount%)
    let totalGST = 0; // Sum of ((Qty * Rate - Discount) * GST%)
    let grandTotal = 0;

    poData.items.forEach(item => {
      const { amountBeforeDiscount, itemDiscountAmount, itemGSTAmount, itemTotal } = calculateItemTotals(item);
      subtotal += amountBeforeDiscount;
      totalDiscount += itemDiscountAmount;
      totalGST += itemGSTAmount;
      grandTotal += itemTotal;
    });

    return {
      subtotal,
      totalDiscount,
      totalGST,
      grandTotal,
    };
  }, [poData.items]);

  // Handle basic details input changes
  const handleBasicDetailsChange = (e) => {
    const { name, value } = e.target;
    setPoData(prev => ({ ...prev, [name]: value }));

    // Autofill vendor contact/email/mobile
    if (name === "vendor") {
      const selectedVendor = vendors.find(v => v.name === value);
      if (selectedVendor) {
        setPoData(prev => ({
          ...prev,
          vendorContactPerson: selectedVendor.contact,
          vendorMobileEmail: `${selectedVendor.mobile} / ${selectedVendor.email}`,
        }));
      } else {
        setPoData(prev => ({
          ...prev,
          vendorContactPerson: '',
          vendorMobileEmail: '',
        }));
      }
    }
  };

  // Handle item input changes (for existing table rows)
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...poData.items];
    let parsedValue = value;

    if (name === "quantity" || name === "unitPrice" || name === "discount" || name === "gst") {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = 0;
    }

    newItems[index] = { ...newItems[index], [name]: parsedValue };

    // Autofill product/service description and HSN/SAC code
    if (name === "productService") {
      const selectedProduct = productServices.find(p => p.name === value);
      if (selectedProduct) {
        newItems[index].description = selectedProduct.description;
        newItems[index].hsnSacCode = selectedProduct.hsnSac;
      } else {
        newItems[index].description = '';
        newItems[index].hsnSacCode = '';
      }
    }
    setPoData(prev => ({ ...prev, items: newItems }));
  };

  // Delete an item row
  const handleDeleteItem = (index) => {
    setPoData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Handle file attachment
  const handleAttachmentChange = (e) => {
    setPoData(prev => ({ ...prev, attachment: e.target.files[0] }));
  };

  // Form submission handlers
  const validateForm = () => {
    try {
      purchaseOrderSchema.parse(poData);
      setErrors({});
      return true;
    } catch (e) {
      const newErrors = {};
      e.errors.forEach(err => {
        if (err.path.length === 1) {
          newErrors[err.path[0]] = err.message;
        } else if (err.path.length === 2 && err.path[0] === 'items') {
          // Handle item-specific errors, e.g., items[0].quantity
          const itemIndex = err.path[1];
          const fieldName = err.path[2];
          if (!newErrors.items) newErrors.items = {};
          if (!newErrors.items[itemIndex]) newErrors.items[itemIndex] = {};
          newErrors.items[itemIndex][fieldName] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSaveAsDraft = (e) => {
    e.preventDefault();
    // For draft, we might not need full validation, or a subset
    console.log("Saving as Draft:", poData);
    alert("Purchase Order saved as draft!");
  };

  const handleSubmitPO = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Submitting Purchase Order:", poData);
      alert("Purchase Order submitted successfully!");
      // Here you would typically send data to an API
    } else {
      alert("Please correct the errors in the form.");
    }
  };

  const handleDownloadPDF = () => {
    alert("Downloading Purchase Order as PDF...");
    // Implement PDF generation logic here
  };

  const handleEmailToVendor = () => {
    alert("Sending Purchase Order as PDF to vendor...");
    // Implement email sending logic here
  };

  // --- Modal Logic ---
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === "quantity" || name === "unitPrice" || name === "discount" || name === "gst") {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = 0;
    }

    setNewItem(prev => ({ ...prev, [name]: parsedValue }));

    // Autofill product/service description and HSN/SAC code for new item
    if (name === "productService") {
      const selectedProduct = productServices.find(p => p.name === value);
      if (selectedProduct) {
        setNewItem(prev => ({
          ...prev,
          description: selectedProduct.description,
          hsnSacCode: selectedProduct.hsnSac,
          [name]: parsedValue // Ensure productService is also updated
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
      poItemSchema.parse(newItem);
      setNewItemErrors({});
      setPoData(prev => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
      setNewItem({ // Reset new item form
        productService: "",
        description: "",
        hsnSacCode: "",
        quantity: 1,
        unitPrice: 0,
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
      productService: "",
      description: "",
      hsnSacCode: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      gst: 0,
    });
    setNewItemErrors({}); // Clear modal errors
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6  ml-4 mr-4">
        <div className="max-w-full mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            {/* <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Purchase Order</h1> */}
            {/* <p className="text-gray-600">Generate and manage purchase orders for your vendors</p> */}
          </div>

          <form onSubmit={handleSubmitPO} className="space-y-8">
            {/* Section 1: Basic Details */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">1. Basic Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="poNumber" className="block text-sm font-medium text-gray-700 mb-2">PO Number</label>
                  <input
                    type="text"
                    id="poNumber"
                    name="poNumber"
                    value={poData.poNumber}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                  />
                  {errors.poNumber && <p className="text-red-500 text-xs mt-1">{errors.poNumber}</p>}
                </div>
                <div>
                  <label htmlFor="poDate" className="block text-sm font-medium text-gray-700 mb-2">PO Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    id="poDate"
                    name="poDate"
                    value={poData.poDate}
                    onChange={handleBasicDetailsChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.poDate && <p className="text-red-500 text-xs mt-1">{errors.poDate}</p>}
                </div>
                <div>
                  <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-2">Vendor <span className="text-red-500">*</span></label>
                  <select
                    id="vendor"
                    name="vendor"
                    value={poData.vendor}
                    onChange={handleBasicDetailsChange}
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
                  <label htmlFor="vendorContactPerson" className="block text-sm font-medium text-gray-700 mb-2">Vendor Contact Person</label>
                  <input
                    type="text"
                    id="vendorContactPerson"
                    name="vendorContactPerson"
                    value={poData.vendorContactPerson}
                    onChange={handleBasicDetailsChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="vendorMobileEmail" className="block text-sm font-medium text-gray-700 mb-2">Vendor Mobile / Email</label>
                  <input
                    type="text"
                    id="vendorMobileEmail"
                    name="vendorMobileEmail"
                    value={poData.vendorMobileEmail}
                    onChange={handleBasicDetailsChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="referenceNo" className="block text-sm font-medium text-gray-700 mb-2">Reference No.</label>
                  <input
                    type="text"
                    id="referenceNo"
                    name="referenceNo"
                    value={poData.referenceNo}
                    onChange={handleBasicDetailsChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-2">Delivery Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    value={poData.deliveryDate}
                    onChange={handleBasicDetailsChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.deliveryDate && <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>}
                </div>
                <div>
                  <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-2">Payment Terms <span className="text-red-500">*</span></label>
                  <select
                    id="paymentTerms"
                    name="paymentTerms"
                    value={poData.paymentTerms}
                    onChange={handleBasicDetailsChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Payment Terms</option>
                    {paymentTermsOptions.map((term, index) => (
                      <option key={index} value={term}>{term}</option>
                    ))}
                  </select>
                  {errors.paymentTerms && <p className="text-red-500 text-xs mt-1">{errors.paymentTerms}</p>}
                </div>
                <div>
                  <label htmlFor="purchaseType" className="block text-sm font-medium text-gray-700 mb-2">Purchase Type <span className="text-red-500">*</span></label>
                  <select
                    id="purchaseType"
                    name="purchaseType"
                    value={poData.purchaseType}
                    onChange={handleBasicDetailsChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="Goods">Goods</option>
                    <option value="Services">Services</option>
                  </select>
                  {errors.purchaseType && <p className="text-red-500 text-xs mt-1">{errors.purchaseType}</p>}
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

              {poData.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product/Service</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN/SAC Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (₹)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount (%)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST (%)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {poData.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="p-2 whitespace-nowrap">
                            <select
                              name="productService"
                              value={item.productService}
                              onChange={(e) => handleItemChange(index, e)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="">Select Product/Service</option>
                              {productServices.map(prod => (
                                <option key={prod.id} value={prod.name}>{prod.name}</option>
                              ))}
                            </select>
                            {errors.items && errors.items[index] && errors.items[index].productService && (
                              <p className="text-red-500 text-xs mt-1">{errors.items[index].productService}</p>
                            )}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <textarea
                              name="description"
                              value={item.description}
                              onChange={(e) => handleItemChange(index, e)}
                              rows="2"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                              placeholder="Description"
                            ></textarea>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <input
                              type="text"
                              name="hsnSacCode"
                              value={item.hsnSacCode}
                              onChange={(e) => handleItemChange(index, e)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="HSN/SAC"
                            />
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <input
                              type="number"
                              name="quantity"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, e)}
                              min="1"
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            {errors.items && errors.items[index] && errors.items[index].quantity && (
                              <p className="text-red-500 text-xs mt-1">{errors.items[index].quantity}</p>
                            )}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <input
                              type="number"
                              name="unitPrice"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, e)}
                              min="0"
                              step="0.01"
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            {errors.items && errors.items[index] && errors.items[index].unitPrice && (
                              <p className="text-red-500 text-xs mt-1">{errors.items[index].unitPrice}</p>
                            )}
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
                            <input
                              type="number"
                              name="gst"
                              value={item.gst}
                              onChange={(e) => handleItemChange(index, e)}
                              min="0"
                              max="100"
                              step="0.01"
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(calculateItemTotals(item).itemTotal)}</td>
                          <td className="p-2 whitespace-nowrap text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(index)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200"
                              title="Delete Item"
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
                  <p className="text-sm">Click "Add Item" to start building your purchase order</p>
                </div>
              )}
              {errors.items && typeof errors.items === 'string' && (
                <p className="text-red-500 text-xs mt-2">{errors.items}</p>
              )}
            </div>

            {/* Section 3: Summary & Notes */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">3. Summary & Notes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(summaryTotals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Total Discount:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(summaryTotals.totalDiscount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Total GST:</span>
                    <span className="font-semibold">{formatCurrency(summaryTotals.totalGST)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center text-lg font-bold text-gray-900">
                    <span>Grand Total (₹):</span>
                    <span>{formatCurrency(summaryTotals.grandTotal)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      value={poData.additionalNotes}
                      onChange={handleBasicDetailsChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Any special instructions or remarks..."
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-2">Attachment (PDF/Doc)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        id="attachment"
                        name="attachment"
                        onChange={handleAttachmentChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="attachment"
                        className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 flex items-center"
                      >
                        <Paperclip className="w-4 h-4 mr-2" /> Choose File
                      </label>
                      {poData.attachment && (
                        <span className="text-sm text-gray-600">{poData.attachment.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Final Actions */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Final Actions</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
                >
                  <Save className="inline-block w-5 h-5 mr-2" /> Save as Draft
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
                >
                  <FileText className="inline-block w-5 h-5 mr-2" /> Submit PO
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Download className="inline-block w-5 h-5 mr-2" /> Download PDF
                </button>
                <button
                  type="button"
                  onClick={handleEmailToVendor}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Mail className="inline-block w-5 h-5 mr-2" /> Email to Vendor
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/30  flex items-center justify-center p-4 z-50">

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
                <label htmlFor="modal-productService" className="block text-sm font-medium text-gray-700 mb-2">Product/Service <span className="text-red-500">*</span></label>
                <select
                  id="modal-productService"
                  name="productService"
                  value={newItem.productService}
                  onChange={handleNewItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Product/Service</option>
                  {productServices.map(prod => (
                    <option key={prod.id} value={prod.name}>{prod.name}</option>
                  ))}
                </select>
                {newItemErrors.productService && <p className="text-red-500 text-xs mt-1">{newItemErrors.productService}</p>}
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
                <label htmlFor="modal-quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  id="modal-quantity"
                  name="quantity"
                  value={newItem.quantity}
                  onChange={handleNewItemChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {newItemErrors.quantity && <p className="text-red-500 text-xs mt-1">{newItemErrors.quantity}</p>}
              </div>
              <div>
                <label htmlFor="modal-unitPrice" className="block text-sm font-medium text-gray-700 mb-2">Unit Price (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  id="modal-unitPrice"
                  name="unitPrice"
                  value={newItem.unitPrice}
                  onChange={handleNewItemChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {newItemErrors.unitPrice && <p className="text-red-500 text-xs mt-1">{newItemErrors.unitPrice}</p>}
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
                <input
                  type="number"
                  id="modal-gst"
                  name="gst"
                  value={newItem.gst}
                  onChange={handleNewItemChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
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
