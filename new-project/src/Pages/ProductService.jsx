
// import { useState, useEffect, useMemo } from "react"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { toast } from "react-hot-toast"
// import axios from "axios"
// import {
//   Search,
//   Package,
//   Tag,
//   FileText,
//   DollarSign,
//   Receipt,
//   Hash,
//   Power,
//   Plus,
//   Download,
//   Eye,
//   Edit,
//   Trash2,
//   X,
//   AlertTriangle,
//   CheckCircle,
//   Clock,
// } from "lucide-react"
// import { useNavigate } from "react-router-dom"

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: {
//     Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//     "Content-Type": "application/json",
//   },
// })

// export default function ProductService() {
//   const queryClient = useQueryClient()
//   const navigate = useNavigate()

//   const limit = 100
//   const {
//     data: productsResponse = { rows: [], total: 0, page: 1, pages: 1 },
//     isPending,
//     isError,
//     refetch,
//   } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const response = await api.get(`/products?limit=${limit}`)
//       if (response.data && response.data.rows) {
//         return response.data
//       }
//       return { rows: Array.isArray(response.data) ? response.data : [], total: 0, page: 1, pages: 1 }
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed to fetch products")
//     },
//   })

//   const products = productsResponse.rows || []

//   // Form state for adding new products
//   const [showAddForm, setShowAddForm] = useState(false)
//   const [formData, setFormData] = useState({
//     code: "",
//     name: "",
//     type: "",
//     category: "",
//     description: "",
//     unit_price: "",
//     gst_rate: "",
//     hsn_sac: "",
//     status: "active",
//   })
//   const [formErrors, setFormErrors] = useState({})
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Table state
//   const [currentPage, setCurrentPage] = useState(1)
//   const [entriesPerPage, setEntriesPerPage] = useState(10)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("")
//   const [categoryFilter, setCategoryFilter] = useState("")
//   const [sortColumn, setSortColumn] = useState("")
//   const [sortDirection, setSortDirection] = useState("asc")
//   const [selectedProducts, setSelectedProducts] = useState([])
//   const [selectAll, setSelectAll] = useState(false)

//   // Modal state
//   const [productModalOpen, setProductModalOpen] = useState(false)
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false)
//   const [editModalOpen, setEditModalOpen] = useState(false)
//   const [selectedProduct, setSelectedProduct] = useState(null)
//   const [productToDelete, setProductToDelete] = useState(null)
//   const [editFormData, setEditFormData] = useState({})

//   const createProductMutation = useMutation({
//     mutationFn: async (productData) => {
//       const response = await api.post("/products", productData)
//       return response.data
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(["products"])
//       toast.success(data?.message || "Product created successfully!")
//       setShowAddForm(false)
//       setFormData({
//         code: "",
//         name: "",
//         type: "",
//         category: "",
//         description: "",
//         unit_price: "",
//         gst_rate: "",
//         hsn_sac: "",
//         status: "active",
//       })
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed to create product")
//     },
//   })

//   const updateProductMutation = useMutation({
//     mutationFn: async (productData) => {
//       const response = await api.put(`/products/${productData.id}`, productData)
//       return response.data
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(["products"])
//       toast.success(data?.message || "Product updated successfully!")
//       setEditModalOpen(false)
//       setSelectedProduct(null)
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed to update product")
//     },
//   })

//   const deleteProductMutation = useMutation({
//     mutationFn: async (productId) => {
//       const response = await api.delete(`/products/${productId}`)
//       return response.data
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(["products"])
//       toast.success(data?.message || "Product deleted successfully!")
//       setDeleteModalOpen(false)
//       setProductToDelete(null)
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed to delete product")
//     },
//   })

//   const changeStatusMutation = useMutation({
//     mutationFn: async ({ productId, status }) => {
//       const response = await api.put(`/products/${productId}/status`, { status })
//       return response.data
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(["products"])
//       toast.success(data?.message || "Product status updated successfully!")
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed to update product status")
//     },
//   })

//   // Filter and sort products
//   const filteredProducts = useMemo(() => {
//     const productsArray = Array.isArray(products) ? products : []
//     const filtered = productsArray.filter((product) => {
//       const matchesSearch =
//         product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.code?.toLowerCase().includes(searchTerm.toLowerCase())

//       const matchesStatus = !statusFilter || product.status === statusFilter
//       const matchesCategory = !categoryFilter || product.category === categoryFilter

//       return matchesSearch && matchesStatus && matchesCategory
//     })

//     // Sort products
//     if (sortColumn) {
//       filtered.sort((a, b) => {
//         let aValue, bValue

