// import { useState, useEffect, useMemo } from "react";
// import { z } from "zod";
// import { Plus, Trash2, Download, Mail, Save, Send, Paperclip } from 'lucide-react';

// // Zod schema for purchase order validation
// const poItemSchema = z.object({
//   productService: z.string().min(1, "Product/Service is required"),
//   description: z.string().optional(),
//   hsnSacCode: z.string().optional(),
//   quantity: z.number().min(1, "Quantity must be at least 1"),
//   unitPrice: z.number().min(0, "Unit Price cannot be negative"),
//   discount: z.number().min(0).max(100).optional().default(0), // Percentage
//   gst: z.number().min(0).max(100).optional().default(0), // Percentage
// });

// const purchaseOrderSchema = z.object({
//   poNumber: z.string().min(1, "PO Number is required"),
//   poDate: z.string().min(1, "PO Date is required"),
//   vendor: z.string().min(1, "Vendor is required"),
//   vendorContactPerson: z.string().optional(),
//   vendorMobileEmail: z.string().optional(),
//   referenceNo: z.string().optional(),
//   deliveryDate: z.string().min(1, "Delivery Date is required"),
//   paymentTerms: z.string().min(1, "Payment Terms are required"),
//   purchaseType: z.enum(["Goods", "Services"], { message: "Purchase Type must be Goods or Services" }),
//   items: z.array(poItemSchema).min(1, "At least one item is required"),
//   additionalNotes: z.string().optional(),
//   attachment: z.any().optional(), // For file input
// });

// // Dummy data for dropdowns
// const vendors = [
//   { id: 1, name: "CloudHost Solutions", contact: "Alice Smith", email: "alice@cloudhost.com", mobile: "9876543210" },
//   { id: 2, name: "Hardware Hub Inc.", contact: "Bob Johnson", email: "bob@hardwarehub.com", mobile: "9988776655" },
//   { id: 3, name: "Software Innovations", contact: "Charlie Brown", email: "charlie@softwareinnovations.com", mobile: "9123456789" },
// ];

// const paymentTermsOptions = [
//   "Net 15", "Net 30", "Net 45", "Net 60", "Advance 50%", "Advance 100%"
// ];

// const productServices = [
//   { id: 1, name: "Domain Registration (1 year)", description: "Annual domain registration for .com", hsnSac: "998313" },
//   { id: 2, name: "Cloud Hosting (Standard)", description: "Standard cloud hosting package, 10GB SSD", hsnSac: "998314" },
//   { id: 3, name: "Laptop (Dell XPS 15)", description: "Dell XPS 15, i7, 16GB RAM, 512GB SSD", hsnSac: "847130" },
//   { id: 4, name: "Microsoft Office 365 (Annual)", description: "Annual subscription for Microsoft Office 365 Business Standard", hsnSac: "998430" },
//   { id: 5, name: "IT Consulting Services", description: "Hourly IT consulting for network setup", hsnSac: "998311" },
// ];

// export default function PurchaseOrder() {
//   const [poData, setPoData] = useState({
//     poNumber: `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`,
//     poDate: new Date().toISOString().split('T')[0],
//     vendor: '',
//     vendorContactPerson: '',
//     vendorMobileEmail: '',
//     referenceNo: '',
//     deliveryDate: '',
//     paymentTerms: '',
//     purchaseType: 'Goods',
//     items: [{
//       productService: '',
//       description: '',
//       hsnSacCode: '',
//       quantity: 1,
//       unitPrice: 0,
//       discount: 0,
//       gst: 0,
//     }],
//     additionalNotes: '',
//     attachment: null,
//   });

//   const [errors, setErrors] = useState({});

//   // Helper function to format currency
//   const formatCurrency = (amount) => {
//     return `₹${(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   // Calculate item-wise totals
//   const calculateItemTotals = (item) => {
//     const quantity = parseFloat(item.quantity) || 0;
//     const unitPrice = parseFloat(item.unitPrice) || 0;
//     const discount = parseFloat(item.discount) || 0;
//     const gst = parseFloat(item.gst) || 0;

//     const amountBeforeDiscount = quantity * unitPrice;
//     const itemDiscountAmount = amountBeforeDiscount * (discount / 100);
//     const amountAfterDiscount = amountBeforeDiscount - itemDiscountAmount;
//     const itemGSTAmount = amountAfterDiscount * (gst / 100);
//     const itemTotal = amountAfterDiscount + itemGSTAmount;

