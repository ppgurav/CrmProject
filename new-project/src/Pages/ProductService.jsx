
// import { useState } from "react"
// import { z } from "zod"
// import { Package, Tag, FileText, DollarSign, Receipt, Hash, Power } from "lucide-react"

// const productSchema = z.object({
//   productName: z.string().min(1, "Product name is required"),
//   productType: z.enum(["Product", "Service"], {
//     required_error: "Product type is required",
//   }),
//   category: z.enum(["Domain", "Hosting", "Email", "Website"], {
//     required_error: "Category is required",
//   }),
//   description: z.string().optional(),
//   unitPrice: z.number().min(0, "Unit price must be positive"),
//   gstRate: z.enum(["0", "5", "12", "18", "28"], {
//     required_error: "GST rate is required",
//   }),
//   hsnSacCode: z.string().min(6, "HSN/SAC code must be at least 6 digits"),
//   activeStatus: z.enum(["Active", "Inactive"], {
//     required_error: "Active status is required",
//   }),
// })

// export default function ProductService() {
//   const [formData, setFormData] = useState({
//     productName: "",
//     productType: "",
//     category: "",
//     description: "",
//     unitPrice: "",
//     gstRate: "",
//     hsnSacCode: "",
//     activeStatus: "Active",
//   })

//   const [errors, setErrors] = useState({})
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))

//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({
//         ...prev,
//         [field]: undefined,
//       }))
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setErrors({})

//     try {
//       // Convert unitPrice to number for validation
//       const dataToValidate = {
//         ...formData,
//         unitPrice: formData.unitPrice ? Number.parseFloat(formData.unitPrice) : 0,
//       }

//       const validatedData = productSchema.parse(dataToValidate)

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       console.log("Form submitted successfully:", validatedData)
//       alert("Product saved successfully!")

//       // Reset form
//       setFormData({
//         productName: "",
//         productType: "",
//         category: "",
//         description: "",
//         unitPrice: "",
//         gstRate: "",
//         hsnSacCode: "",
//         activeStatus: "Active",
//       })
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const fieldErrors = {}
//         error.errors.forEach((err) => {
//           fieldErrors[err.path[0]] = err.message
//         })
//         setErrors(fieldErrors)
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 py-10 px-4">
//       <div className="max-w-full mx-auto ml-6 mr-4">
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           <div className="mb-8">
//             {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1> */}
//             {/* <p className="text-gray-600">Fill in the details to add a new product to your inventory</p> */}
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Product Name */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <Package className="w-4 h-4 mr-2" />
//                 Product Name *
//               </label>
//               <input
//                 type="text"
//                 value={formData.productName}
//                 onChange={(e) => handleInputChange("productName", e.target.value)}
//                 placeholder="e.g., TickZap - 3 Year Panel"
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                   errors.productName ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.productName && <p className="mt-1 text-sm text-red-600">{errors.productName}</p>}
//             </div>

//             {/* Product Type */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <Tag className="w-4 h-4 mr-2" />
//                 Product Type *
//               </label>
//               <select
//                 value={formData.productType}
//                 onChange={(e) => handleInputChange("productType", e.target.value)}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                   errors.productType ? "border-red-500" : "border-gray-300"
//                 }`}
//               >
//                 <option value="">Select product type</option>
//                 <option value="Product">Product</option>
//                 <option value="Service">Service</option>
//               </select>
//               {errors.productType && <p className="mt-1 text-sm text-red-600">{errors.productType}</p>}
//             </div>

//             {/* Category */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <FileText className="w-4 h-4 mr-2" />
//                 Category *
//               </label>
//               <select
//                 value={formData.category}
//                 onChange={(e) => handleInputChange("category", e.target.value)}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                   errors.category ? "border-red-500" : "border-gray-300"
//                 }`}
//               >
//                 <option value="">Select category</option>
//                 <option value="Domain">Domain</option>
//                 <option value="Hosting">Hosting</option>
//                 <option value="Email">Email</option>
//                 <option value="Website">Website</option>
//               </select>
//               {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
//             </div>

//             {/* Description */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <FileText className="w-4 h-4 mr-2" />
//                 Description
//               </label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => handleInputChange("description", e.target.value)}
//                 placeholder="Optional description of the product"
//                 rows={4}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
//               />
//             </div>