//         switch (sortColumn) {
//           case "name":
//             aValue = a.name?.toLowerCase() || ""
//             bValue = b.name?.toLowerCase() || ""
//             break
//           case "category":
//             aValue = a.category?.toLowerCase() || ""
//             bValue = b.category?.toLowerCase() || ""
//             break
//           case "unit_price":
//             aValue = a.unit_price || 0
//             bValue = b.unit_price || 0
//             break
//           case "status":
//             aValue = a.status || ""
//             bValue = b.status || ""
//             break
//           case "code":
//             aValue = a.code?.toLowerCase() || ""
//             bValue = b.code?.toLowerCase() || ""
//             break
//           default:
//             return 0
//         }

//         if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
//         if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
//         return 0
//       })
//     }

//     return filtered
//   }, [products, searchTerm, statusFilter, categoryFilter, sortColumn, sortDirection])

//   // Pagination
//   const totalPages = Math.ceil(filteredProducts.length / entriesPerPage)
//   const startIndex = (currentPage - 1) * entriesPerPage
//   const endIndex = startIndex + entriesPerPage
//   const currentProducts = filteredProducts.slice(startIndex, endIndex)

//   // Helper functions
//   const formatCurrency = (amount) => {
//     return `₹${amount?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-800"
//       case "inactive":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const handleAddProduct = () => {
//     navigate("/sale/addproduct")
//   }

//   const getCategoryColor = (category) => {
//     switch (category) {
//       case "Domain":
//         return "bg-blue-100 text-blue-800"
//       case "Hosting":
//         return "bg-purple-100 text-purple-800"
//       case "Email":
//         return "bg-yellow-100 text-yellow-800"
//       case "Website":
//         return "bg-indigo-100 text-indigo-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const handleSort = (column) => {
//     if (sortColumn === column) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortColumn(column)
//       setSortDirection("asc")
//     }
//   }

//   const handleSelectAll = (checked) => {
//     setSelectAll(checked)
//     if (checked) {
//       setSelectedProducts(currentProducts.map((prod) => prod.id))
//     } else {
//       setSelectedProducts([])
//     }
//   }

//   const handleSelectProduct = (id, checked) => {
//     if (checked) {
//       setSelectedProducts([...selectedProducts, id])
//     } else {
//       setSelectedProducts(selectedProducts.filter((prodId) => prodId !== id))
//       setSelectAll(false)
//     }
//   }

//   const viewProduct = (id) => {
//     const product = products.find((prod) => prod.id === id)
//     setSelectedProduct(product)
//     setProductModalOpen(true)
//   }

//   const editProduct = (id) => {
//     const product = products.find((prod) => prod.id === id)
//     setSelectedProduct(product)
//     setEditFormData({
//       id: product.id,
//       code: product.code || "",
//       name: product.name || "",
//       type: product.type || "",
//       category: product.category || "",
//       description: product.description || "",
//       unit_price: product.unit_price || "",
//       gst_rate: product.gst_rate || "",
//       hsn_sac: product.hsn_sac || "",
//       status: product.status || "active",
//     })
//     setEditModalOpen(true)
//   }

//   const deleteProduct = (id) => {
//     const product = products.find((prod) => prod.id === id)
//     setProductToDelete(product)
//     setDeleteModalOpen(true)
//   }

//   const confirmDelete = () => {
//     if (productToDelete) {
//       deleteProductMutation.mutate(productToDelete.id)
//     }
//   }

//   const exportProducts = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       "ID,Code,Product Name,Type,Category,Unit Price,GST Rate,HSN/SAC Code,Status,Created At,Updated At\n" +
//       filteredProducts
//         .map(
//           (prod) =>
//             `"${prod.id}","${prod.code || ""}","${prod.name}","${prod.type}","${prod.category}","${formatCurrency(prod.unit_price)}","${prod.gst_rate}%","${prod.hsn_sac}","${prod.status}","${prod.created_at || ""}","${prod.updated_at || ""}"`,
//         )
//         .join("\n")

//     const encodedUri = encodeURI(csvContent)
//     const link = document.createElement("a")
//     link.setAttribute("href", encodedUri)
//     link.setAttribute("download", "products.csv")
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   // Form handling
//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))

//     // Clear error when user starts typing
//     if (formErrors[field]) {
//       setFormErrors((prev) => ({
//         ...prev,
//         [field]: undefined,
//       }))
//     }
//   }

//   const handleEditInputChange = (field, value) => {
//     setEditFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const validateForm = () => {
//     const errors = {}

//     if (!formData.name?.trim()) {
//       errors.name = "Product name is required"
//     }
//     if (!formData.type) {
//       errors.type = "Product type is required"
//     }
//     if (!formData.category) {
//       errors.category = "Category is required"
//     }
//     if (!formData.unit_price || Number.parseFloat(formData.unit_price) <= 0) {
//       errors.unit_price = "Unit price must be positive"
//     }
//     if (!formData.gst_rate) {
//       errors.gst_rate = "GST rate is required"
//     }
//     if (!formData.hsn_sac || formData.hsn_sac.length < 6) {
//       errors.hsn_sac = "HSN/SAC code must be at least 6 digits"
//     }