//     return {
//       amountBeforeDiscount,
//       itemDiscountAmount,
//       itemGSTAmount,
//       itemTotal,
//     };
//   };

//   // Calculate summary totals using useMemo for optimization
//   const summaryTotals = useMemo(() => {
//     let subtotal = 0; // Sum of (Qty * Rate)
//     let totalDiscount = 0; // Sum of (Qty * Rate * Discount%)
//     let totalGST = 0; // Sum of ((Qty * Rate - Discount) * GST%)
//     let grandTotal = 0;

//     poData.items.forEach(item => {
//       const { amountBeforeDiscount, itemDiscountAmount, itemGSTAmount, itemTotal } = calculateItemTotals(item);
//       subtotal += amountBeforeDiscount;
//       totalDiscount += itemDiscountAmount;
//       totalGST += itemGSTAmount;
//       grandTotal += itemTotal;
//     });

//     return {
//       subtotal,
//       totalDiscount,
//       totalGST,
//       grandTotal,
//     };
//   }, [poData.items]);

//   // Handle basic details input changes
//   const handleBasicDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setPoData(prev => ({ ...prev, [name]: value }));

//     // Autofill vendor contact/email/mobile
//     if (name === "vendor") {
//       const selectedVendor = vendors.find(v => v.name === value);
//       if (selectedVendor) {
//         setPoData(prev => ({
//           ...prev,
//           vendorContactPerson: selectedVendor.contact,
//           vendorMobileEmail: `${selectedVendor.mobile} / ${selectedVendor.email}`,
//         }));
//       } else {
//         setPoData(prev => ({
//           ...prev,
//           vendorContactPerson: '',
//           vendorMobileEmail: '',
//         }));
//       }
//     }
//   };

//   // Handle item input changes
//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const newItems = [...poData.items];
//     let parsedValue = value;

//     if (name === "quantity" || name === "unitPrice" || name === "discount" || name === "gst") {
//       parsedValue = parseFloat(value);
//       if (isNaN(parsedValue)) parsedValue = 0;
//     }

//     newItems[index] = { ...newItems[index], [name]: parsedValue };

//     // Autofill product/service description and HSN/SAC code
//     if (name === "productService") {
//       const selectedProduct = productServices.find(p => p.name === value);
//       if (selectedProduct) {
//         newItems[index].description = selectedProduct.description;
//         newItems[index].hsnSacCode = selectedProduct.hsnSac;
//       } else {
//         newItems[index].description = '';
//         newItems[index].hsnSacCode = '';
//       }
//     }

//     setPoData(prev => ({ ...prev, items: newItems }));
//   };

//   // Add a new item row
//   const handleAddItem = () => {
//     setPoData(prev => ({
//       ...prev,
//       items: [...prev.items, {
//         productService: '',
//         description: '',
//         hsnSacCode: '',
//         quantity: 1,
//         unitPrice: 0,
//         discount: 0,
//         gst: 0,
//       }],
//     }));
//   };

//   // Delete an item row
//   const handleDeleteItem = (index) => {
//     setPoData(prev => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== index),
//     }));
//   };

//   // Handle file attachment
//   const handleAttachmentChange = (e) => {
//     setPoData(prev => ({ ...prev, attachment: e.target.files[0] }));
//   };

//   // Form submission handlers
//   const validateForm = () => {
//     try {
//       purchaseOrderSchema.parse(poData);
//       setErrors({});
//       return true;
//     } catch (e) {
//       const newErrors = {};
//       e.errors.forEach(err => {
//         if (err.path.length === 1) {
//           newErrors[err.path[0]] = err.message;
//         } else if (err.path.length === 2 && err.path[0] === 'items') {
//           // Handle item-specific errors, e.g., items[0].quantity
//           const itemIndex = err.path[1];
//           const fieldName = err.path[2];
//           if (!newErrors.items) newErrors.items = {};
//           if (!newErrors.items[itemIndex]) newErrors.items[itemIndex] = {};
//           newErrors.items[itemIndex][fieldName] = err.message;
//         }
//       });
//       setErrors(newErrors);
//       return false;
//     }
//   };

//   const handleSaveAsDraft = (e) => {
//     e.preventDefault();
//     // For draft, we might not need full validation, or a subset
//     console.log("Saving as Draft:", poData);
//     alert("Purchase Order saved as draft!");
//   };