//             {/* Unit Price */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <DollarSign className="w-4 h-4 mr-2" />
//                 Unit Price (₹) *
//               </label>
//               <input
//                 type="number"
//                 value={formData.unitPrice}
//                 onChange={(e) => handleInputChange("unitPrice", e.target.value)}
//                 placeholder="0.00"
//                 min="0"
//                 step="0.01"
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                   errors.unitPrice ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.unitPrice && <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>}
//             </div>

//             {/* GST Rate */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <Receipt className="w-4 h-4 mr-2" />
//                 GST Rate (%) *
//               </label>
//               <select
//                 value={formData.gstRate}
//                 onChange={(e) => handleInputChange("gstRate", e.target.value)}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                   errors.gstRate ? "border-red-500" : "border-gray-300"
//                 }`}
//               >
//                 <option value="">Select GST rate</option>
//                 <option value="0">0%</option>
//                 <option value="5">5%</option>
//                 <option value="12">12%</option>
//                 <option value="18">18%</option>
//                 <option value="28">28%</option>
//               </select>
//               {errors.gstRate && <p className="mt-1 text-sm text-red-600">{errors.gstRate}</p>}
//             </div>

//             {/* HSN / SAC Code */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <Hash className="w-4 h-4 mr-2" />
//                 HSN / SAC Code *
//               </label>
//               <input
//                 type="text"
//                 value={formData.hsnSacCode}
//                 onChange={(e) => handleInputChange("hsnSacCode", e.target.value)}
//                 placeholder="6+ digit GST classification code"
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                   errors.hsnSacCode ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.hsnSacCode && <p className="mt-1 text-sm text-red-600">{errors.hsnSacCode}</p>}
//             </div>

//             {/* Active Status */}
//             <div>
//               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                 <Power className="w-4 h-4 mr-2" />
//                 Active Status *
//               </label>
//               <div className="flex items-center space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="activeStatus"
//                     value="Active"
//                     checked={formData.activeStatus === "Active"}
//                     onChange={(e) => handleInputChange("activeStatus", e.target.value)}
//                     className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Active</span>
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="activeStatus"
//                     value="Inactive"
//                     checked={formData.activeStatus === "Inactive"}
//                     onChange={(e) => handleInputChange("activeStatus", e.target.value)}
//                     className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Inactive</span>
//                 </label>
//               </div>
//               {errors.activeStatus && <p className="mt-1 text-sm text-red-600">{errors.activeStatus}</p>}
//             </div>

