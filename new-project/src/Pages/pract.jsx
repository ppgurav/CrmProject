

// import React from "react"

// import { useState, useEffect, useMemo } from "react"
// import { z } from "zod"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { Search, Users, CheckCircle, Building, Plus, Download, Eye, Edit, Trash2, X, AlertTriangle } from "lucide-react"
// // import { useNavigate } from "react-router-dom"

// // const API_BASE_URL =
// //   (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_API_BASE_URL) ||
// //   (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
// //   ""
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// const getAuthHeaders = () => {
//   const token = sessionStorage.getItem("token")
//   const departmentId = sessionStorage.getItem("departmentId") || "1"
//   return {
//     Authorization: `Bearer ${token}`,
//     "X-Department-Id": departmentId,
//     "Content-Type": "application/json",
//   }
// }

// const fetchEmployees = async (page = 1, limit = 10, q = "") => {
//   const token = sessionStorage.getItem("token")
//   console.log("Token:", token)

//   const response = await fetch(`${API_BASE_URL}employees?limit=${limit}&page=${page}&q=${q}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "X-Department-Id": sessionStorage.getItem("departmentId") || "1",
//     },
//   })

//   console.log(`${API_BASE_URL}employees?limit=${limit}&page=${page}&q=${q}`)

//   if (!response.ok) {
//     throw new Error("Failed to fetch employees")
//   }

//   return response.json()
// }

// const fetchEmployeeById = async (id) => {
//   const response = await fetch(`${API_BASE_URL}employees/${id}`, {
//     method: "GET",
//     headers: getAuthHeaders(),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to fetch employee")
//   }

//   return response.json()
// }

// const createEmployee = async (employeeData) => {
//   const response = await fetch(`${API_BASE_URL}employees`, {
//     method: "POST",
//     headers: getAuthHeaders(),
//     body: JSON.stringify(employeeData),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to create employee")
//   }

//   return response.json()
// }

// const updateEmployee = async ({ id, data }) => {
//   const response = await fetch(`${API_BASE_URL}employees/${id}`, {
//     method: "PUT",
//     headers: getAuthHeaders(),
//     body: JSON.stringify(data),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to update employee")
//   }

//   return response.json()
// }

// const updateEmployeeBank = async ({ id, data }) => {
//   const response = await fetch(`${API_BASE_URL}employees/${id}/bank`, {
//     method: "PUT",
//     headers: getAuthHeaders(),
//     body: JSON.stringify(data),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to update employee bank details")
//   }

//   return response.json()
// }

// const updateEmployeeStatus = async ({ id, data }) => {
//   const response = await fetch(`${API_BASE_URL}employees/${id}/status`, {
//     method: "PUT",
//     headers: getAuthHeaders(),
//     body: JSON.stringify(data),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to update employee status")
//   }

//   return response.json()
// }

// const linkUserToEmployee = async ({ id, userId }) => {
//   const response = await fetch(`${API_BASE_URL}employees/${id}/link-user`, {
//     method: "PATCH",
//     headers: getAuthHeaders(),
//     body: JSON.stringify({ user_id: userId }),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to link user to employee")
//   }

//   return response.json()
// }

// const provisionLogin = async ({ id, role }) => {
//   const response = await fetch(`${API_BASE_URL}employees/${id}/provision-login`, {
//     method: "POST",
//     headers: getAuthHeaders(),
//     body: JSON.stringify({ role }),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to provision login")
//   }

//   return response.json()
// }

// const deleteEmployee = async (id) => {
//   const response = await fetch(`${API_BASE_URL}employees/${id}`, {
//     method: "DELETE",
//     headers: getAuthHeaders(),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to delete employee")
//   }

//   return response.json()
// }


// const employeeSchema = z.object({
//   id: z.number(),
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email format"),
//   phone: z.string().min(10, "Phone number must be at least 10 digits"),
//   department: z.string().min(1, "Department is required"),
//   designation: z.string().min(1, "Designation is required"),
//   joinDate: z.string(),
//   salary: z.number().positive("Salary must be positive"),
//   salaryType: z.enum(["fixed", "hourly", "commission"]),
//   status: z.enum(["active", "inactive"]),
//   address: z.string().min(1, "Address is required"),
//   panNumber: z.string().min(10, "PAN number is required"),
//   aadhaarNumber: z.string().min(12, "Aadhaar number must be 12 digits"),
//   bankName: z.string().min(1, "Bank name is required"),
//   ifscCode: z.string().min(11, "IFSC code is required"),
//   accountNumber: z.string().min(1, "Account number is required"),
// })

// export default function Pract() {
//   const queryClient = useQueryClient()

//   const handleAddEmployee = () => {
//     if (typeof window !== "undefined") {
//       window.location.href = "/employee/addemployee"
//     }
//   }

//   // Table state
//   const [currentPage, setCurrentPage] = useState(1)
//   const [entriesPerPage, setEntriesPerPage] = useState(10)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [departmentFilter, setDepartmentFilter] = useState("")
//   const [statusFilter, setStatusFilter] = useState("")
//   const [sortColumn, setSortColumn] = useState("")
//   const [sortDirection, setSortDirection] = useState("asc")
//   const [selectedEmployees, setSelectedEmployees] = useState([])
//   const [selectAll, setSelectAll] = useState(false)