//   const handleSubmitPO = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       console.log("Submitting Purchase Order:", poData);
//       alert("Purchase Order submitted successfully!");
//       // Here you would typically send data to an API
//     } else {
//       alert("Please correct the errors in the form.");
//     }
//   };

//   const handleDownloadPDF = () => {
//     alert("Downloading Purchase Order as PDF...");
//     // Implement PDF generation logic here
//   };

//   const handleEmailToVendor = () => {
//     alert("Sending Purchase Order as PDF to vendor...");
//     // Implement email sending logic here
//   };

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen p-6">
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 p-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">Purchase Order</h1>
//         <p className="text-gray-600 mb-8">Create and manage purchase orders for products and services.</p>

//         <form onSubmit={handleSubmitPO}>
//           {/* Basic Details */}
//           <section className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Basic Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div>
//                 <label htmlFor="poNumber" className="block text-sm font-medium text-gray-700 mb-1">PO Number</label>
//                 <input
//                   type="text"
//                   id="poNumber"
//                   name="poNumber"
//                   value={poData.poNumber}
//                   readOnly
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//                 />
//                 {errors.poNumber && <p className="text-red-500 text-xs mt-1">{errors.poNumber}</p>}
//               </div>
//               <div>
//                 <label htmlFor="poDate" className="block text-sm font-medium text-gray-700 mb-1">PO Date</label>
//                 <input
//                   type="date"
//                   id="poDate"
//                   name="poDate"
//                   value={poData.poDate}
//                   onChange={handleBasicDetailsChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//                 {errors.poDate && <p className="text-red-500 text-xs mt-1">{errors.poDate}</p>}
//               </div>
//               <div>
//                 <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
//                 <select
//                   id="vendor"
//                   name="vendor"
//                   value={poData.vendor}
//                   onChange={handleBasicDetailsChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 >
//                   <option value="">Select Vendor</option>
//                   {vendors.map(vendor => (
//                     <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
//                   ))}
//                 </select>
//                 {errors.vendor && <p className="text-red-500 text-xs mt-1">{errors.vendor}</p>}
//               </div>
//               <div>
//                 <label htmlFor="vendorContactPerson" className="block text-sm font-medium text-gray-700 mb-1">Vendor Contact Person</label>
//                 <input
//                   type="text"
//                   id="vendorContactPerson"
//                   name="vendorContactPerson"
//                   value={poData.vendorContactPerson}
//                   onChange={handleBasicDetailsChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="vendorMobileEmail" className="block text-sm font-medium text-gray-700 mb-1">Vendor Mobile / Email</label>
//                 <input
//                   type="text"
//                   id="vendorMobileEmail"
//                   name="vendorMobileEmail"
//                   value={poData.vendorMobileEmail}
//                   onChange={handleBasicDetailsChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="referenceNo" className="block text-sm font-medium text-gray-700 mb-1">Reference No.</label>
//                 <input
//                   type="text"
//                   id="referenceNo"
//                   name="referenceNo"
//                   value={poData.referenceNo}
//                   onChange={handleBasicDetailsChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
//                 <input
//                   type="date"
//                   id="deliveryDate"
//                   name="deliveryDate"
//                   value={poData.deliveryDate}
//                   onChange={handleBasicDetailsChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//                 {errors.deliveryDate && <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>}
//               </div>
//               <div>
//                 <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
//                 <select
//                   id="paymentTerms"
//                   name="paymentTerms"
//                   value={poData.paymentTerms}
//                   onChange={handleBasicDetailsChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 >
//                   <option value="">Select Payment Terms</option>
//                   {paymentTermsOptions.map((term, index) => (
//                     <option key={index} value={term}>{term}</option>
//                   ))}
//                 </select>
//                 {errors.paymentTerms && <p className="text-red-500 text-xs mt-1">{errors.paymentTerms}</p>}
//               </div>
//               <div>
//                 <label htmlFor="purchaseType" className="block text-sm font-medium text-gray-700 mb-1">Purchase Type</label>
//                 <select
//                   id="purchaseType"
//                   name="purchaseType"
//                   value={poData.purchaseType}
//                   onChange={handleBasicDetailsChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 >
//                   <option value="Goods">Goods</option>
//                   <option value="Services">Services</option>
//                 </select>
//                 {errors.purchaseType && <p className="text-red-500 text-xs mt-1">{errors.purchaseType}</p>}
//               </div>
//             </div>
//           </section>