//             {/* Submit Button */}
//             <div className="pt-6">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//               >
//                 {isSubmitting ? (
//                   <div className="flex items-center justify-center">
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                     Saving Product...
//                   </div>
//                 ) : (
//                   "Save Product"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Package,
  Tag,
  FileText,
  DollarSign,
  Receipt,
  Hash,
  Power,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ProductService() {
  // Sample product data
  const [products, setProducts] = useState([
    {
      id: 1,
      productName: "TickZap - 3 Year Panel",
      productType: "Service",
      category: "Website",
      description: "Complete website management panel for 3 years",
      unitPrice: 15000.0,
      gstRate: "18",
      hsnSacCode: "998314",
      activeStatus: "Active",
    },
    {
      id: 2,
      productName: "Domain Registration",
      productType: "Product",
      category: "Domain",
      description: "Annual domain registration service",
      unitPrice: 1200.0,
      gstRate: "18",
      hsnSacCode: "998313",
      activeStatus: "Active",
    },
    {
      id: 3,
      productName: "Web Hosting Premium",
      productType: "Service",
      category: "Hosting",
      description: "Premium web hosting with 99.9% uptime guarantee",
      unitPrice: 5000.0,
      gstRate: "18",
      hsnSacCode: "998314",
      activeStatus: "Active",
    },
    {
      id: 4,
      productName: "Email Suite Professional",
      productType: "Service",
      category: "Email",
      description: "Professional email hosting with advanced features",
      unitPrice: 3000.0,
      gstRate: "18",
      hsnSacCode: "998314",
      activeStatus: "Inactive",
    },
    {
      id: 5,
      productName: "SSL Certificate",
      productType: "Product",
      category: "Website",
      description: "Extended validation SSL certificate",
      unitPrice: 2500.0,
      gstRate: "18",
      hsnSacCode: "998313",
      activeStatus: "Active",
    },
    {
      id: 6,
      productName: "Website Maintenance",
      productType: "Service",
      category: "Website",
      description: "Monthly website maintenance and updates",
      unitPrice: 8000.0,
      gstRate: "18",
      hsnSacCode: "998314",
      activeStatus: "Active",
    },
  ])

  // Form state for adding new products
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    category: "",
    description: "",
    unitPrice: "",
    gstRate: "",
    hsnSacCode: "",
    activeStatus: "Active",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Table state
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Modal state
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !statusFilter || product.activeStatus === statusFilter
      const matchesCategory = !categoryFilter || product.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })

    // Sort products
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue, bValue

        switch (sortColumn) {
          case "productName":
            aValue = a.productName.toLowerCase()
            bValue = b.productName.toLowerCase()
            break
          case "category":
            aValue = a.category.toLowerCase()
            bValue = b.category.toLowerCase()
            break
          case "unitPrice":
            aValue = a.unitPrice
            bValue = b.unitPrice
            break
          case "activeStatus":
            aValue = a.activeStatus
            bValue = b.activeStatus
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
  }, [products, searchTerm, statusFilter, categoryFilter, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Helper functions
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  
  const navigate = useNavigate()
  const handleAddProduct = () => {
    navigate("/sale/addproduct")
  }
  const getCategoryColor = (category) => {
    switch (category) {
      case "Domain":
        return "bg-blue-100 text-blue-800"
      case "Hosting":
        return "bg-purple-100 text-purple-800"
      case "Email":
        return "bg-yellow-100 text-yellow-800"
      case "Website":
        return "bg-indigo-100 text-indigo-800"
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
      setSelectedProducts(currentProducts.map((prod) => prod.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (id, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, id])
    } else {
      setSelectedProducts(selectedProducts.filter((prodId) => prodId !== id))
      setSelectAll(false)
    }
  }

  const viewProduct = (id) => {
    const product = products.find((prod) => prod.id === id)
    setSelectedProduct(product)
    setProductModalOpen(true)
  }

  const deleteProduct = (id) => {
    const product = products.find((prod) => prod.id === id)
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter((prod) => prod.id !== productToDelete.id))
      setDeleteModalOpen(false)
      setProductToDelete(null)
    }
  }

  const exportProducts = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Product Name,Type,Category,Unit Price,GST Rate,HSN/SAC Code,Status\n" +
      filteredProducts
        .map(
          (prod) =>
            `"${prod.productName}","${prod.productType}","${prod.category}","${formatCurrency(prod.unitPrice)}","${prod.gstRate}%","${prod.hsnSacCode}","${prod.activeStatus}"`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "products.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Form handling
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.productName.trim()) {
      errors.productName = "Product name is required"
    }
    if (!formData.productType) {
      errors.productType = "Product type is required"
    }
    if (!formData.category) {
      errors.category = "Category is required"
    }
    if (!formData.unitPrice || Number.parseFloat(formData.unitPrice) <= 0) {
      errors.unitPrice = "Unit price must be positive"
    }
    if (!formData.gstRate) {
      errors.gstRate = "GST rate is required"
    }
    if (!formData.hsnSacCode || formData.hsnSacCode.length < 6) {
      errors.hsnSacCode = "HSN/SAC code must be at least 6 digits"
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormErrors({})

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newProduct = {
        id: products.length + 1,
        ...formData,
        unitPrice: Number.parseFloat(formData.unitPrice),
      }

      setProducts([...products, newProduct])
      alert("Product saved successfully!")

      // Reset form
      setFormData({
        productName: "",
        productType: "",
        category: "",
        description: "",
        unitPrice: "",
        gstRate: "",
        hsnSacCode: "",
        activeStatus: "Active",
      })
      setShowAddForm(false)
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate stats
  const totalProducts = products.length
  const activeProducts = products.filter((prod) => prod.activeStatus === "Active").length
  const inactiveProducts = products.filter((prod) => prod.activeStatus === "Inactive").length
  const totalValue = products.reduce((sum, prod) => sum + prod.unitPrice, 0)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, categoryFilter])

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6 ml-4 mr-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
          {/* Total Products */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+2</span> this month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Active Products */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-gray-900">{activeProducts}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">Available for sale</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Inactive Products */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-3xl font-bold text-gray-900">{inactiveProducts}</p>
                <p className="text-sm text-red-600 mt-1">
                  <span className="font-medium">Not available</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Total Value */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
                <p className="text-sm text-blue-600 mt-1">
                  <span className="font-medium">Inventory worth</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
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
                  placeholder="Search products..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Domain">Domain</option>
                <option value="Hosting">Hosting</option>
                <option value="Email">Email</option>
                <option value="Website">Website</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={exportProducts}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Export
              </button>
              <button
                // onClick={() => setShowAddForm(true)}
                onClick={handleAddProduct}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="inline-block w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Products & Services</h3>
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
                    onClick={() => handleSort("productName")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    onClick={() => handleSort("category")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Category
                  </th>
                  <th
                    onClick={() => handleSort("unitPrice")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Unit Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GST Rate
                  </th>
                  <th
                    onClick={() => handleSort("activeStatus")}
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
                {currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                          <div className="text-sm text-gray-500">{product.hsnSacCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(product.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.gstRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.activeStatus)}`}
                      >
                        {product.activeStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewProduct(product.id)}
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
                          onClick={() => deleteProduct(product.id)}
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
                Showing <span>{startIndex + 1}</span> to <span>{Math.min(endIndex, filteredProducts.length)}</span> of{" "}
                <span>{filteredProducts.length}</span> entries
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

      {/* Add Product Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add New Product</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Package className="w-4 h-4 mr-2" />
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    placeholder="e.g., TickZap - 3 Year Panel"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.productName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.productName && <p className="mt-1 text-sm text-red-600">{formErrors.productName}</p>}
                </div>

                {/* Product Type */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 mr-2" />
                    Product Type *
                  </label>
                  <select
                    value={formData.productType}
                    onChange={(e) => handleInputChange("productType", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.productType ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select product type</option>
                    <option value="Product">Product</option>
                    <option value="Service">Service</option>
                  </select>
                  {formErrors.productType && <p className="mt-1 text-sm text-red-600">{formErrors.productType}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select category</option>
                    <option value="Domain">Domain</option>
                    <option value="Hosting">Hosting</option>
                    <option value="Email">Email</option>
                    <option value="Website">Website</option>
                  </select>
                  {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Optional description of the product"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                  />
                </div>

                {/* Unit Price */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Unit Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.unitPrice ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.unitPrice && <p className="mt-1 text-sm text-red-600">{formErrors.unitPrice}</p>}
                </div>

                {/* GST Rate */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Receipt className="w-4 h-4 mr-2" />
                    GST Rate (%) *
                  </label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) => handleInputChange("gstRate", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.gstRate ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select GST rate</option>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                  {formErrors.gstRate && <p className="mt-1 text-sm text-red-600">{formErrors.gstRate}</p>}
                </div>

                {/* HSN / SAC Code */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 mr-2" />
                    HSN / SAC Code *
                  </label>
                  <input
                    type="text"
                    value={formData.hsnSacCode}
                    onChange={(e) => handleInputChange("hsnSacCode", e.target.value)}
                    placeholder="6+ digit GST classification code"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.hsnSacCode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.hsnSacCode && <p className="mt-1 text-sm text-red-600">{formErrors.hsnSacCode}</p>}
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Power className="w-4 h-4 mr-2" />
                    Active Status *
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="activeStatus"
                        value="Active"
                        checked={formData.activeStatus === "Active"}
                        onChange={(e) => handleInputChange("activeStatus", e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="activeStatus"
                        value="Inactive"
                        checked={formData.activeStatus === "Inactive"}
                        onChange={(e) => handleInputChange("activeStatus", e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Inactive</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving Product...
                      </div>
                    ) : (
                      "Save Product"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {productModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
                <button onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product Name</label>
                      <p className="text-gray-900">{selectedProduct.productName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product Type</label>
                      <p className="text-gray-900">{selectedProduct.productType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedProduct.category)}`}
                      >
                        {selectedProduct.category}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">HSN/SAC Code</label>
                      <p className="text-gray-900">{selectedProduct.hsnSacCode}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Status</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Unit Price</label>
                      <p className="text-2xl font-bold text-indigo-600">{formatCurrency(selectedProduct.unitPrice)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">GST Rate</label>
                      <p className="text-gray-900">{selectedProduct.gstRate}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProduct.activeStatus)}`}
                      >
                        {selectedProduct.activeStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedProduct.description && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Description</h4>
                  <p className="text-gray-700">{selectedProduct.description}</p>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Edit Product
                </button>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete product{" "}
                <span className="font-semibold">{productToDelete.productName}</span>? This will permanently remove the
                product from the system.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