//   // Modal state
//   const [employeeModalOpen, setEmployeeModalOpen] = useState(false)
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false)
//   const [selectedEmployee, setSelectedEmployee] = useState(null)
//   const [employeeToDelete, setEmployeeToDelete] = useState(null)

//   const [editModalOpen, setEditModalOpen] = useState(false)
//   const [editFormData, setEditFormData] = useState(null)
//   const [editSubmitting, setEditSubmitting] = useState(false)
//   const [editError, setEditError] = useState(null)

//   const [bankFormData, setBankFormData] = React.useState({
//     pan: "",
//     aadhaar: "",
//     bank_name: "",
//     ifsc: "",
//     account_number: "",
//     account_holder_name: "",
//   })
//   const [bankSubmitting, setBankSubmitting] = React.useState(false)
//   const [bankError, setBankError] = React.useState(null)

//   const {
//     data: employeesData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["employees", currentPage, entriesPerPage, searchTerm],
//     queryFn: () => fetchEmployees(currentPage, entriesPerPage, searchTerm),
//     keepPreviousData: true,
//   })

//   console.log("[v0] employeesData:", employeesData)

//   const employees = useMemo(() => {
//     if (!employeesData) return []
//     if (Array.isArray(employeesData.rows)) return employeesData.rows
//     if (Array.isArray(employeesData.data)) return employeesData.data
//     if (Array.isArray(employeesData)) return employeesData
//     return []
//   }, [employeesData])

//   const totalEmployees =
//     (employeesData && (employeesData.total ?? employeesData.count ?? employeesData?.pagination?.total)) ??
//     employees.length

//   const deleteEmployeeMutation = useMutation({
//     mutationFn: deleteEmployee,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["employees"])
//       setDeleteModalOpen(false)
//       setEmployeeToDelete(null)
//     },
//     onError: (error) => {
//       console.error("Delete failed:", error)
//     },
//   })

//   const updateEmployeeMutation = useMutation({
//     mutationFn: updateEmployee,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["employees"])
//     },
//     onError: (error) => {
//       console.error("Update failed:", error)
//     },
//   })

//   // Filter and sort employees
//   const filteredEmployees = useMemo(() => {
//     const filtered = employees.filter((employee) => {
//       const matchesSearch =
//         employee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         employee.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         employee.designation?.toLowerCase().includes(searchTerm.toLowerCase())
//       const matchesDepartment = !departmentFilter || employee.department?.toLowerCase() === departmentFilter
//       const matchesStatus = !statusFilter || employee.status === statusFilter
//       return matchesSearch && matchesDepartment && matchesStatus
//     })

//     // Sort employees
//     if (sortColumn) {
//       filtered.sort((a, b) => {
//         let aValue, bValue
//         switch (sortColumn) {
//           case "name":
//             aValue = `${a.first_name} ${a.last_name}`.toLowerCase()
//             bValue = `${b.first_name} ${b.last_name}`.toLowerCase()
//             break
//           case "department":
//             aValue = a.department?.toLowerCase() || ""
//             bValue = b.department?.toLowerCase() || ""
//             break
//           case "designation":
//             aValue = a.designation?.toLowerCase() || ""
//             bValue = b.designation?.toLowerCase() || ""
//             break
//           case "joinDate":
//             aValue = new Date(a.join_date)
//             bValue = new Date(b.join_date)
//             break
//           case "salary":
//             aValue = a.monthly_salary || 0
//             bValue = b.monthly_salary || 0
//             break
//           case "status":
//             aValue = a.status
//             bValue = b.status
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
//   }, [employees, searchTerm, departmentFilter, statusFilter, sortColumn, sortDirection])

//   // Pagination
//   // If the API provides a total/count, treat it as server-side pagination and don't slice again.
//   const hasServerTotal =
//     employeesData &&
//     (typeof employeesData.total === "number" ||
//       typeof employeesData.count === "number" ||
//       (employeesData.pagination && typeof employeesData.pagination.total === "number"))

//   const isServerPaginated = !!hasServerTotal

//   const totalPages = Math.ceil(totalEmployees / entriesPerPage)
//   const startIndex = (currentPage - 1) * entriesPerPage
//   const endIndex = startIndex + entriesPerPage

//   const currentEmployees = isServerPaginated ? filteredEmployees : filteredEmployees.slice(startIndex, endIndex)

//   // Helper functions
//   const formatSalary = (amount, type) => {
//     if (type === "fixed") {
//       return `₹${amount?.toLocaleString()}/month`
//     } else if (type === "hourly") {
//       return `₹${amount}/hour`
//     } else if (type === "commission") {
//       return `${amount}% commission`
//     }
//     return `₹${amount || 0}`
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
//       setSelectedEmployees(currentEmployees.map((emp) => emp.id))
//     } else {
//       setSelectedEmployees([])
//     }
//   }

