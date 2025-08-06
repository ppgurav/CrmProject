
import { useState, useEffect } from "react"
import { z } from "zod"
import {
  Plus,
  User,
  CheckSquare,
  Calculator,
  Send,
  Download,
  Mail,
  Trash2,
  FileText,
  MessageCircle,
  X,
} from "lucide-react"

// Zod schemas for validation
const invoiceItemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  hsn: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be positive"),
  gstRate: z.number().min(0).max(100, "GST rate must be between 0-100"),
  gstAmount: z.number().min(0),
  lineTotal: z.number().min(0),
})

const invoiceSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  paymentTerms: z.string().optional(),
  remarks: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  tdsAmount: z.number().min(0).optional(),
})

const products = [
  { value: "web-design", label: "Web Design Services", hsn: "998314" },
  { value: "web-development", label: "Web Development", hsn: "998314" },
  { value: "mobile-app", label: "Mobile App Development", hsn: "998314" },
  { value: "seo-services", label: "SEO Services", hsn: "998314" },
  { value: "digital-marketing", label: "Digital Marketing", hsn: "998314" },
  { value: "graphic-design", label: "Graphic Design", hsn: "998314" },
  { value: "content-writing", label: "Content Writing", hsn: "998314" },
  { value: "consulting", label: "IT Consulting", hsn: "998314" },
  { value: "hosting", label: "Web Hosting", hsn: "998314" },
  { value: "maintenance", label: "Website Maintenance", hsn: "998314" },
]

const customers = [
  { value: "1", label: "John Smith - ABC Corp" },
  { value: "2", label: "Sarah Johnson - XYZ Ltd" },
  { value: "3", label: "Mike Davis - Tech Solutions" },
  { value: "4", label: "Emily Chen - Design Studio" },
  { value: "5", label: "David Wilson - Marketing Pro" },
]

const gstRates = [
  { value: 0, label: "0%" },
  { value: 5, label: "5%" },
  { value: 12, label: "12%" },
  { value: 18, label: "18%" },
  { value: 28, label: "28%" },
]