//     return errors
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setFormErrors({})

//     const errors = validateForm()
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors)
//       setIsSubmitting(false)
//       return
//     }

//     try {
//       const productData = {
//         ...formData,
//         unit_price: Number.parseFloat(formData.unit_price),
//         gst_rate: Number.parseFloat(formData.gst_rate),
//       }
//       createProductMutation.mutate(productData)
//     } catch (error) {
//       console.error("Error saving product:", error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleEditSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       const productData = {
//         ...editFormData,
//         unit_price: Number.parseFloat(editFormData.unit_price),
//         gst_rate: Number.parseFloat(editFormData.gst_rate),
//       }
//       updateProductMutation.mutate(productData)
//     } catch (error) {
//       console.error("Error updating product:", error)
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A"
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   // Calculate stats
//   const totalProducts = products.length
//   const activeProducts = products.filter((prod) => prod.status === "active").length
//   const inactiveProducts = products.filter((prod) => prod.status === "inactive").length
//   const totalValue = products.reduce((sum, prod) => sum + (prod.unit_price || 0), 0)

//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [searchTerm, statusFilter, categoryFilter])

//   if (isPending) {
//     return (
//       <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading products...</p>
//         </div>
//       </div>
//     )
//   }

//   if (isError) {
//     return (
//       <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <p className="text-gray-600 mb-4">Failed to load products</p>
//           <button
//             onClick={() => refetch()}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
//       {/* Main Content Area */}
//       <main className="p-6 ml-4 mr-4">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
//           {/* Total Products */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Products</p>
//                 <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
//                 <p className="text-sm text-green-600 mt-1">
//                   <span className="font-medium">Total: {productsResponse.total}</span>
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
//                 <Package className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Active Products */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Active</p>
//                 <p className="text-3xl font-bold text-gray-900">{activeProducts}</p>
//                 <p className="text-sm text-green-600 mt-1">
//                   <span className="font-medium">Available for sale</span>
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
//                 <CheckCircle className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Inactive Products */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Inactive</p>
//                 <p className="text-3xl font-bold text-gray-900">{inactiveProducts}</p>
//                 <p className="text-sm text-red-600 mt-1">
//                   <span className="font-medium">Not available</span>
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
//                 <Clock className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Total Value */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Value</p>
//                 <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
//                 <p className="text-sm text-blue-600 mt-1">
//                   <span className="font-medium">
//                     Page: {productsResponse.page}/{productsResponse.pages}
//                   </span>
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
//                 <DollarSign className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters and Actions */}
//         <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-3">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             {/* Search and Filters */}
//             <div className="flex flex-col sm:flex-row gap-4 flex-1">
//               {/* Search */}
//               <div className="relative flex-1 max-w-md">
//                 <input
//                   type="text"
//                   placeholder="Search products, code, category..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//                 <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//               </div>

//               {/* Status Filter */}
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>

//               {/* Category Filter */}
//               <select
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="">All Categories</option>
//                 <option value="Domain">Domain</option>
//                 <option value="Hosting">Hosting</option>
//                 <option value="Email">Email</option>
//                 <option value="Website">Website</option>
//               </select>
//             </div>