//           {/* Items Table */}
//           <section className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Items Table</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product/Service</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">HSN/SAC Code</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Unit Price (₹)</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Discount (%)</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">GST (%)</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {poData.items.map((item, index) => (
//                     <tr key={index}>
//                       <td className="p-2 whitespace-nowrap">
//                         <select
//                           name="productService"
//                           value={item.productService}
//                           onChange={(e) => handleItemChange(index, e)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                         >
//                           <option value="">Select Product/Service</option>
//                           {productServices.map(prod => (
//                             <option key={prod.id} value={prod.name}>{prod.name}</option>
//                           ))}
//                         </select>
//                         {errors.items && errors.items[index] && errors.items[index].productService && (
//                           <p className="text-red-500 text-xs mt-1">{errors.items[index].productService}</p>
//                         )}
//                       </td>
//                       <td className="p-2 whitespace-nowrap">
//                         <textarea
//                           name="description"
//                           value={item.description}
//                           onChange={(e) => handleItemChange(index, e)}
//                           rows="2"
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                           placeholder="Description"
//                         ></textarea>
//                       </td>
//                       <td className="p-2 whitespace-nowrap">
//                         <input
//                           type="text"
//                           name="hsnSacCode"
//                           value={item.hsnSacCode}
//                           onChange={(e) => handleItemChange(index, e)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                           placeholder="HSN/SAC"
//                         />
//                       </td>
//                       <td className="p-2 whitespace-nowrap">
//                         <input
//                           type="number"
//                           name="quantity"
//                           value={item.quantity}
//                           onChange={(e) => handleItemChange(index, e)}
//                           min="1"
//                           className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                         />
//                         {errors.items && errors.items[index] && errors.items[index].quantity && (
//                           <p className="text-red-500 text-xs mt-1">{errors.items[index].quantity}</p>
//                         )}
//                       </td>
//                       <td className="p-2 whitespace-nowrap">
//                         <input
//                           type="number"
//                           name="unitPrice"
//                           value={item.unitPrice}
//                           onChange={(e) => handleItemChange(index, e)}
//                           min="0"
//                           step="0.01"
//                           className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                         />
//                         {errors.items && errors.items[index] && errors.items[index].unitPrice && (
//                           <p className="text-red-500 text-xs mt-1">{errors.items[index].unitPrice}</p>
//                         )}
//                       </td>
//                       <td className="p-2 whitespace-nowrap">
//                         <input
//                           type="number"
//                           name="discount"
//                           value={item.discount}
//                           onChange={(e) => handleItemChange(index, e)}
//                           min="0"
//                           max="100"
//                           step="0.01"
//                           className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                         />
//                       </td>
//                       <td className="p-2 whitespace-nowrap">
//                         <input
//                           type="number"
//                           name="gst"
//                           value={item.gst}
//                           onChange={(e) => handleItemChange(index, e)}
//                           min="0"
//                           max="100"
//                           step="0.01"
//                           className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                         />
//                       </td>
//                       <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {formatCurrency(calculateItemTotals(item).itemTotal)}
//                       </td>
//                       <td className="p-2 whitespace-nowrap text-center">
//                         <button
//                           type="button"
//                           onClick={() => handleDeleteItem(index)}
//                           className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200"
//                           title="Delete Item"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {errors.items && typeof errors.items === 'string' && (
//               <p className="text-red-500 text-xs mt-2">{errors.items}</p>
//             )}
//             <button
//               type="button"
//               onClick={handleAddItem}
//               className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
//             >
//               <Plus className="w-4 h-4 mr-2" /> Add Item
//             </button>
//           </section>