//   const handleSelectEmployee = (id, checked) => {
//     if (checked) {
//       setSelectedEmployees([...selectedEmployees, id])
//     } else {
//       setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id))
//       setSelectAll(false)
//     }
//   }

//   const viewEmployee = (id) => {
//     const employee = employees.find((emp) => emp.id === id)
//     setSelectedEmployee(employee)
//     setEmployeeModalOpen(true)
//   }

//   const handleDeleteEmployee = (id) => {
//     const employee = employees.find((emp) => emp.id === id)
//     setEmployeeToDelete(employee)
//     setDeleteModalOpen(true)
//   }

//   const confirmDelete = () => {
//     if (employeeToDelete) {
//       deleteEmployeeMutation.mutate(employeeToDelete.id)
//     }
//   }

//   const exportEmployees = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       "Name,Email,Phone,Department,Designation,Join Date,Salary,Status\n" +
//       filteredEmployees
//         .map(
//           (emp) =>
//             `"${emp.first_name} ${emp.last_name}","${emp.email}","${emp.phone}","${emp.department}","${emp.designation}","${emp.join_date}","${formatSalary(emp.monthly_salary, emp.salary_type)}","${emp.status}"`,
//         )
//         .join("\n")
//     const encodedUri = encodeURI(csvContent)
//     const link = document.createElement("a")
//     link.setAttribute("href", encodedUri)
//     link.setAttribute("download", "employees.csv")
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   const toInputDate = (d) => {
//     if (!d) return ""
//     try {
//       const dt = new Date(d)
//       const tz = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
//       return tz.toISOString().slice(0, 10)
//     } catch {
//       return String(d).slice(0, 10) || ""
//     }
//   }

//   const openEdit = (employee) => {
//     if (!employee) return
//     setEditError(null)
//     setEditFormData({
//       id: employee.id,
//       first_name: employee.first_name || "",
//       last_name: employee.last_name || "",
//       gender: employee.gender || "female",
//       dob: toInputDate(employee.dob),
//       phone: employee.phone || "",
//       personal_email: employee.personal_email || employee.email || "",
//       address: employee.address || "",
//       designation: employee.designation || "",
//       department_id: employee.department_id || "",
//       join_date: toInputDate(employee.join_date),
//       salary_type: employee.salary_type || "fixed",
//       monthly_salary: employee.monthly_salary || 0,
//       create_login: typeof employee.create_login === "boolean" ? employee.create_login : false,
//       role: employee.role || "agent",
//     })

//     const bank = (employee && employee.bank) || {}
//     setBankFormData({
//       pan: bank.pan || employee.pan || "",
//       aadhaar: bank.aadhaar || employee.aadhaar || "",
//       bank_name: bank.bank_name || employee.bank_name || "",
//       ifsc: bank.ifsc || employee.ifsc || "",
//       account_number: bank.account_number || employee.account_number || "",
//       account_holder_name: bank.account_holder_name || employee.account_holder_name || "",
//     })

//     setEditModalOpen(true)
//   }

//   const submitBank = async (e) => {
//     e.preventDefault()
//     if (!editFormData || !editFormData.id) return
//     setBankSubmitting(true)
//     setBankError(null)
//     try {
//       const payload = {
//         pan: bankFormData.pan?.trim() || " ",
//         aadhaar: bankFormData.aadhaar?.trim() || " ",
//         bank_name: bankFormData.bank_name?.trim() || " ",
//         ifsc: bankFormData.ifsc?.trim() || " ",
//         account_number: bankFormData.account_number?.trim() || " ",
//         account_holder_name: bankFormData.account_holder_name?.trim() || " ",
//       }

//       const res = await fetch(`${API_BASE_URL}employees/${editFormData.id}/bank`, {
//         method: "PUT",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(payload),
//       })
//       if (!res.ok) throw new Error("Failed to update employee bank details")
//       await res.json()

//       setBankSubmitting(false)
//     } catch (err) {
//       setBankSubmitting(false)
//       setBankError(err?.message || "Failed to update employee bank details")
//     }
//   }

//   const handleEditChange = (e) => {
//     const { name, value } = e.target
//     setEditFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleEditCheckbox = (e) => {
//     const { name, checked } = e.target
//     setEditFormData((prev) => ({ ...prev, [name]: checked }))
//   }

//   const submitEdit = async (e) => {
//     e.preventDefault()
//     if (!editFormData || !editFormData.id) return
//     setEditSubmitting(true)
//     setEditError(null)
//     try {
//       const payload = {
//         first_name: editFormData.first_name?.trim(),
//         last_name: editFormData.last_name?.trim(),
//         gender: editFormData.gender,
//         dob: editFormData.dob || null,
//         phone: editFormData.phone?.trim(),
//         personal_email: editFormData.personal_email?.trim(),
//         address: editFormData.address?.trim(),
//         designation: editFormData.designation?.trim(),
//         department_id: editFormData.department_id ? Number(editFormData.department_id) : null,
//         join_date: editFormData.join_date || null,
//         salary_type: editFormData.salary_type,
//         monthly_salary: Number(editFormData.monthly_salary) || 0,
//         create_login: !!editFormData.create_login,
//         role: editFormData.role,
//       }

//       updateEmployeeMutation.mutate(
//         { id: editFormData.id, data: payload },
//         {
//           onSuccess: () => {
//             setEditSubmitting(false)
//             setEditModalOpen(false)
//             setEditFormData(null)
//           },
//           onError: (err) => {
//             setEditSubmitting(false)
//             setEditError(err?.message || "Failed to update employee")
//           },
//         },
//       )
//     } catch (err) {
//       setEditSubmitting(false)
//       setEditError(err?.message || "Failed to update employee")
//     }
//   }

//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [searchTerm, departmentFilter, statusFilter])

//   if (isLoading) {
//     return (
//       <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
//         <main className="p-6 ml-4 mr-4">
//           <div className="flex items-center justify-center h-64">
//             <div className="text-lg text-gray-600">Loading employees...</div>
//           </div>
//         </main>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
//         <main className="p-6 ml-4 mr-4">
//           <div className="flex items-center justify-center h-64">
//             <div className="text-lg text-red-600">Error loading employees: {error.message}</div>
//           </div>
//         </main>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
//       {/* Main Content Area */}
//       <main className="p-6 ml-4 mr-4">
//         {/* Page Title */}
//         <div className="">
//           {/* <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1> */}
//           {/* <p className="text-gray-600 mt-2">Manage your team members and their information</p> */}
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
//           {/* Total Employees */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Employees</p>
//                 <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
//                 <p className="text-sm text-green-600 mt-1">
//                   <span className="font-medium">+8</span> this month
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
//                 <Users className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Active Employees */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Active</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {employees.filter((emp) => emp.status === "active").length}
//                 </p>
//                 <p className="text-sm text-green-600 mt-1">
//                   <span className="font-medium">91%</span> active rate
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
//                 <CheckCircle className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Departments */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Departments</p>
//                 <p className="text-3xl font-bold text-gray-900">8</p>
//                 <p className="text-sm text-blue-600 mt-1">
//                   <span className="font-medium">Engineering</span> largest
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
//                 <Building className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* New Hires */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">New Hires</p>
//                 <p className="text-3xl font-bold text-gray-900">12</p>
//                 <p className="text-sm text-orange-600 mt-1">
//                   <span className="font-medium">This month</span>
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
//                 <Users className="w-6 h-6 text-white" />
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
//                   placeholder="Search employees..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//                 <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//               </div>

//               {/* Department Filter */}
//               <select
//                 value={departmentFilter}
//                 onChange={(e) => setDepartmentFilter(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="">All Departments</option>
//                 <option value="engineering">Engineering</option>
//                 <option value="marketing">Marketing</option>
//                 <option value="sales">Sales</option>
//                 <option value="hr">Human Resources</option>
//                 <option value="finance">Finance</option>
//                 <option value="operations">Operations</option>
//                 <option value="design">Design</option>
//                 <option value="support">Customer Support</option>
//               </select>

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
//             </div>

//             {/* Actions */}
//             <div className="flex gap-3">
//               <button
//                 onClick={exportEmployees}
//                 className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
//               >
//                 <Download className="inline-block w-5 h-5 mr-2" />
//                 Export
//               </button>
//               <button
//                 onClick={handleAddEmployee}
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
//               >
//                 <Plus className="inline-block w-5 h-5 mr-2" />
//                 Add Employee
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Employee Table */}
//         <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">All Employees</h3>
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