//             {/* Actions */}
//             <div className="flex gap-3">
//               <button
//                 onClick={exportProducts}
//                 className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
//               >
//                 <Download className="inline-block w-5 h-5 mr-2" />
//                 Export
//               </button>
//               <button
//                 onClick={handleAddProduct}
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
//               >
//                 <Plus className="inline-block w-5 h-5 mr-2" />
//                 Add Product
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Product Table */}
//         <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">All Products & Services</h3>
//               <div className="flex items-center space-x-2 text-sm text-gray-500">
//                 <span>Showing</span>
//                 <select
//                   value={entriesPerPage}
//                   onChange={(e) => setEntriesPerPage(Number.parseInt(e.target.value))}
//                   className="border border-gray-300 rounded px-2 py-1 text-sm"
//                 >
//                   <option value="10">10</option>
//                   <option value="25">25</option>
//                   <option value="50">50</option>
//                   <option value="100">100</option>
//                 </select>
//                 <span>entries</span>
//               </div>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={(e) => handleSelectAll(e.target.checked)}
//                       className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                     />
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                   <th
//                     onClick={() => handleSort("code")}
//                     className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Code
//                   </th>
//                   <th
//                     onClick={() => handleSort("name")}
//                     className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Product Name
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th
//                     onClick={() => handleSort("category")}
//                     className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Category
//                   </th>
//                   <th
//                     onClick={() => handleSort("unit_price")}
//                     className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Unit Price
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     GST Rate
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     HSN/SAC
//                   </th>
//                   <th
//                     onClick={() => handleSort("status")}
//                     className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Created
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentProducts.map((product) => (
//                   <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedProducts.includes(product.id)}
//                         onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
//                         className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{product.id}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
//                       {product.code || "N/A"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0">
//                           <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
//                             <Package className="w-5 h-5 text-white" />
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                           <div className="text-sm text-gray-500">{product.description || "No description"}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.type}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}
//                       >
//                         {product.category}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {formatCurrency(product.unit_price)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.gst_rate}%</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{product.hsn_sac}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
//                       >
//                         {product.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(product.created_at)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => viewProduct(product.id)}
//                           className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => editProduct(product.id)}
//                           className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                           title="Edit"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => deleteProduct(product.id)}
//                           className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="bg-white px-6 py-4 border-t border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Showing <span>{startIndex + 1}</span> to <span>{Math.min(endIndex, filteredProducts.length)}</span> of{" "}
//                 <span>{filteredProducts.length}</span> entries
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 <div className="flex space-x-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     const page = i + 1
//                     return (
//                       <button
//                         key={page}
//                         onClick={() => setCurrentPage(page)}
//                         className={`px-3 py-2 border rounded-lg ${
//                           page === currentPage
//                             ? "bg-indigo-600 text-white border-indigo-600"
//                             : "border-gray-300 text-gray-500 hover:bg-gray-50"
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     )
//                   })}
//                 </div>
//                 <button
//                   onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Add Product Form Modal */}
//       {showAddForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-semibold text-gray-900">Add New Product</h3>
//                 <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Product Code */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Hash className="w-4 h-4 mr-2" />
//                     Product Code
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.code}
//                     onChange={(e) => handleInputChange("code", e.target.value)}
//                     placeholder="e.g., P00001"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                   />
//                 </div>

//                 {/* Product Name */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Package className="w-4 h-4 mr-2" />
//                     Product Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     placeholder="e.g., Domain Registration"
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                       formErrors.name ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
//                 </div>

//                 {/* Product Type */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Tag className="w-4 h-4 mr-2" />
//                     Product Type *
//                   </label>
//                   <select
//                     value={formData.type}
//                     onChange={(e) => handleInputChange("type", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                       formErrors.type ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select product type</option>
//                     <option value="product">Product</option>
//                     <option value="service">Service</option>
//                   </select>
//                   {formErrors.type && <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>}
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <FileText className="w-4 h-4 mr-2" />
//                     Category *
//                   </label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => handleInputChange("category", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                       formErrors.category ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select category</option>
//                     <option value="Domain">Domain</option>
//                     <option value="Hosting">Hosting</option>
//                     <option value="Email">Email</option>
//                     <option value="Website">Website</option>
//                   </select>
//                   {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <FileText className="w-4 h-4 mr-2" />
//                     Description
//                   </label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => handleInputChange("description", e.target.value)}
//                     placeholder="Optional description of the product"
//                     rows={4}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
//                   />
//                 </div>

//                 {/* Unit Price */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <DollarSign className="w-4 h-4 mr-2" />
//                     Unit Price (₹) *
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.unit_price}
//                     onChange={(e) => handleInputChange("unit_price", e.target.value)}
//                     placeholder="0.00"
//                     min="0"
//                     step="0.01"
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                       formErrors.unit_price ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {formErrors.unit_price && <p className="mt-1 text-sm text-red-600">{formErrors.unit_price}</p>}
//                 </div>

//                 {/* GST Rate */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Receipt className="w-4 h-4 mr-2" />
//                     GST Rate (%) *
//                   </label>
//                   <select
//                     value={formData.gst_rate}
//                     onChange={(e) => handleInputChange("gst_rate", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                       formErrors.gst_rate ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select GST rate</option>
//                     <option value="0">0%</option>
//                     <option value="5">5%</option>
//                     <option value="12">12%</option>
//                     <option value="18">18%</option>
//                     <option value="28">28%</option>
//                   </select>
//                   {formErrors.gst_rate && <p className="mt-1 text-sm text-red-600">{formErrors.gst_rate}</p>}
//                 </div>

//                 {/* HSN / SAC Code */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Hash className="w-4 h-4 mr-2" />
//                     HSN / SAC Code *
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.hsn_sac}
//                     onChange={(e) => handleInputChange("hsn_sac", e.target.value)}
//                     placeholder="6+ digit GST classification code"
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                       formErrors.hsn_sac ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {formErrors.hsn_sac && <p className="mt-1 text-sm text-red-600">{formErrors.hsn_sac}</p>}
//                 </div>