//           {/* Summary & Notes */}
//           <section className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Summary & Notes</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center text-gray-700">
//                   <span className="font-medium">Subtotal:</span>
//                   <span className="font-semibold">{formatCurrency(summaryTotals.subtotal)}</span>
//                 </div>
//                 <div className="flex justify-between items-center text-gray-700">
//                   <span className="font-medium">Total Discount:</span>
//                   <span className="font-semibold text-red-600">{formatCurrency(summaryTotals.totalDiscount)}</span>
//                 </div>
//                 <div className="flex justify-between items-center text-gray-700">
//                   <span className="font-medium">Total GST:</span>
//                   <span className="font-semibold">{formatCurrency(summaryTotals.totalGST)}</span>
//                 </div>
//                 <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center text-lg font-bold text-gray-900">
//                   <span>Grand Total (₹):</span>
//                   <span>{formatCurrency(summaryTotals.grandTotal)}</span>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
//                   <textarea
//                     id="additionalNotes"
//                     name="additionalNotes"
//                     value={poData.additionalNotes}
//                     onChange={handleBasicDetailsChange}
//                     rows="4"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Any special instructions or remarks..."
//                   ></textarea>
//                 </div>
//                 <div>
//                   <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">Attachment (PDF/Doc)</label>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="file"
//                       id="attachment"
//                       name="attachment"
//                       onChange={handleAttachmentChange}
//                       className="hidden"
//                     />
//                     <label
//                       htmlFor="attachment"
//                       className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
//                     >
//                       <Paperclip className="w-4 h-4 mr-2" /> Choose File
//                     </label>
//                     {poData.attachment && (
//                       <span className="text-sm text-gray-600">{poData.attachment.name}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Actions */}
//           <section className="flex flex-col sm:flex-row justify-end gap-4">
//             <button
//               type="button"
//               onClick={handleSaveAsDraft}
//               className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
//             >
//               <Save className="inline-block w-5 h-5 mr-2" /> Save as Draft
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
//             >
//               <Send className="inline-block w-5 h-5 mr-2" /> Submit PO
//             </button>
            // <button
            //   type="button"
            //   onClick={handleDownloadPDF}
            //   className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
            // >
            //   <Download className="inline-block w-5 h-5 mr-2" /> Download PDF
            // </button>
            // <button
            //   type="button"
            //   onClick={handleEmailToVendor}
            //   className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
            // >
            //   <Mail className="inline-block w-5 h-5 mr-2" /> Email to Vendor
            // </button>
//           </section>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { Plus, Trash2, Download, Mail, Save, Send, Paperclip } from 'lucide-react';

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