export default function AddInvoice() {
  const [modalOpen, setModalOpen] = useState(false)
  const [errors, setErrors] = useState({})

  // Form states
  const [formData, setFormData] = useState({
    customer: "",
    invoiceDate: "",
    dueDate: "",
    paymentTerms: "",
    remarks: "",
    tdsAmount: 0,
  })

  const [items, setItems] = useState([])
  const [modalFormData, setModalFormData] = useState({
    product: "",
    hsn: "",
    quantity: 1,
    rate: 0,
    gstRate: 18,
    gstAmount: 0,
    lineTotal: 0,
  })

  // Set default dates
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)
    setFormData((prev) => ({
      ...prev,
      invoiceDate: today,
      dueDate: dueDate.toISOString().split("T")[0],
    }))
  }, [])

  // Calculate modal totals
  useEffect(() => {
    const { quantity, rate, gstRate } = modalFormData
    const subtotal = quantity * rate
    const gstAmount = (subtotal * gstRate) / 100
    const lineTotal = subtotal + gstAmount
    setModalFormData((prev) => ({
      ...prev,
      gstAmount: Number.parseFloat(gstAmount.toFixed(2)),
      lineTotal: Number.parseFloat(lineTotal.toFixed(2)),
    }))
  }, [modalFormData.quantity, modalFormData.rate, modalFormData.gstRate])

  // Calculate invoice totals
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
    const totalGst = items.reduce((sum, item) => sum + item.gstAmount, 0)
    const netPayable = subtotal + totalGst - (formData.tdsAmount || 0)
    return {
      subtotal: subtotal.toFixed(2),
      totalGst: totalGst.toFixed(2),
      tdsAmount: (formData.tdsAmount || 0).toFixed(2),
      netPayable: netPayable.toFixed(2),
    }
  }

  const totals = calculateTotals()

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleModalInputChange = (e) => {
    const { name, value, type } = e.target
    let processedValue = value
    if (type === "number") {
      processedValue = Number.parseFloat(value) || 0
    }

    // Handle product selection and auto-fill HSN
    if (name === "product") {
      const selectedProduct = products.find((p) => p.value === value)
      setModalFormData((prev) => ({
        ...prev,
        [name]: processedValue,
        hsn: selectedProduct ? selectedProduct.hsn : "",
      }))
    } else {
      setModalFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }))
    }
  }

  const addItem = (e) => {
    e.preventDefault()
    try {
      const selectedProduct = products.find((p) => p.value === modalFormData.product)
      const itemData = {
        ...modalFormData,
        product: selectedProduct ? selectedProduct.label : modalFormData.product,
        id: Date.now(),
      }
      invoiceItemSchema.parse(itemData)
      setItems((prev) => [...prev, itemData])
      setModalFormData({
        product: "",
        hsn: "",
        quantity: 1,
        rate: 0,
        gstRate: 18,
        gstAmount: 0,
        lineTotal: 0,
      })
      setModalOpen(false)
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {}
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message
        })
        setErrors(newErrors)
      }
    }
  }

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      const invoiceData = {
        ...formData,
        items,
        tdsAmount: formData.tdsAmount || 0,
      }
      invoiceSchema.parse(invoiceData)
      alert("Invoice saved successfully!")
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {}
        error.errors.forEach((err) => {
          newErrors[err.path.join(".")] = err.message
        })
        setErrors(newErrors)
      }
    }
  }

  const generatePDF = () => {
    alert("PDF generation functionality would be implemented here")
  }

  const sendViaWhatsApp = () => {
    alert("WhatsApp integration would be implemented here")
  }

  const sendViaEmail = () => {
    alert("Email integration would be implemented here")
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6">
        <div className="max-w-full mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            {/* <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Invoice</h1> */}
            {/* <p className="text-gray-600">Generate professional invoices for your clients</p> */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Customer & Invoice Details */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Customer & Invoice Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer */}
                <div>
                  <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="customer"
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={customer.value} value={customer.value}>
                        {customer.label}
                      </option>
                    ))}
                  </select>
                  {errors.customer && <p className="mt-1 text-sm text-red-600">{errors.customer}</p>}
                </div>

                {/* Invoice Date */}
                <div>
                  <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="invoiceDate"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.invoiceDate && <p className="mt-1 text-sm text-red-600">{errors.invoiceDate}</p>}
                </div>

                {/* Due Date */}
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
                </div>

                {/* Payment Terms */}
                <div>
                  <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    id="paymentTerms"
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Net 30, Due on receipt"
                  />
                </div>

                {/* Remarks / Notes */}
                <div className="md:col-span-2">
                  <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks / Notes
                  </label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    rows="3"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Additional notes or remarks for this invoice..."
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Invoice Items */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <CheckSquare className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Invoice Items</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Plus className="inline-block w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>

              {/* Items Table */}
              {items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product/Service
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          HSN/SAC
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate (₹)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          GST (%)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          GST Amount (₹)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Line Total (₹)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-4 text-sm text-gray-900">{item.product}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">{item.hsn}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">₹{item.rate.toFixed(2)}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{item.gstRate}%</td>
                          <td className="px-4 py-4 text-sm text-gray-900">₹{item.gstAmount.toFixed(2)}</td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">₹{item.lineTotal.toFixed(2)}</td>
                          <td className="px-4 py-4 text-sm">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                              title="Remove item"
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
              {errors.items && <p className="mt-2 text-sm text-red-600">{errors.items}</p>}
            </div>

            {/* Section 3: Invoice Summary */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Invoice Summary</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side - TDS Amount */}
                <div>
                  <label htmlFor="tdsAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    TDS Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="tdsAmount"
                    name="tdsAmount"
                    min="0"
                    step="0.01"
                    value={formData.tdsAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>

                {/* Right side - Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">₹{totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total GST:</span>
                      <span className="font-medium">₹{totals.totalGst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">TDS Amount:</span>
                      <span className="font-medium">₹{totals.tdsAmount}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Net Payable:</span>
                        <span className="text-lg font-bold text-indigo-600">₹{totals.netPayable}</span>
                      </div>
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
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <FileText className="inline-block w-5 h-5 mr-2" />
                  Save Invoice
                </button>

                <button
                  type="button"
                  onClick={generatePDF}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Download className="inline-block w-5 h-5 mr-2" />
                  Generate PDF
                </button>

                <button
                  type="button"
                  onClick={sendViaWhatsApp}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <MessageCircle className="inline-block w-5 h-5 mr-2" />
                  Send via WhatsApp
                </button>

                <button
                  type="button"
                  onClick={sendViaEmail}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Mail className="inline-block w-5 h-5 mr-2" />
                  Send via Email
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Add Item Modal */}
      {modalOpen && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
         <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Add Product/Service</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={addItem}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product/Service */}
                  <div className="md:col-span-2">
                    <label htmlFor="modalProduct" className="block text-sm font-medium text-gray-700 mb-2">
                      Product/Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="modalProduct"
                      name="product"
                      value={modalFormData.product}
                      onChange={handleModalInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select product/service</option>
                      {products.map((product) => (
                        <option key={product.value} value={product.value}>
                          {product.label}
                        </option>
                      ))}
                    </select>
                    {errors.product && <p className="mt-1 text-sm text-red-600">{errors.product}</p>}
                  </div>

                  {/* HSN/SAC Code */}
                  <div>
                    <label htmlFor="modalHsn" className="block text-sm font-medium text-gray-700 mb-2">
                      HSN/SAC Code
                    </label>
                    <input
                      type="text"
                      id="modalHsn"
                      name="hsn"
                      value={modalFormData.hsn}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none transition-all duration-200"
                      placeholder="Auto-filled"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label htmlFor="modalQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="modalQuantity"
                      name="quantity"
                      min="1"
                      step="1"
                      value={modalFormData.quantity}
                      onChange={handleModalInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="1"
                    />
                    {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                  </div>

                  {/* Rate */}
                  <div>
                    <label htmlFor="modalRate" className="block text-sm font-medium text-gray-700 mb-2">
                      Rate (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="modalRate"
                      name="rate"
                      min="0"
                      step="0.01"
                      value={modalFormData.rate}
                      onChange={handleModalInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                    {errors.rate && <p className="mt-1 text-sm text-red-600">{errors.rate}</p>}
                  </div>

                  {/* GST Rate */}
                  <div>
                    <label htmlFor="modalGstRate" className="block text-sm font-medium text-gray-700 mb-2">
                      GST Rate (%) <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="modalGstRate"
                      name="gstRate"
                      value={modalFormData.gstRate}
                      onChange={handleModalInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      {gstRates.map((rate) => (
                        <option key={rate.value} value={rate.value}>
                          {rate.label}
                        </option>
                      ))}
                    </select>
                    {errors.gstRate && <p className="mt-1 text-sm text-red-600">{errors.gstRate}</p>}
                  </div>

                  {/* GST Amount (Read-only) */}
                  <div>
                    <label htmlFor="modalGstAmount" className="block text-sm font-medium text-gray-700 mb-2">
                      GST Amount (₹)
                    </label>
                    <input
                      type="text"
                      id="modalGstAmount"
                      name="gstAmount"
                      value={modalFormData.gstAmount.toFixed(2)}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Line Total (Read-only) */}
                  <div>
                    <label htmlFor="modalLineTotal" className="block text-sm font-medium text-gray-700 mb-2">
                      Line Total (₹)
                    </label>
                    <input
                      type="text"
                      id="modalLineTotal"
                      name="lineTotal"
                      value={modalFormData.lineTotal.toFixed(2)}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none transition-all duration-200 font-semibold"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