//                 {/* Active Status */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Power className="w-4 h-4 mr-2" />
//                     Active Status *
//                   </label>
//                   <div className="flex items-center space-x-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="activeStatus"
//                         value="active"
//                         checked={formData.status === "active"}
//                         onChange={(e) => handleInputChange("status", e.target.value)}
//                         className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Active</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="activeStatus"
//                         value="inactive"
//                         checked={formData.status === "inactive"}
//                         onChange={(e) => handleInputChange("status", e.target.value)}
//                         className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Inactive</span>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="pt-6 flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddForm(false)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting || createProductMutation.isPending}
//                     className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     {isSubmitting || createProductMutation.isPending ? (
//                       <div className="flex items-center justify-center">
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                         Saving Product...
//                       </div>
//                     ) : (
//                       "Save Product"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Product Details Modal */}
//       {productModalOpen && selectedProduct && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
//                 <button onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-gray-600">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="space-y-4">
//                   <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">ID</label>
//                       <p className="text-gray-900">#{selectedProduct.id}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Product Code</label>
//                       <p className="text-gray-900 font-mono">{selectedProduct.code || "N/A"}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Product Name</label>
//                       <p className="text-gray-900">{selectedProduct.name}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Product Type</label>
//                       <p className="text-gray-900">{selectedProduct.type}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Category</label>
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedProduct.category)}`}
//                       >
//                         {selectedProduct.category}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Tax</h4>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Unit Price</label>
//                       <p className="text-2xl font-bold text-indigo-600">{formatCurrency(selectedProduct.unit_price)}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">GST Rate</label>
//                       <p className="text-gray-900">{selectedProduct.gst_rate}%</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">HSN/SAC Code</label>
//                       <p className="text-gray-900 font-mono">{selectedProduct.hsn_sac}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Status</label>
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProduct.status)}`}
//                       >
//                         {selectedProduct.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Timestamps</h4>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Created By</label>
//                       <p className="text-gray-900">User #{selectedProduct.created_by || "N/A"}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Created At</label>
//                       <p className="text-gray-900">{formatDate(selectedProduct.created_at)}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Updated At</label>
//                       <p className="text-gray-900">{formatDate(selectedProduct.updated_at)}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Deleted At</label>
//                       <p className="text-gray-900">
//                         {selectedProduct.deleted_at ? formatDate(selectedProduct.deleted_at) : "Not deleted"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {selectedProduct.description && (
//                 <div className="mt-6 space-y-4">
//                   <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Description</h4>
//                   <p className="text-gray-700">{selectedProduct.description}</p>
//                 </div>
//               )}

//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   onClick={() => {
//                     setProductModalOpen(false)
//                     editProduct(selectedProduct.id)
//                   }}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                 >
//                   Edit Product
//                 </button>
//                 <button
//                   onClick={() => setProductModalOpen(false)}
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Product Modal */}
//       {editModalOpen && selectedProduct && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-semibold text-gray-900">Edit Product</h3>
//                 <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <form onSubmit={handleEditSubmit} className="space-y-6">
//                 {/* Product Code */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Hash className="w-4 h-4 mr-2" />
//                     Product Code
//                   </label>
//                   <input
//                     type="text"
//                     value={editFormData.code || ""}
//                     onChange={(e) => handleEditInputChange("code", e.target.value)}
//                     placeholder="e.g., P00001"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                   />
//                 </div>

//                 {/* Product Name */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Package className="w-4 h-4 mr-2" />
//                     Product Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={editFormData.name || ""}
//                     onChange={(e) => handleEditInputChange("name", e.target.value)}
//                     placeholder="e.g., Domain Registration"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                   />
//                 </div>

//                 {/* Product Type */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Tag className="w-4 h-4 mr-2" />
//                     Product Type *
//                   </label>
//                   <select
//                     value={editFormData.type || ""}
//                     onChange={(e) => handleEditInputChange("type", e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                   >
//                     <option value="">Select product type</option>
//                     <option value="product">Product</option>
//                     <option value="service">Service</option>
//                   </select>
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <FileText className="w-4 h-4 mr-2" />
//                     Category *
//                   </label>
//                   <select
//                     value={editFormData.category || ""}
//                     onChange={(e) => handleEditInputChange("category", e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                   >
//                     <option value="">Select category</option>
//                     <option value="Domain">Domain</option>
//                     <option value="Hosting">Hosting</option>
//                     <option value="Email">Email</option>
//                     <option value="Website">Website</option>
//                   </select>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <FileText className="w-4 h-4 mr-2" />
//                     Description
//                   </label>
//                   <textarea
//                     value={editFormData.description || ""}
//                     onChange={(e) => handleEditInputChange("description", e.target.value)}
//                     placeholder="Optional description of the product"
//                     rows={4}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
//                   />
//                 </div>

//                 {/* Unit Price */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <DollarSign className="w-4 h-4 mr-2" />
//                     Unit Price (₹) *
//                   </label>
//                   <input
//                     type="number"
//                     value={editFormData.unit_price || ""}
//                     onChange={(e) => handleEditInputChange("unit_price", e.target.value)}
//                     placeholder="0.00"
//                     min="0"
//                     step="0.01"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                   />
//                 </div>