//           <div className="w-full overflow-x-auto">
//             <table className="min-w-full table-auto divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={(e) => handleSelectAll(e.target.checked)}
//                       className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                     />
//                   </th>
//                   <th
//                     onClick={() => handleSort("name")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Employee
//                   </th>
//                   <th
//                     onClick={() => handleSort("department")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Department
//                   </th>
//                   <th
//                     onClick={() => handleSort("designation")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Designation
//                   </th>
//                   <th
//                     onClick={() => handleSort("joinDate")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Join Date
//                   </th>
//                   <th
//                     onClick={() => handleSort("salary")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Salary
//                   </th>
//                   <th
//                     onClick={() => handleSort("status")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {employees.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">
//                       No employees found.
//                     </td>
//                   </tr>
//                 ) : (
//                   currentEmployees.map((employee) => (
//                     <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
//                       <td className="px-4 py-4">
//                         <input
//                           type="checkbox"
//                           checked={selectedEmployees.includes(employee.id)}
//                           onChange={(e) => handleSelectEmployee(employee.id, e.target.checked)}
//                           className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                         />
//                       </td>
//                       <td className="px-4 py-4">
//                         <div className="flex items-center">
//                           <div className="h-10 w-10 flex-shrink-0">
//                             <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
//                               <span className="text-white font-medium text-sm">
//                                 {`${employee.first_name || ""} ${employee.last_name || ""}`
//                                   .trim()
//                                   .split(" ")
//                                   .filter(Boolean)
//                                   .map((n) => n[0])
//                                   .join("")
//                                   .toUpperCase() || "–"}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {`${employee.first_name || ""} ${employee.last_name || ""}`.trim() || "Unnamed"}
//                             </div>
//                             <div className="text-sm text-gray-500">{employee.personal_email || "—"}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           {employee.department || employee.department_name || employee.department_id || "—"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">{employee.designation}</td>
//                       <td className="px-4 py-4 text-sm text-gray-500">
//                         {employee.join_date
//                           ? new Date(employee.join_date).toLocaleDateString("en-US", {
//                               year: "numeric",
//                               month: "short",
//                               day: "numeric",
//                             })
//                           : "N/A"}
//                       </td>
//                       <td className="px-4 py-4 text-sm font-medium text-gray-900">
//                         {formatSalary(employee.monthly_salary, employee.salary_type)}
//                       </td>
//                       <td className="px-4 py-4">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             employee.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {employee.status?.charAt(0).toUpperCase() + employee.status?.slice(1)}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-sm font-medium">
//                         <div className="flex items-center space-x-2 flex-wrap">
//                           <button
//                             onClick={() => viewEmployee(employee.id)}
//                             className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
//                             title="View Details"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => openEdit(employee)}
//                             className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                             title="Edit"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteEmployee(employee.id)}
//                             className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="bg-white px-6 py-4 border-t border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Showing <span>{startIndex + 1}</span> to <span>{Math.min(endIndex, totalEmployees)}</span> of{" "}
//                 <span>{totalEmployees}</span> entries
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