export default function PurchaseOrder({ initialData, onSave, onClose, readOnly }) {
  const [poData, setPoData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        poDate: initialData.poDate || new Date().toISOString().split('T')[0],
        deliveryDate: initialData.deliveryDate || '',
        items: initialData.items || [{
          productService: '',
          description: '',
          hsnSacCode: '',
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          gst: 0,
        }],
      };
    }
    return {
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
    };
  });

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
    if (readOnly) return;
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

  // Handle item input changes
  const handleItemChange = (index, e) => {
    if (readOnly) return;
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

  // Add a new item row
  const handleAddItem = () => {
    if (readOnly) return;
    setPoData(prev => ({
      ...prev,
      items: [...prev.items, {
        productService: '',
        description: '',
        hsnSacCode: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        gst: 0,
      }],
    }));
  };

  // Delete an item row
  const handleDeleteItem = (index) => {
    if (readOnly) return;
    setPoData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Handle file attachment
  const handleAttachmentChange = (e) => {
    if (readOnly) return;
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
    onSave(poData, 'draft');
    onClose();
  };

  const handleSubmitPO = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(poData, 'pending'); // Assuming 'pending' for submitted POs
      onClose();
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

  return (
    <div className="max-w-full mx-auto">
      <form onSubmit={handleSubmitPO}>
        {/* Basic Details */}
        <section className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="poNumber" className="block text-sm font-medium text-gray-700 mb-1">PO Number</label>
              <input
                type="text"
                id="poNumber"
                name="poNumber"
                value={poData.poNumber}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              {errors.poNumber && <p className="text-red-500 text-xs mt-1">{errors.poNumber}</p>}
            </div>
            <div>
              <label htmlFor="poDate" className="block text-sm font-medium text-gray-700 mb-1">PO Date</label>
              <input
                type="date"
                id="poDate"
                name="poDate"
                value={poData.poDate}
                onChange={handleBasicDetailsChange}
                readOnly={readOnly}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.poDate && <p className="text-red-500 text-xs mt-1">{errors.poDate}</p>}
            </div>
            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <select
                id="vendor"
                name="vendor"
                value={poData.vendor}
                onChange={handleBasicDetailsChange}
                disabled={readOnly}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Vendor</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                ))}
              </select>
              {errors.vendor && <p className="text-red-500 text-xs mt-1">{errors.vendor}</p>}
            </div>
            <div>
              <label htmlFor="vendorContactPerson" className="block text-sm font-medium text-gray-700 mb-1">Vendor Contact Person</label>
              <input
                type="text"
                id="vendorContactPerson"
                name="vendorContactPerson"
                value={poData.vendorContactPerson}
                onChange={handleBasicDetailsChange}
                readOnly={readOnly}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="vendorMobileEmail" className="block text-sm font-medium text-gray-700 mb-1">Vendor Mobile / Email</label>
              <input
                type="text"
                id="vendorMobileEmail"
                name="vendorMobileEmail"
                value={poData.vendorMobileEmail}
                onChange={handleBasicDetailsChange}
                readOnly={readOnly}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="referenceNo" className="block text-sm font-medium text-gray-700 mb-1">Reference No.</label>
              <input
                type="text"
                id="referenceNo"
                name="referenceNo"
                value={poData.referenceNo}
                onChange={handleBasicDetailsChange}
                readOnly={readOnly}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={poData.deliveryDate}
                onChange={handleBasicDetailsChange}
                readOnly={readOnly}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.deliveryDate && <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>}
            </div>
            <div>
              <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
              <select
                id="paymentTerms"
                name="paymentTerms"
                value={poData.paymentTerms}
                onChange={handleBasicDetailsChange}
                disabled={readOnly}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Payment Terms</option>
                {paymentTermsOptions.map((term, index) => (
                  <option key={index} value={term}>{term}</option>
                ))}
              </select>
              {errors.paymentTerms && <p className="text-red-500 text-xs mt-1">{errors.paymentTerms}</p>}
            </div>
            <div>
              <label htmlFor="purchaseType" className="block text-sm font-medium text-gray-700 mb-1">Purchase Type</label>
              <select
                id="purchaseType"
                name="purchaseType"
                value={poData.purchaseType}
                onChange={handleBasicDetailsChange}
                disabled={readOnly}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Goods">Goods</option>
                <option value="Services">Services</option>
              </select>
              {errors.purchaseType && <p className="text-red-500 text-xs mt-1">{errors.purchaseType}</p>}
            </div>
          </div>
        </section>

        {/* Items Table */}
        <section className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Items Table</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product/Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">HSN/SAC Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Unit Price (₹)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Discount (%)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">GST (%)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
                  {!readOnly && <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {poData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 whitespace-nowrap">
                      <select
                        name="productService"
                        value={item.productService}
                        onChange={(e) => handleItemChange(index, e)}
                        disabled={readOnly}
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
                        readOnly={readOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Description"
                      ></textarea>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <input
                        type="text"
                        name="hsnSacCode"
                        value={item.hsnSacCode}
                        onChange={(e) => handleItemChange(index, e)}
                        readOnly={readOnly}
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
                        readOnly={readOnly}
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
                        readOnly={readOnly}
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
                        readOnly={readOnly}
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
                        readOnly={readOnly}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(calculateItemTotals(item).itemTotal)}
                    </td>
                    {!readOnly && (
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
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {errors.items && typeof errors.items === 'string' && (
            <p className="text-red-500 text-xs mt-2">{errors.items}</p>
          )}
          {!readOnly && (
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </button>
          )}
        </section>

        {/* Summary & Notes */}
        <section className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Summary & Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
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
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={poData.additionalNotes}
                  onChange={handleBasicDetailsChange}
                  rows="4"
                  readOnly={readOnly}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Any special instructions or remarks..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">Attachment (PDF/Doc)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="attachment"
                    name="attachment"
                    onChange={handleAttachmentChange}
                    disabled={readOnly}
                    className="hidden"
                  />
                  {!readOnly && (
                    <label
                      htmlFor="attachment"
                      className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
                    >
                      <Paperclip className="w-4 h-4 mr-2" /> Choose File
                    </label>
                  )}
                  {poData.attachment && (
                    <span className="text-sm text-gray-600">{poData.attachment.name}</span>
                  )}
                  {readOnly && !poData.attachment && (
                    <span className="text-sm text-gray-500">No attachment</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        {!readOnly && (
          <section className="flex flex-col sm:flex-row justify-end gap-4">
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
              <Send className="inline-block w-5 h-5 mr-2" /> Submit PO
            </button>
          </section>
        )}
        {readOnly && (
          <section className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
            >
              <Download className="inline-block w-5 h-5 mr-2" /> Download PDF
            </button>
            <button
              type="button"
              onClick={handleEmailToVendor}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
            >
              <Mail className="inline-block w-5 h-5 mr-2" /> Email to Vendor
            </button>
          </section>
        )}
      </form>
    </div>
  );
}