//                 {/* GST Rate */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Receipt className="w-4 h-4 mr-2" />
//                     GST Rate (%) *
//                   </label>
//                   <select
//                     value={editFormData.gst_rate || ""}
//                     onChange={(e) => handleEditInputChange("gst_rate", e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                   >
//                     <option value="">Select GST rate</option>
//                     <option value="0">0%</option>
//                     <option value="5">5%</option>
//                     <option value="12">12%</option>
//                     <option value="18">18%</option>
//                     <option value="28">28%</option>
//                   </select>
//                 </div>

//                 {/* HSN / SAC Code */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Hash className="w-4 h-4 mr-2" />
//                     HSN / SAC Code *
//                   </label>
//                   <input
//                     type="text"
//                     value={editFormData.hsn_sac || ""}
//                     onChange={(e) => handleEditInputChange("hsn_sac", e.target.value)}
//                     placeholder="6+ digit GST classification code"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                   />
//                 </div>

//                 {/* Active Status */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Power className="w-4 h-4 mr-2" />
//                     Status *
//                   </label>
//                   <div className="flex items-center space-x-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="editStatus"
//                         value="active"
//                         checked={editFormData.status === "active"}
//                         onChange={(e) => handleEditInputChange("status", e.target.value)}
//                         className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Active</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="editStatus"
//                         value="inactive"
//                         checked={editFormData.status === "inactive"}
//                         onChange={(e) => handleEditInputChange("status", e.target.value)}
//                         className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Inactive</span>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="pt-6 flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => setEditModalOpen(false)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={updateProductMutation.isPending}
//                     className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     {updateProductMutation.isPending ? (
//                       <div className="flex items-center justify-center">
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                         Updating Product...
//                       </div>
//                     ) : (
//                       "Update Product"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModalOpen && productToDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
//             <div className="p-6">
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
//                   <AlertTriangle className="w-6 h-6 text-red-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
//                   <p className="text-sm text-gray-500">This action cannot be undone.</p>
//                 </div>
//               </div>
//               <p className="text-gray-700 mb-6">
//                 Are you sure you want to delete product <span className="font-semibold">{productToDelete.name}</span>?
//                 This will permanently remove the product from the system.
//               </p>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setDeleteModalOpen(false)}
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDelete}
//                   disabled={deleteProductMutation.isPending}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400"
//                 >
//                   {deleteProductMutation.isPending ? (
//                     <div className="flex items-center justify-center">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Deleting...
//                     </div>
//                   ) : (
//                     "Delete"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }






import { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import axios from "axios"
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

const api = axios.create({
  baseURL: "https://crmapi.technfest.com",
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
})

export default function ProductService() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const limit = 100
  const {
    data: productsResponse = { rows: [], total: 0, page: 1, pages: 1 },
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get(`/products?page=1&limit=${limit}`)
      if (response.data && response.data.rows) {
        return response.data
      }
      return { rows: Array.isArray(response.data) ? response.data : [], total: 0, page: 1, pages: 1 }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to fetch products")
    },
  })

  const products = productsResponse.rows || []

  // Form state for adding new products
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "",
    category: "",
    description: "",
    unit_price: "",
    gst_rate: "",
    hsn_sac: "",
    status: "active",
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
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  const createProductMutation = useMutation({
    mutationFn: async (productData) => {
      const response = await api.post("/products", productData)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["products"])
      toast.success(data?.message || "Product created successfully!")
      setShowAddForm(false)
      setFormData({
        code: "",
        name: "",
        type: "",
        category: "",
        description: "",
        unit_price: "",
        gst_rate: "",
        hsn_sac: "",
        status: "active",
      })
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create product")
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: async (productData) => {
      const response = await api.put(`/products/${productData.id}`, productData)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["products"])
      toast.success(data?.message || "Product updated successfully!")
      setEditModalOpen(false)
      setSelectedProduct(null)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update product")
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: async (productId) => {
      const response = await api.delete(`/products/${productId}`)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["products"])
      toast.success(data?.message || "Product deleted successfully!")
      setDeleteModalOpen(false)
      setProductToDelete(null)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete product")
    },
  })

  const changeStatusMutation = useMutation({
    mutationFn: async ({ productId, status }) => {
      const response = await api.put(`/products/${productId}/status`, { status })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["products"])
      toast.success(data?.message || "Product status updated successfully!")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update product status")
    },
  })

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const productsArray = Array.isArray(products) ? products : []
    const filtered = productsArray.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !statusFilter || product.status === statusFilter
      const matchesCategory = !categoryFilter || product.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })

    // Sort products
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue, bValue

        switch (sortColumn) {
          case "name":
            aValue = a.name?.toLowerCase() || ""
            bValue = b.name?.toLowerCase() || ""
            break
          case "category":
            aValue = a.category?.toLowerCase() || ""
            bValue = b.category?.toLowerCase() || ""
            break
          case "unit_price":
            aValue = a.unit_price || 0
            bValue = b.unit_price || 0
            break
          case "status":
            aValue = a.status || ""
            bValue = b.status || ""
            break
          case "code":
            aValue = a.code?.toLowerCase() || ""
            bValue = b.code?.toLowerCase() || ""
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
    return `₹${amount?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  const editProduct = (id) => {
    const product = products.find((prod) => prod.id === id)
    setSelectedProduct(product)
    setEditFormData({
      id: product.id,
      code: product.code || "",
      name: product.name || "",
      type: product.type || "",
      category: product.category || "",
      description: product.description || "",
      unit_price: product.unit_price || "",
      gst_rate: product.gst_rate || "",
      hsn_sac: product.hsn_sac || "",
      status: product.status || "active",
    })
    setEditModalOpen(true)
  }

  const deleteProduct = (id) => {
    const product = products.find((prod) => prod.id === id)
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id)
    }
  }

  const exportProducts = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Code,Product Name,Type,Category,Unit Price,GST Rate,HSN/SAC Code,Status,Created At,Updated At\n" +
      filteredProducts
        .map(
          (prod) =>
            `"${prod.id}","${prod.code || ""}","${prod.name}","${prod.type}","${prod.category}","${formatCurrency(prod.unit_price)}","${prod.gst_rate}%","${prod.hsn_sac}","${prod.status}","${prod.created_at || ""}","${prod.updated_at || ""}"`,
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

  const handleEditInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name?.trim()) {
      errors.name = "Product name is required"
    }
    if (!formData.type) {
      errors.type = "Product type is required"
    }
    if (!formData.category) {
      errors.category = "Category is required"
    }
    if (!formData.unit_price || Number.parseFloat(formData.unit_price) <= 0) {
      errors.unit_price = "Unit price must be positive"
    }
    if (!formData.gst_rate) {
      errors.gst_rate = "GST rate is required"
    }
    if (!formData.hsn_sac || formData.hsn_sac.length < 6) {
      errors.hsn_sac = "HSN/SAC code must be at least 6 digits"
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
      const productData = {
        ...formData,
        unit_price: Number.parseFloat(formData.unit_price),
        gst_rate: Number.parseFloat(formData.gst_rate),
      }
      createProductMutation.mutate(productData)
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const productData = {
        ...editFormData,
        unit_price: Number.parseFloat(editFormData.unit_price),
        gst_rate: Number.parseFloat(editFormData.gst_rate),
      }
      updateProductMutation.mutate(productData)
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate stats
  const totalProducts = products.length
  const activeProducts = products.filter((prod) => prod.status === "active").length
  const inactiveProducts = products.filter((prod) => prod.status === "inactive").length
  const totalValue = products.reduce((sum, prod) => sum + (prod.unit_price || 0), 0)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, categoryFilter])

  if (isPending) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load products</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
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
          {/* Total Products */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">Total: {productsResponse.total}</span>
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
                  <span className="font-medium">
                    Page: {productsResponse.page}/{productsResponse.pages}
                  </span>
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
                  placeholder="Search products, code, category..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th
                    onClick={() => handleSort("code")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Code
                  </th>
                  <th
                    onClick={() => handleSort("name")}
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
                    onClick={() => handleSort("unit_price")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Unit Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GST Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HSN/SAC
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{product.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {product.code || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description || "No description"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(product.unit_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.gst_rate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{product.hsn_sac}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.created_at)}
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
                          onClick={() => editProduct(product.id)}
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
                {/* Product Code */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 mr-2" />
                    Product Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    placeholder="e.g., P00001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Package className="w-4 h-4 mr-2" />
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Domain Registration"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>

                {/* Product Type */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 mr-2" />
                    Product Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.type ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select product type</option>
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                  </select>
                  {formErrors.type && <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>}
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
                    value={formData.unit_price}
                    onChange={(e) => handleInputChange("unit_price", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.unit_price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.unit_price && <p className="mt-1 text-sm text-red-600">{formErrors.unit_price}</p>}
                </div>

                {/* GST Rate */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Receipt className="w-4 h-4 mr-2" />
                    GST Rate (%) *
                  </label>
                  <select
                    value={formData.gst_rate}
                    onChange={(e) => handleInputChange("gst_rate", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.gst_rate ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select GST rate</option>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                  {formErrors.gst_rate && <p className="mt-1 text-sm text-red-600">{formErrors.gst_rate}</p>}
                </div>

                {/* HSN / SAC Code */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 mr-2" />
                    HSN / SAC Code *
                  </label>
                  <input
                    type="text"
                    value={formData.hsn_sac}
                    onChange={(e) => handleInputChange("hsn_sac", e.target.value)}
                    placeholder="6+ digit GST classification code"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.hsn_sac ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.hsn_sac && <p className="mt-1 text-sm text-red-600">{formErrors.hsn_sac}</p>}
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
                        value="active"
                        checked={formData.status === "active"}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="activeStatus"
                        value="inactive"
                        checked={formData.status === "inactive"}
                        onChange={(e) => handleInputChange("status", e.target.value)}
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
                    disabled={isSubmitting || createProductMutation.isPending}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {isSubmitting || createProductMutation.isPending ? (
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
                <button onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">ID</label>
                      <p className="text-gray-900">#{selectedProduct.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product Code</label>
                      <p className="text-gray-900 font-mono">{selectedProduct.code || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product Name</label>
                      <p className="text-gray-900">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Product Type</label>
                      <p className="text-gray-900">{selectedProduct.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedProduct.category)}`}
                      >
                        {selectedProduct.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Tax</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Unit Price</label>
                      <p className="text-2xl font-bold text-indigo-600">{formatCurrency(selectedProduct.unit_price)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">GST Rate</label>
                      <p className="text-gray-900">{selectedProduct.gst_rate}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">HSN/SAC Code</label>
                      <p className="text-gray-900 font-mono">{selectedProduct.hsn_sac}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProduct.status)}`}
                      >
                        {selectedProduct.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Timestamps</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created By</label>
                      <p className="text-gray-900">User #{selectedProduct.created_by || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created At</label>
                      <p className="text-gray-900">{formatDate(selectedProduct.created_at)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Updated At</label>
                      <p className="text-gray-900">{formatDate(selectedProduct.updated_at)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Deleted At</label>
                      <p className="text-gray-900">
                        {selectedProduct.deleted_at ? formatDate(selectedProduct.deleted_at) : "Not deleted"}
                      </p>
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
                <button
                  onClick={() => {
                    setProductModalOpen(false)
                    editProduct(selectedProduct.id)
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
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

      {/* Edit Product Modal */}
      {editModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Edit Product</h3>
                <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditSubmit} className="space-y-6">
                {/* Product Code */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 mr-2" />
                    Product Code
                  </label>
                  <input
                    type="text"
                    value={editFormData.code || ""}
                    onChange={(e) => handleEditInputChange("code", e.target.value)}
                    placeholder="e.g., P00001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Package className="w-4 h-4 mr-2" />
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={editFormData.name || ""}
                    onChange={(e) => handleEditInputChange("name", e.target.value)}
                    placeholder="e.g., Domain Registration"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Product Type */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 mr-2" />
                    Product Type *
                  </label>
                  <select
                    value={editFormData.type || ""}
                    onChange={(e) => handleEditInputChange("type", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select product type</option>
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Category *
                  </label>
                  <select
                    value={editFormData.category || ""}
                    onChange={(e) => handleEditInputChange("category", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select category</option>
                    <option value="Domain">Domain</option>
                    <option value="Hosting">Hosting</option>
                    <option value="Email">Email</option>
                    <option value="Website">Website</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Description
                  </label>
                  <textarea
                    value={editFormData.description || ""}
                    onChange={(e) => handleEditInputChange("description", e.target.value)}
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
                    value={editFormData.unit_price || ""}
                    onChange={(e) => handleEditInputChange("unit_price", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* GST Rate */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Receipt className="w-4 h-4 mr-2" />
                    GST Rate (%) *
                  </label>
                  <select
                    value={editFormData.gst_rate || ""}
                    onChange={(e) => handleEditInputChange("gst_rate", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select GST rate</option>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>

                {/* HSN / SAC Code */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 mr-2" />
                    HSN / SAC Code *
                  </label>
                  <input
                    type="text"
                    value={editFormData.hsn_sac || ""}
                    onChange={(e) => handleEditInputChange("hsn_sac", e.target.value)}
                    placeholder="6+ digit GST classification code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Power className="w-4 h-4 mr-2" />
                    Status *
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editStatus"
                        value="active"
                        checked={editFormData.status === "active"}
                        onChange={(e) => handleEditInputChange("status", e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editStatus"
                        value="inactive"
                        checked={editFormData.status === "inactive"}
                        onChange={(e) => handleEditInputChange("status", e.target.value)}
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
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateProductMutation.isPending}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {updateProductMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating Product...
                      </div>
                    ) : (
                      "Update Product"
                    )}
                  </button>
                </div>
              </form>
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
                Are you sure you want to delete product <span className="font-semibold">{productToDelete.name}</span>?
                This will permanently remove the product from the system.
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
                  disabled={deleteProductMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400"
                >
                  {deleteProductMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