//       {/* Employee Details Modal */}
//       {employeeModalOpen && selectedEmployee && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-semibold text-gray-900">Employee Details</h3>
//                   <button onClick={() => setEmployeeModalOpen(false)} className="text-gray-400 hover:text-gray-600">
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h4>
//                     <div className="space-y-3">
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Full Name</label>
//                         <p className="text-gray-900">{`${selectedEmployee.first_name || ""} ${selectedEmployee.last_name || ""}`}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Email</label>
//                         <p className="text-gray-900">{selectedEmployee.email}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Phone</label>
//                         <p className="text-gray-900">{selectedEmployee.phone}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Address</label>
//                         <p className="text-gray-900">{selectedEmployee.address}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Job Information</h4>
//                     <div className="space-y-3">
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Department</label>
//                         <p className="text-gray-900">{selectedEmployee.department}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Designation</label>
//                         <p className="text-gray-900">{selectedEmployee.designation}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Join Date</label>
//                         <p className="text-gray-900">
//                           {selectedEmployee.join_date
//                             ? new Date(selectedEmployee.join_date).toLocaleDateString()
//                             : "N/A"}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Salary</label>
//                         <p className="text-gray-900">
//                           {formatSalary(selectedEmployee.monthly_salary, selectedEmployee.salary_type)}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Status</label>
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             selectedEmployee.status === "active"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {selectedEmployee.status?.charAt(0).toUpperCase() + selectedEmployee.status?.slice(1)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="md:col-span-2 space-y-4">
//                     <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Bank Details</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">PAN Number</label>
//                         <p className="text-gray-900">{selectedEmployee.pan || "N/A"}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Aadhaar Number</label>
//                         <p className="text-gray-900">{selectedEmployee.aadhaar || "N/A"}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Bank Name</label>
//                         <p className="text-gray-900">{selectedEmployee.bank_name || "N/A"}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">IFSC Code</label>
//                         <p className="text-gray-900">{selectedEmployee.ifsc || "N/A"}</p>
//                       </div>
//                       <div className="md:col-span-2">
//                         <label className="text-sm font-medium text-gray-500">Account Number</label>
//                         <p className="text-gray-900">{selectedEmployee.account_number || "N/A"}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button
//                     onClick={() => {
//                       setEmployeeModalOpen(false)
//                       openEdit(selectedEmployee)
//                     }}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                   >
//                     Edit Employee
//                   </button>
//                   <button
//                     onClick={() => setEmployeeModalOpen(false)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {editModalOpen && editFormData && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="flex items-center justify-center min-h-screen p-4 w-full">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//                 <h3 className="text-xl font-semibold text-gray-900">Edit Employee</h3>
//                 <button
//                   onClick={() => setEditModalOpen(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                   aria-label="Close edit dialog"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <form onSubmit={submitEdit} className="p-6 space-y-6">
//                 {editError && (
//                   <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
//                     {editError}
//                   </div>
//                 )}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">First Name</label>
//                     <input
//                       type="text"
//                       name="first_name"
//                       value={editFormData.first_name}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Last Name</label>
//                     <input
//                       type="text"
//                       name="last_name"
//                       value={editFormData.last_name}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Gender</label>
//                     <select
//                       name="gender"
//                       value={editFormData.gender}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value="female">Female</option>
//                       <option value="male">Male</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                     <input
//                       type="date"
//                       name="dob"
//                       value={editFormData.dob || ""}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Phone</label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={editFormData.phone}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Personal Email</label>
//                     <input
//                       type="email"
//                       name="personal_email"
//                       value={editFormData.personal_email}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700">Address</label>
//                     <textarea
//                       name="address"
//                       value={editFormData.address}
//                       onChange={handleEditChange}
//                       rows={3}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Designation</label>
//                     <input
//                       type="text"
//                       name="designation"
//                       value={editFormData.designation}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Department ID</label>
//                     <input
//                       type="number"
//                       name="department_id"
//                       value={editFormData.department_id}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       min="1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Join Date</label>
//                     <input
//                       type="date"
//                       name="join_date"
//                       value={editFormData.join_date || ""}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Salary Type</label>
//                     <select
//                       name="salary_type"
//                       value={editFormData.salary_type}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value="fixed">Fixed</option>
//                       <option value="hourly">Hourly</option>
//                       <option value="commission">Commission</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Monthly Salary</label>
//                     <input
//                       type="number"
//                       name="monthly_salary"
//                       value={editFormData.monthly_salary}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       min="0"
//                       step="1"
//                     />
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <input
//                       id="create_login"
//                       type="checkbox"
//                       name="create_login"
//                       checked={!!editFormData.create_login}
//                       onChange={handleEditCheckbox}
//                       className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                     />
//                     <label htmlFor="create_login" className="text-sm font-medium text-gray-700">
//                       Create Login
//                     </label>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Role</label>
//                     <select
//                       name="role"
//                       value={editFormData.role}
//                       onChange={handleEditChange}
//                       className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value="agent">Agent</option>
//                       <option value="manager">Manager</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Bank Details Section */}
//                 <div className="mt-6 border-t pt-6">
//                   <h3 className="text-base font-medium text-gray-900">Bank Details</h3>
//                   {bankError ? <p className="mt-2 text-sm text-red-600">{bankError}</p> : null}

//                   <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="flex flex-col gap-1">
//                       <label className="text-sm text-gray-700">PAN</label>
//                       <input
//                         type="text"
//                         value={bankFormData.pan}
//                         onChange={(e) => setBankFormData({ ...bankFormData, pan: e.target.value })}
//                         className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder="Enter PAN"
//                       />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                       <label className="text-sm text-gray-700">Aadhaar</label>
//                       <input
//                         type="text"
//                         value={bankFormData.aadhaar}
//                         onChange={(e) => setBankFormData({ ...bankFormData, aadhaar: e.target.value })}
//                         className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder="Enter Aadhaar"
//                       />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                       <label className="text-sm text-gray-700">Bank Name</label>
//                       <input
//                         type="text"
//                         value={bankFormData.bank_name}
//                         onChange={(e) => setBankFormData({ ...bankFormData, bank_name: e.target.value })}
//                         className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder="Enter Bank Name"
//                       />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                       <label className="text-sm text-gray-700">IFSC</label>
//                       <input
//                         type="text"
//                         value={bankFormData.ifsc}
//                         onChange={(e) => setBankFormData({ ...bankFormData, ifsc: e.target.value })}
//                         className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder="Enter IFSC"
//                       />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                       <label className="text-sm text-gray-700">Account Number</label>
//                       <input
//                         type="text"
//                         value={bankFormData.account_number}
//                         onChange={(e) => setBankFormData({ ...bankFormData, account_number: e.target.value })}
//                         className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder="Enter Account Number"
//                       />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                       <label className="text-sm text-gray-700">Account Holder Name</label>
//                       <input
//                         type="text"
//                         value={bankFormData.account_holder_name}
//                         onChange={(e) => setBankFormData({ ...bankFormData, account_holder_name: e.target.value })}
//                         className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder="Enter Account Holder Name"
//                       />
//                     </div>

//                     <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
//                       <button
//                         type="button"
//                         onClick={submitBank}
//                         disabled={bankSubmitting}
//                         className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-white text-sm hover:bg-green-700 disabled:opacity-60"
//                       >
//                         {bankSubmitting ? "Saving..." : "Save Bank Details"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setEditModalOpen(false)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                     disabled={editSubmitting}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={editSubmitting}
//                     className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
//                   >
//                     {editSubmitting ? "Saving..." : "Save Changes"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModalOpen && employeeToDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
//               <div className="p-6">
//                 <div className="flex items-center mb-4">
//                   <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
//                     <AlertTriangle className="w-6 h-6 text-red-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Delete Employee</h3>
//                     <p className="text-sm text-gray-500">This action cannot be undone.</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 mb-6">
//                   Are you sure you want to delete{" "}
//                   <span className="font-semibold">{`${employeeToDelete.first_name || ""} ${employeeToDelete.last_name || ""}`}</span>
//                   ? This will permanently remove their record from the system.
//                 </p>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     onClick={() => setDeleteModalOpen(false)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                     disabled={deleteEmployeeMutation.isLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmDelete}
//                     disabled={deleteEmployeeMutation.isLoading}
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
//                   >
//                     {deleteEmployeeMutation.isLoading ? "Deleting..." : "Delete"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }




















// import { useState, useEffect, useMemo } from "react"
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

// export default function ProductService() {
//   // Sample product data
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       productName: "TickZap - 3 Year Panel",
//       productType: "Service",
//       category: "Website",
//       description: "Complete website management panel for 3 years",
//       unitPrice: 15000.0,
//       gstRate: "18",
//       hsnSacCode: "998314",
//       activeStatus: "Active",
//     },
//     {
//       id: 2,
//       productName: "Domain Registration",
//       productType: "Product",
//       category: "Domain",
//       description: "Annual domain registration service",
//       unitPrice: 1200.0,
//       gstRate: "18",
//       hsnSacCode: "998313",
//       activeStatus: "Active",
//     },
//     {
//       id: 3,
//       productName: "Web Hosting Premium",
//       productType: "Service",
//       category: "Hosting",
//       description: "Premium web hosting with 99.9% uptime guarantee",
//       unitPrice: 5000.0,
//       gstRate: "18",
//       hsnSacCode: "998314",
//       activeStatus: "Active",
//     },
//     {
//       id: 4,
//       productName: "Email Suite Professional",
//       productType: "Service",
//       category: "Email",
//       description: "Professional email hosting with advanced features",
//       unitPrice: 3000.0,
//       gstRate: "18",
//       hsnSacCode: "998314",
//       activeStatus: "Inactive",
//     },
//     {
//       id: 5,
//       productName: "SSL Certificate",
//       productType: "Product",
//       category: "Website",
//       description: "Extended validation SSL certificate",
//       unitPrice: 2500.0,
//       gstRate: "18",
//       hsnSacCode: "998313",
//       activeStatus: "Active",
//     },
//     {
//       id: 6,
//       productName: "Website Maintenance",
//       productType: "Service",
//       category: "Website",
//       description: "Monthly website maintenance and updates",
//       unitPrice: 8000.0,
//       gstRate: "18",
//       hsnSacCode: "998314",
//       activeStatus: "Active",
//     },
//   ])

//   // Form state for adding new products
//   const [showAddForm, setShowAddForm] = useState(false)
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
//   const [selectedProduct, setSelectedProduct] = useState(null)
//   const [productToDelete, setProductToDelete] = useState(null)

//   // Filter and sort products
//   const filteredProducts = useMemo(() => {
//     const filtered = products.filter((product) => {
//       const matchesSearch =
//         product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.description.toLowerCase().includes(searchTerm.toLowerCase())

//       const matchesStatus = !statusFilter || product.activeStatus === statusFilter
//       const matchesCategory = !categoryFilter || product.category === categoryFilter

//       return matchesSearch && matchesStatus && matchesCategory
//     })

//     // Sort products
//     if (sortColumn) {
//       filtered.sort((a, b) => {
//         let aValue, bValue

//         switch (sortColumn) {
//           case "productName":
//             aValue = a.productName.toLowerCase()
//             bValue = b.productName.toLowerCase()
//             break
//           case "category":
//             aValue = a.category.toLowerCase()
//             bValue = b.category.toLowerCase()
//             break
//           case "unitPrice":
//             aValue = a.unitPrice
//             bValue = b.unitPrice
//             break
//           case "activeStatus":
//             aValue = a.activeStatus
//             bValue = b.activeStatus
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
//     return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-100 text-green-800"
//       case "Inactive":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }
  
//   const navigate = useNavigate()
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

//   const deleteProduct = (id) => {
//     const product = products.find((prod) => prod.id === id)
//     setProductToDelete(product)
//     setDeleteModalOpen(true)
//   }

//   const confirmDelete = () => {
//     if (productToDelete) {
//       setProducts(products.filter((prod) => prod.id !== productToDelete.id))
//       setDeleteModalOpen(false)
//       setProductToDelete(null)
//     }
//   }

//   const exportProducts = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       "Product Name,Type,Category,Unit Price,GST Rate,HSN/SAC Code,Status\n" +
//       filteredProducts
//         .map(
//           (prod) =>
//             `"${prod.productName}","${prod.productType}","${prod.category}","${formatCurrency(prod.unitPrice)}","${prod.gstRate}%","${prod.hsnSacCode}","${prod.activeStatus}"`,
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

//   const validateForm = () => {
//     const errors = {}

//     if (!formData.productName.trim()) {
//       errors.productName = "Product name is required"
//     }
//     if (!formData.productType) {
//       errors.productType = "Product type is required"
//     }
//     if (!formData.category) {
//       errors.category = "Category is required"
//     }
//     if (!formData.unitPrice || Number.parseFloat(formData.unitPrice) <= 0) {
//       errors.unitPrice = "Unit price must be positive"
//     }
//     if (!formData.gstRate) {
//       errors.gstRate = "GST rate is required"
//     }
//     if (!formData.hsnSacCode || formData.hsnSacCode.length < 6) {
//       errors.hsnSacCode = "HSN/SAC code must be at least 6 digits"
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
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       const newProduct = {
//         id: products.length + 1,
//         ...formData,
//         unitPrice: Number.parseFloat(formData.unitPrice),
//       }

//       setProducts([...products, newProduct])
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
//       setShowAddForm(false)
//     } catch (error) {
//       console.error("Error saving product:", error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Calculate stats
//   const totalProducts = products.length
//   const activeProducts = products.filter((prod) => prod.activeStatus === "Active").length
//   const inactiveProducts = products.filter((prod) => prod.activeStatus === "Inactive").length
//   const totalValue = products.reduce((sum, prod) => sum + prod.unitPrice, 0)

//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [searchTerm, statusFilter, categoryFilter])

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
//                   <span className="font-medium">+2</span> this month
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
//                   <span className="font-medium">Inventory worth</span>
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
//                   placeholder="Search products..."
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
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
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
//                 // onClick={() => setShowAddForm(true)}
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
//                   <th
//                     onClick={() => handleSort("productName")}
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
//                     onClick={() => handleSort("unitPrice")}
//                     className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Unit Price
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     GST Rate
//                   </th>
//                   <th
//                     onClick={() => handleSort("activeStatus")}
//                     className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Status
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
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0">
//                           <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
//                             <Package className="w-5 h-5 text-white" />
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{product.productName}</div>
//                           <div className="text-sm text-gray-500">{product.hsnSacCode}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productType}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}
//                       >
//                         {product.category}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {formatCurrency(product.unitPrice)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.gstRate}%</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.activeStatus)}`}
//                       >
//                         {product.activeStatus}
//                       </span>
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
//                 {/* Product Name */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Package className="w-4 h-4 mr-2" />
//                     Product Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.productName}
//                     onChange={(e) => handleInputChange("productName", e.target.value)}
//                     placeholder="e.g., TickZap - 3 Year Panel"
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                       formErrors.productName ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {formErrors.productName && <p className="mt-1 text-sm text-red-600">{formErrors.productName}</p>}
//                 </div>

//                 {/* Product Type */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Tag className="w-4 h-4 mr-2" />
//                     Product Type *
//                   </label>
//                   <select
//                     value={formData.productType}
//                     onChange={(e) => handleInputChange("productType", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                       formErrors.productType ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select product type</option>
//                     <option value="Product">Product</option>
//                     <option value="Service">Service</option>
//                   </select>
//                   {formErrors.productType && <p className="mt-1 text-sm text-red-600">{formErrors.productType}</p>}
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
//                     value={formData.unitPrice}
//                     onChange={(e) => handleInputChange("unitPrice", e.target.value)}
//                     placeholder="0.00"
//                     min="0"
//                     step="0.01"
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                       formErrors.unitPrice ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {formErrors.unitPrice && <p className="mt-1 text-sm text-red-600">{formErrors.unitPrice}</p>}
//                 </div>

//                 {/* GST Rate */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Receipt className="w-4 h-4 mr-2" />
//                     GST Rate (%) *
//                   </label>
//                   <select
//                     value={formData.gstRate}
//                     onChange={(e) => handleInputChange("gstRate", e.target.value)}
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                       formErrors.gstRate ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <option value="">Select GST rate</option>
//                     <option value="0">0%</option>
//                     <option value="5">5%</option>
//                     <option value="12">12%</option>
//                     <option value="18">18%</option>
//                     <option value="28">28%</option>
//                   </select>
//                   {formErrors.gstRate && <p className="mt-1 text-sm text-red-600">{formErrors.gstRate}</p>}
//                 </div>

//                 {/* HSN / SAC Code */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Hash className="w-4 h-4 mr-2" />
//                     HSN / SAC Code *
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.hsnSacCode}
//                     onChange={(e) => handleInputChange("hsnSacCode", e.target.value)}
//                     placeholder="6+ digit GST classification code"
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                       formErrors.hsnSacCode ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                   {formErrors.hsnSacCode && <p className="mt-1 text-sm text-red-600">{formErrors.hsnSacCode}</p>}
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
//                         value="Active"
//                         checked={formData.activeStatus === "Active"}
//                         onChange={(e) => handleInputChange("activeStatus", e.target.value)}
//                         className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Active</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="activeStatus"
//                         value="Inactive"
//                         checked={formData.activeStatus === "Inactive"}
//                         onChange={(e) => handleInputChange("activeStatus", e.target.value)}
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
//                     disabled={isSubmitting}
//                     className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     {isSubmitting ? (
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
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
//                 <button onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-gray-600">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Information</h4>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Product Name</label>
//                       <p className="text-gray-900">{selectedProduct.productName}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Product Type</label>
//                       <p className="text-gray-900">{selectedProduct.productType}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Category</label>
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedProduct.category)}`}
//                       >
//                         {selectedProduct.category}
//                       </span>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">HSN/SAC Code</label>
//                       <p className="text-gray-900">{selectedProduct.hsnSacCode}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Status</h4>
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Unit Price</label>
//                       <p className="text-2xl font-bold text-indigo-600">{formatCurrency(selectedProduct.unitPrice)}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">GST Rate</label>
//                       <p className="text-gray-900">{selectedProduct.gstRate}%</p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Status</label>
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProduct.activeStatus)}`}
//                       >
//                         {selectedProduct.activeStatus}
//                       </span>
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
//                 <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
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
//                 Are you sure you want to delete product{" "}
//                 <span className="font-semibold">{productToDelete.productName}</span>? This will permanently remove the
//                 product from the system.
//               </p>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setDeleteModalOpen(false)}
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

