
// import { useState, useEffect, useMemo } from "react"
// import { z } from "zod"
// import {
//   Search,
//   Users,
//   CheckCircle,
//   UserCheck,
//   Plus,
//   Download,
//   Eye,
//   Edit,
//   Trash2,
//   X,
//   AlertTriangle,
//   Link,
//   UserX,
// } from "lucide-react"

// // Zod schema for user validation
// const userSchema = z.object({
//   id: z.number(),
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email format"),
//   phone: z.string().min(10, "Phone number must be at least 10 digits"),
//   role: z.enum(["admin", "employee", "manager", "hr", "staff"]),
//   status: z.enum(["active", "inactive"]),
//   joinDate: z.string(),
//   linkedEmployeeId: z.number().nullable(),
//   avatar: z.string().optional(),
// })

// export default function UserList() {
//   // Sample user data
//   const [users, setUsers] = useState([
//     {
//       id: 1,
//       name: "Sarah Johnson",
//       email: "sarah.johnson@company.com",
//       phone: "9876543210",
//       role: "admin",
//       status: "active",
//       joinDate: "2022-03-15",
//       linkedEmployeeId: 1,
//       avatar: null,
//     },
//     {
//       id: 2,
//       name: "Michael Chen",
//       email: "michael.chen@company.com",
//       phone: "9876543211",
//       role: "manager",
//       status: "active",
//       joinDate: "2021-08-22",
//       linkedEmployeeId: 2,
//       avatar: null,
//     },
//     {
//       id: 3,
//       name: "Emily Rodriguez",
//       email: "emily.rodriguez@company.com",
//       phone: "9876543212",
//       role: "employee",
//       status: "active",
//       joinDate: "2023-01-10",
//       linkedEmployeeId: null,
//       avatar: null,
//     },
//     {
//       id: 4,
//       name: "David Kumar",
//       email: "david.kumar@company.com",
//       phone: "9876543213",
//       role: "employee",
//       status: "active",
//       joinDate: "2022-11-05",
//       linkedEmployeeId: 4,
//       avatar: null,
//     },
//     {
//       id: 5,
//       name: "Lisa Thompson",
//       email: "lisa.thompson@company.com",
//       phone: "9876543214",
//       role: "hr",
//       status: "inactive",
//       joinDate: "2021-06-18",
//       linkedEmployeeId: null,
//       avatar: null,
//     },
//     {
//       id: 6,
//       name: "James Wilson",
//       email: "james.wilson@company.com",
//       phone: "9876543215",
//       role: "staff",
//       status: "active",
//       joinDate: "2022-09-12",
//       linkedEmployeeId: 6,
//       avatar: null,
//     },
//   ])

//   // Sample employee data for linking
//   const [employees] = useState([
//     { id: 1, name: "Sarah Johnson", email: "sarah.johnson@company.com", department: "Engineering" },
//     { id: 2, name: "Michael Chen", email: "michael.chen@company.com", department: "Marketing" },
//     { id: 3, name: "Robert Smith", email: "robert.smith@company.com", department: "Sales" },
//     { id: 4, name: "David Kumar", email: "david.kumar@company.com", department: "Sales" },
//     { id: 5, name: "Jennifer Davis", email: "jennifer.davis@company.com", department: "HR" },
//     { id: 6, name: "James Wilson", email: "james.wilson@company.com", department: "Finance" },
//     { id: 7, name: "Maria Garcia", email: "maria.garcia@company.com", department: "Operations" },
//   ])

//   // Table state
//   const [currentPage, setCurrentPage] = useState(1)
//   const [entriesPerPage, setEntriesPerPage] = useState(10)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [roleFilter, setRoleFilter] = useState("")
//   const [statusFilter, setStatusFilter] = useState("")
//   const [sortColumn, setSortColumn] = useState("")
//   const [sortDirection, setSortDirection] = useState("asc")
//   const [selectedUsers, setSelectedUsers] = useState([])
//   const [selectAll, setSelectAll] = useState(false)

//   // Modal state
//   const [userModalOpen, setUserModalOpen] = useState(false)
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false)
//   const [linkEmployeeModalOpen, setLinkEmployeeModalOpen] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [userToDelete, setUserToDelete] = useState(null)
//   const [userToLink, setUserToLink] = useState(null)
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
//   const [employeeSearchTerm, setEmployeeSearchTerm] = useState("")

//   // Filter and sort users
//   const filteredUsers = useMemo(() => {
//     const filtered = users.filter((user) => {
//       const matchesSearch =
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.role.toLowerCase().includes(searchTerm.toLowerCase())
//       const matchesRole = !roleFilter || user.role === roleFilter
//       const matchesStatus = !statusFilter || user.status === statusFilter
//       return matchesSearch && matchesRole && matchesStatus
//     })

//     // Sort users
//     if (sortColumn) {
//       filtered.sort((a, b) => {
//         let aValue, bValue
//         switch (sortColumn) {
//           case "name":
//             aValue = a.name.toLowerCase()
//             bValue = b.name.toLowerCase()
//             break
//           case "role":
//             aValue = a.role.toLowerCase()
//             bValue = b.role.toLowerCase()
//             break
//           case "joinDate":
//             aValue = new Date(a.joinDate)
//             bValue = new Date(b.joinDate)
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
//   }, [users, searchTerm, roleFilter, statusFilter, sortColumn, sortDirection])

//   // Pagination
//   const totalPages = Math.ceil(filteredUsers.length / entriesPerPage)
//   const startIndex = (currentPage - 1) * entriesPerPage
//   const endIndex = startIndex + entriesPerPage
//   const currentUsers = filteredUsers.slice(startIndex, endIndex)

//   // Helper functions
//   const getLinkedEmployeeName = (linkedEmployeeId) => {
//     if (!linkedEmployeeId) return "Not Linked"
//     const employee = employees.find((emp) => emp.id === linkedEmployeeId)
//     return employee ? employee.name : "Unknown Employee"
//   }

//   const getRoleColor = (role) => {
//     const colors = {
//       admin: "bg-red-100 text-red-800",
//       manager: "bg-purple-100 text-purple-800",
//       hr: "bg-green-100 text-green-800",
//       employee: "bg-blue-100 text-blue-800",
//       staff: "bg-gray-100 text-gray-800",
//     }
//     return colors[role] || "bg-gray-100 text-gray-800"
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
//       setSelectedUsers(currentUsers.map((user) => user.id))
//     } else {
//       setSelectedUsers([])
//     }
//   }

//   const handleSelectUser = (id, checked) => {
//     if (checked) {
//       setSelectedUsers([...selectedUsers, id])
//     } else {
//       setSelectedUsers(selectedUsers.filter((userId) => userId !== id))
//       setSelectAll(false)
//     }
//   }

//   const viewUser = (id) => {
//     const user = users.find((u) => u.id === id)
//     setSelectedUser(user)
//     setUserModalOpen(true)
//   }

//   const deleteUser = (id) => {
//     const user = users.find((u) => u.id === id)
//     setUserToDelete(user)
//     setDeleteModalOpen(true)
//   }

//   const confirmDelete = () => {
//     if (userToDelete) {
//       setUsers(users.filter((u) => u.id !== userToDelete.id))
//       setDeleteModalOpen(false)
//       setUserToDelete(null)
//     }
//   }

//   const openLinkEmployeeModal = (user) => {
//     setUserToLink(user)
//     setSelectedEmployeeId("")
//     setEmployeeSearchTerm("")
//     setLinkEmployeeModalOpen(true)
//   }

//   const linkEmployee = () => {
//     if (userToLink && selectedEmployeeId) {
//       setUsers(
//         users.map((user) =>
//           user.id === userToLink.id ? { ...user, linkedEmployeeId: Number.parseInt(selectedEmployeeId) } : user,
//         ),
//       )
//       setLinkEmployeeModalOpen(false)
//       setUserToLink(null)
//       setSelectedEmployeeId("")
//     }
//   }

//   const unlinkEmployee = (userId) => {
//     setUsers(users.map((user) => (user.id === userId ? { ...user, linkedEmployeeId: null } : user)))
//   }

//   const exportUsers = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       "Name,Email,Phone,Role,Status,Join Date,Linked Employee\n" +
//       filteredUsers
//         .map(
//           (user) =>
//             `"${user.name}","${user.email}","${user.phone}","${user.role}","${user.status}","${user.joinDate}","${getLinkedEmployeeName(user.linkedEmployeeId)}"`,
//         )
//         .join("\n")
//     const encodedUri = encodeURI(csvContent)
//     const link = document.createElement("a")
//     link.setAttribute("href", encodedUri)
//     link.setAttribute("download", "users.csv")
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   // Filter employees for linking modal
//   const filteredEmployees = employees.filter(
//     (employee) =>
//       employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
//       employee.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()),
//   )

//   // Reset page when
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [searchTerm, roleFilter, statusFilter])

//   // Calculate stats
//   const totalUsers = users.length
//   const activeUsers = users.filter((user) => user.status === "active").length
//   const usersWithoutEmployeeLink = users.filter((user) => !user.linkedEmployeeId).length
//   const adminCount = users.filter((user) => user.role === "admin").length

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
//       {/* Main Content Area */}
//       <main className="p-6 ml-4 mr-4">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
//           {/* Total Users */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Users</p>
//                 <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
//                 <p className="text-sm text-green-600 mt-1">
//                   <span className="font-medium">+3</span> this month
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
//                 <Users className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Active Users */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Active Users</p>
//                 <p className="text-3xl font-bold text-gray-900">{activeUsers}</p>
//                 <p className="text-sm text-green-600 mt-1">
//                   <span className="font-medium">{Math.round((activeUsers / totalUsers) * 100)}%</span> active rate
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
//                 <CheckCircle className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Users without Employee Link */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Without Employee Link</p>
//                 <p className="text-3xl font-bold text-gray-900">{usersWithoutEmployeeLink}</p>
//                 <p className="text-sm text-orange-600 mt-1">
//                   <span className="font-medium">Need linking</span>
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
//                 <UserX className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Admin Users */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Admin Users</p>
//                 <p className="text-3xl font-bold text-gray-900">{adminCount}</p>
//                 <p className="text-sm text-purple-600 mt-1">
//                   <span className="font-medium">System access</span>
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
//                 <UserCheck className="w-6 h-6 text-white" />
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
//                   placeholder="Search by name, email, role..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//                 <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//               </div>

//               {/* Role Filter */}
//               <select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="">All Roles</option>
//                 <option value="admin">Admin</option>
//                 <option value="manager">Manager</option>
//                 <option value="employee">Employee</option>
//                 <option value="hr">HR</option>
//                 <option value="staff">Staff</option>
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
//                 onClick={exportUsers}
//                 className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
//               >
//                 <Download className="inline-block w-5 h-5 mr-2" />
//                 Export
//               </button>
//               <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
//                 <Plus className="inline-block w-5 h-5 mr-2" />
//                 Add User
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
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
//                     User
//                   </th>
//                   <th
//                     onClick={() => handleSort("role")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Role
//                   </th>
//                   <th
//                     onClick={() => handleSort("status")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Linked Employee
//                   </th>
//                   <th
//                     onClick={() => handleSort("joinDate")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Join Date
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
//                     <td className="px-4 py-4">
//                       <input
//                         type="checkbox"
//                         checked={selectedUsers.includes(user.id)}
//                         onChange={(e) => handleSelectUser(user.id, e.target.checked)}
//                         className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0">
//                           <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
//                             <span className="text-white font-medium text-sm">
//                               {user.name
//                                 .split(" ")
//                                 .map((n) => n[0])
//                                 .join("")}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                           <div className="text-sm text-gray-500">{user.email}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
//                       >
//                         {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-900">
//                       <div className="flex items-center">
//                         <span className={user.linkedEmployeeId ? "text-gray-900" : "text-gray-400"}>
//                           {getLinkedEmployeeName(user.linkedEmployeeId)}
//                         </span>
//                         {user.linkedEmployeeId && (
//                           <button
//                             onClick={() => unlinkEmployee(user.id)}
//                             className="ml-2 text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                             title="Unlink Employee"
//                           >
//                             <X className="w-3 h-3" />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-500">
//                       {new Date(user.joinDate).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </td>
//                     <td className="px-4 py-4 text-sm font-medium">
//                       <div className="flex items-center space-x-2 flex-wrap">
//                         <button
//                           onClick={() => viewUser(user.id)}
//                           className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         {!user.linkedEmployeeId && (
//                           <button
//                             onClick={() => openLinkEmployeeModal(user)}
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                             title="Link Employee"
//                           >
//                             <Link className="w-4 h-4" />
//                           </button>
//                         )}
//                         <button
//                           className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                           title="Edit"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => deleteUser(user.id)}
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
//                 Showing <span>{startIndex + 1}</span> to <span>{Math.min(endIndex, filteredUsers.length)}</span> of{" "}
//                 <span>{filteredUsers.length}</span> entries
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

//       {/* User Details Modal */}
//       {userModalOpen && selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
//                   <button onClick={() => setUserModalOpen(false)} className="text-gray-400 hover:text-gray-600">
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
//                         <p className="text-gray-900">{selectedUser.name}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Email</label>
//                         <p className="text-gray-900">{selectedUser.email}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Phone</label>
//                         <p className="text-gray-900">{selectedUser.phone}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Information</h4>
//                     <div className="space-y-3">
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Role</label>
//                         <p className="text-gray-900">
//                           {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Join Date</label>
//                         <p className="text-gray-900">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Status</label>
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             selectedUser.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
//                         </span>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Linked Employee</label>
//                         <p className="text-gray-900">{getLinkedEmployeeName(selectedUser.linkedEmployeeId)}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
//                     Edit User
//                   </button>
//                   <button
//                     onClick={() => setUserModalOpen(false)}
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

//       {/* Link Employee Modal */}
//       {linkEmployeeModalOpen && userToLink && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold text-gray-900">Link Employee</h3>
//                   <button onClick={() => setLinkEmployeeModalOpen(false)} className="text-gray-400 hover:text-gray-600">
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <p className="text-gray-700 mb-4">
//                   Link <span className="font-semibold">{userToLink.name}</span> to an existing employee:
//                 </p>

//                 {/* Employee Search */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Search Employee</label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="Search by name or email..."
//                       value={employeeSearchTerm}
//                       onChange={(e) => setEmployeeSearchTerm(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     />
//                     <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                   </div>
//                 </div>

//                 {/* Employee Selection */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
//                   <select
//                     value={selectedEmployeeId}
//                     onChange={(e) => setSelectedEmployeeId(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   >
//                     <option value="">Choose an employee...</option>
//                     {filteredEmployees.map((employee) => (
//                       <option key={employee.id} value={employee.id}>
//                         {employee.name} - {employee.department}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex justify-end space-x-3">
//                   <button
//                     onClick={() => setLinkEmployeeModalOpen(false)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={linkEmployee}
//                     disabled={!selectedEmployeeId}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Link Employee
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModalOpen && userToDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
//               <div className="p-6">
//                 <div className="flex items-center mb-4">
//                   <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
//                     <AlertTriangle className="w-6 h-6 text-red-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
//                     <p className="text-sm text-gray-500">This action cannot be undone.</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 mb-6">
//                   Are you sure you want to delete <span className="font-semibold">{userToDelete.name}</span>? This will
//                   permanently remove their account from the system.
//                 </p>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     onClick={() => setDeleteModalOpen(false)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmDelete}
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                   >
//                     Delete
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
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { z } from "zod"
// import {
//   Search,
//   Users,
//   CheckCircle,
//   UserCheck,
//   Plus,
//   Download,
//   Eye,
//   Edit,
//   Trash2,
//   X,
//   AlertTriangle,
//   Link,
//   UserX,
// } from "lucide-react"
// import { useNavigate } from "react-router-dom"
// import { useDebounce } from "../../Util/useDebounce"

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// const fetchUsers = async (page, limit, ) => {
//   const token = sessionStorage.getItem("token")
//   console.log("Token:", token)

//   const response = await fetch(`${API_BASE_URL}users`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//   console.log(`${API_BASE_URL}users?limit=${limit}&page=${page}`)
//   if (!response.ok) {
//     throw new Error("Failed to fetch users")
//   }
//   return response.json()
// }

// const fetchUserById = async (id) => {
//   const token = sessionStorage.getItem("token")
//   const response = await fetch(`${API_BASE_URL}users/${id}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//   if (!response.ok) {
//     throw new Error("Failed to fetch user")
//   }
//   return response.json()
// }

// const updateUser = async ({ id, userData }) => {
//   const token = sessionStorage.getItem("token")
//   const response = await fetch(`${API_BASE_URL}users/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(userData),
//   })
//   if (!response.ok) {
//     throw new Error("Failed to update user")
//   }
//   return response.json()
// }

// const deleteUser = async (id) => {
//   const token = sessionStorage.getItem("token")
//   const response = await fetch(`${API_BASE_URL}users/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//   if (!response.ok) {
//     throw new Error("Failed to delete user")
//   }
//   return response.json()
// }

// // Zod schema for user validation
// const userSchema = z.object({
//   id: z.number(),
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email format"),
//   phone: z.string().min(10, "Phone number must be at least 10 digits"),
//   role: z.enum(["admin", "employee", "manager", "hr", "staff"]),
//   status: z.enum(["active", "inactive"]),
//   joinDate: z.string(),
//   linkedEmployeeId: z.number().nullable(),
//   avatar: z.string().optional(),
// })

// export default function UserList() {
//   const queryClient = useQueryClient()

//   const [currentPage, setCurrentPage] = useState(1)
//   const [entriesPerPage, setEntriesPerPage] = useState(10)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [roleFilter, setRoleFilter] = useState("")
//   const [statusFilter, setStatusFilter] = useState("")
//   const [sortColumn, setSortColumn] = useState("")
//   const [sortDirection, setSortDirection] = useState("asc")
//   const [selectedUsers, setSelectedUsers] = useState([])
//   const [selectAll, setSelectAll] = useState(false)

//   // const {
//   //   data: usersData,
//   //   isLoading,
//   //   error,
//   // } = useQuery({
//   //   queryKey: ["users", currentPage, entriesPerPage, searchTerm],
//   //   queryFn: () => fetchUsers(currentPage, entriesPerPage, searchTerm),
//   //   keepPreviousData: true,
//   // })
//   const debouncedSearch = useDebounce(searchTerm, 500)

// const {
//   data: usersData,
//   isLoading,
//   error,
// } = useQuery({
//   queryKey: ["users", currentPage, entriesPerPage, debouncedSearch],
//   queryFn: () => fetchUsers(currentPage, entriesPerPage, debouncedSearch),
//   keepPreviousData: true,
// })


//   const users = usersData?.rows || []
//   const totalUsers = usersData?.total || 0

//   const updateUserMutation = useMutation({
//     mutationFn: updateUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["users"])
//     },
//   })

//   const deleteUserMutation = useMutation({
//     mutationFn: deleteUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["users"])
//     },
//   })

//   // Sample employee data for linking
//   const [employees] = useState([
//     { id: 1, name: "Sarah Johnson", email: "sarah.johnson@company.com", department: "Engineering" },
//     { id: 2, name: "Michael Chen", email: "michael.chen@company.com", department: "Marketing" },
//     { id: 3, name: "Robert Smith", email: "robert.smith@company.com", department: "Sales" },
//     { id: 4, name: "David Kumar", email: "david.kumar@company.com", department: "Sales" },
//     { id: 5, name: "Jennifer Davis", email: "jennifer.davis@company.com", department: "HR" },
//     { id: 6, name: "James Wilson", email: "james.wilson@company.com", department: "Finance" },
//     { id: 7, name: "Maria Garcia", email: "maria.garcia@company.com", department: "Operations" },
//   ])

//   // Modal state
//   const [userModalOpen, setUserModalOpen] = useState(false)
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false)
//   const [linkEmployeeModalOpen, setLinkEmployeeModalOpen] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [userToDelete, setUserToDelete] = useState(null)
//   const [userToLink, setUserToLink] = useState(null)
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
//   const [employeeSearchTerm, setEmployeeSearchTerm] = useState("")

//   // Edit modal state and form data
//   const [editModalOpen, setEditModalOpen] = useState(false)
//   const [editFormData, setEditFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//     status: "",
//   })
//   const [editErrors, setEditErrors] = useState({})

//   // Filter and sort users
//   const filteredUsers = useMemo(() => {
//     const filtered = users.filter((user) => {
//       const matchesRole = !roleFilter || user.role === roleFilter
//       const matchesStatus = !statusFilter || user.status === statusFilter
//       return matchesRole && matchesStatus
//     })


//     // Sort users
//     if (sortColumn) {
//       filtered.sort((a, b) => {
//         let aValue, bValue
//         switch (sortColumn) {
//           case "name":
//             aValue = a.name.toLowerCase()
//             bValue = b.name.toLowerCase()
//             break
//           case "role":
//             aValue = a.role.toLowerCase()
//             bValue = b.role.toLowerCase()
//             break
//           case "joinDate":
//             aValue = new Date(a.joinDate)
//             bValue = new Date(b.joinDate)
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
//   }, [users, searchTerm,roleFilter, statusFilter, sortColumn, sortDirection])





//   // Pagination
//   const totalPages = Math.ceil(totalUsers / entriesPerPage)
//   const startIndex = (currentPage - 1) * entriesPerPage
//   const endIndex = startIndex + entriesPerPage
//   const currentUsers = filteredUsers

//   // Helper functions
//   const getLinkedEmployeeName = (linkedEmployeeId) => {
//     if (!linkedEmployeeId) return "Not Linked"
//     const employee = employees.find((emp) => emp.id === linkedEmployeeId)
//     return employee ? employee.name : "Unknown Employee"
//   }

//   const getRoleColor = (role) => {
//     const colors = {
//       admin: "bg-red-100 text-red-800",
//       manager: "bg-purple-100 text-purple-800",
//       hr: "bg-green-100 text-green-800",
//       employee: "bg-blue-100 text-blue-800",
//       staff: "bg-gray-100 text-gray-800",
//     }
//     return colors[role] || "bg-gray-100 text-gray-800"
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
//       setSelectedUsers(currentUsers.map((user) => user.id))
//     } else {
//       setSelectedUsers([])
//     }
//   }

//   const handleSelectUser = (id, checked) => {
//     if (checked) {
//       setSelectedUsers([...selectedUsers, id])
//     } else {
//       setSelectedUsers(selectedUsers.filter((userId) => userId !== id))
//       setSelectAll(false)
//     }
//   }

//   const viewUser = async (id) => {
//     try {
//       const user = await fetchUserById(id)
//       setSelectedUser(user)
//       setUserModalOpen(true)
//     } catch (error) {
//       console.error("Error fetching user:", error)
//     }
//   }

//   const deleteUserHandler = (id) => {
//     const user = users.find((u) => u.id === id)
//     setUserToDelete(user)
//     setDeleteModalOpen(true)
//   }

//   const confirmDelete = () => {
//     if (userToDelete) {
//       deleteUserMutation.mutate(userToDelete.id)
//       setDeleteModalOpen(false)
//       setUserToDelete(null)
//     }
//   }

//   const openLinkEmployeeModal = (user) => {
//     setUserToLink(user)
//     setSelectedEmployeeId("")
//     setEmployeeSearchTerm("")
//     setLinkEmployeeModalOpen(true)
//   }

//   const linkEmployee = () => {
//     if (userToLink && selectedEmployeeId) {
//       updateUserMutation.mutate({
//         id: userToLink.id,
//         userData: {
//           name: userToLink.name,
//           phone: userToLink.phone,
//           status: userToLink.status,
//           linkedEmployeeId: Number.parseInt(selectedEmployeeId),
//         },
//       })
//       setLinkEmployeeModalOpen(false)
//       setUserToLink(null)
//       setSelectedEmployeeId("")
//     }
//   }

//   const unlinkEmployee = (userId) => {
//     const user = users.find((u) => u.id === userId)
//     if (user) {
//       updateUserMutation.mutate({
//         id: userId,
//         userData: {
//           name: user.name,
//           phone: user.phone,
//           status: user.status,
//           linkedEmployeeId: null,
//         },
//       })
//     }
//   }

//   const exportUsers = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       "Name,Email,Phone,Role,Status,Join Date,Linked Employee\n" +
//       filteredUsers
//         .map(
//           (user) =>
//             `"${user.name}","${user.email}","${user.phone}","${user.role}","${user.status}","${user.joinDate}","${getLinkedEmployeeName(user.linkedEmployeeId)}"`,
//         )
//         .join("\n")
//     const encodedUri = encodeURI(csvContent)
//     const link = document.createElement("a")
//     link.setAttribute("href", encodedUri)
//     link.setAttribute("download", "users.csv")
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   // Edit user mutation and form handlers
//   const editUserMutation = useMutation({
//     mutationFn: updateUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["users"])
//       setEditModalOpen(false)
//       setEditFormData({ name: "", email: "", phone: "", role: "", status: "" })
//       setEditErrors({})
//     },
//   })

//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target
//     setEditFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))

//     // Clear error when user starts typing
//     if (editErrors[name]) {
//       setEditErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }))
//     }
//   }

//   const validateEditForm = () => {
//     const newErrors = {}
//     const requiredFields = ["name", "email", "phone", "role", "status"]

//     requiredFields.forEach((field) => {
//       if (!editFormData[field].trim()) {
//         newErrors[field] = "This field is required"
//       }
//     })

//     // Email validation
//     if (editFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
//       newErrors.email = "Invalid email format"
//     }

//     // Phone validation
//     if (editFormData.phone && !/^[0-9]{10}$/.test(editFormData.phone)) {
//       newErrors.phone = "Phone number must be exactly 10 digits"
//     }

//     setEditErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

  // const navigate = useNavigate()
  // const handleAddUser = () => {
  //   navigate("/adduser")
  // }
  

//   const handleEditSubmit = (e) => {
//     e.preventDefault()
//     if (validateEditForm()) {
//       editUserMutation.mutate({
//         id: selectedUser.id,
//         userData: editFormData,
//       })
//     }
//   }

//   const openEditModal = (user) => {
//     setSelectedUser(user)
//     setEditFormData({
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       role: user.role,
//       status: user.status,
//     })
//     setEditErrors({})
//     setEditModalOpen(true)
//   }

//   // Filter employees for linking modal
//   const filteredEmployees = employees.filter(
//     (employee) =>
//       employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
//       employee.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()),
//   )


//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [employees,searchTerm, roleFilter, statusFilter])

//   // Calculate stats
//   const activeUsers = users.filter((user) => user.status === "active").length
//   const usersWithoutEmployeeLink = users.filter((user) => !user.linkedEmployeeId).length
//   const adminCount = users.filter((user) => user.role === "admin").length

//   if (isLoading) {
//     return (
//       <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading users...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//           <p className="text-red-600 text-lg">Error loading users: {error.message}</p>
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
//           {/* Total Users */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Users</p>
//                 <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
//                 <p className="text-sm text-green-600 mt-1">
//                   <span className="font-medium">+3</span> this month
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
//                 <Users className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Active Users */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Active Users</p>
//                 <p className="text-3xl font-bold text-gray-900">{activeUsers}</p>
//                 <p className="text-sm text-green-600 mt-1">
//                   <span className="font-medium">
//                     {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%
//                   </span>{" "}
//                   active rate
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
//                 <CheckCircle className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Users without Employee Link */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Without Employee Link</p>
//                 <p className="text-3xl font-bold text-gray-900">{usersWithoutEmployeeLink}</p>
//                 <p className="text-sm text-orange-600 mt-1">
//                   <span className="font-medium">Need linking</span>
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
//                 <UserX className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Admin Users */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Admin Users</p>
//                 <p className="text-3xl font-bold text-gray-900">{adminCount}</p>
//                 <p className="text-sm text-purple-600 mt-1">
//                   <span className="font-medium">System access</span>
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
//                 <UserCheck className="w-6 h-6 text-white" />
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
//                   placeholder="Search by name, email, role..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//                 <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//               </div>

//               {/* Role Filter */}
//               <select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="">All Roles</option>
//                 <option value="admin">Admin</option>
//                 <option value="manager">Manager</option>
//                 <option value="employee">Employee</option>
//                 <option value="hr">HR</option>
//                 <option value="staff">Staff</option>
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
//                 onClick={exportUsers}
//                 className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
//               >
//                 <Download className="inline-block w-5 h-5 mr-2" />
//                 Export
//               </button>
//               <button
//               onClick={handleAddUser}
               
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
//               >
//                 <Plus className="inline-block w-5 h-5 mr-2" />
//                 Add User
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
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
//                     User
//                   </th>
//                   <th
//                     onClick={() => handleSort("role")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Role
//                   </th>
//                   <th
//                     onClick={() => handleSort("status")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Linked Employee
//                   </th>
//                   <th
//                     onClick={() => handleSort("joinDate")}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   >
//                     Join Date
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
//                     <td className="px-4 py-4">
//                       <input
//                         type="checkbox"
//                         checked={selectedUsers.includes(user.id)}
//                         onChange={(e) => handleSelectUser(user.id, e.target.checked)}
//                         className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0">
//                           <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
//                             <span className="text-white font-medium text-sm">
//                               {user.name
//                                 .split(" ")
//                                 .map((n) => n[0])
//                                 .join("")}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                           <div className="text-sm text-gray-500">{user.email}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
//                       >
//                         {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-900">
//                       <div className="flex items-center">
//                         <span className={user.linkedEmployeeId ? "text-gray-900" : "text-gray-400"}>
//                           {getLinkedEmployeeName(user.linkedEmployeeId)}
//                         </span>
//                         {user.linkedEmployeeId && (
//                           <button
//                             onClick={() => unlinkEmployee(user.id)}
//                             className="ml-2 text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                             title="Unlink Employee"
//                           >
//                             <X className="w-3 h-3" />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-500">
//                       {new Date(user.joinDate).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </td>
//                     <td className="px-4 py-4 text-sm font-medium">
//                       <div className="flex items-center space-x-2 flex-wrap">
//                         <button
//                           onClick={() => viewUser(user.id)}
//                           className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         {!user.linkedEmployeeId && (
//                           <button
//                             onClick={() => openLinkEmployeeModal(user)}
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                             title="Link Employee"
//                           >
//                             <Link className="w-4 h-4" />
//                           </button>
//                         )}
//                         <button
//                           onClick={() => openEditModal(user)}
//                           className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
//                           title="Edit"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => deleteUserHandler(user.id)}
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
//                 Showing <span>{startIndex + 1}</span> to <span>{Math.min(endIndex, totalUsers)}</span> of{" "}
//                 <span>{totalUsers}</span> entries
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

//       {/* User Details Modal */}
//       {userModalOpen && selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
//                   <button onClick={() => setUserModalOpen(false)} className="text-gray-400 hover:text-gray-600">
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
//                         <p className="text-gray-900">{selectedUser.name}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Email</label>
//                         <p className="text-gray-900">{selectedUser.email}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Phone</label>
//                         <p className="text-gray-900">{selectedUser.phone}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Information</h4>
//                     <div className="space-y-3">
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Role</label>
//                         <p className="text-gray-900">
//                           {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Join Date</label>
//                         <p className="text-gray-900">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Status</label>
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             selectedUser.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
//                         </span>
//                       </div>
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Linked Employee</label>
//                         <p className="text-gray-900">{getLinkedEmployeeName(selectedUser.linkedEmployeeId)}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
//                     Edit User
//                   </button>
//                   <button
//                     onClick={() => setUserModalOpen(false)}
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

//       {/* Link Employee Modal */}
//       {linkEmployeeModalOpen && userToLink && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold text-gray-900">Link Employee</h3>
//                   <button onClick={() => setLinkEmployeeModalOpen(false)} className="text-gray-400 hover:text-gray-600">
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <p className="text-gray-700 mb-4">
//                   Link <span className="font-semibold">{userToLink.name}</span> to an existing employee:
//                 </p>

//                 {/* Employee Search */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Search Employee</label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="Search by name or email..."
//                       value={employeeSearchTerm}
//                       onChange={(e) => setEmployeeSearchTerm(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     />
//                     <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                   </div>
//                 </div>

//                 {/* Employee Selection */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
//                   <select
//                     value={selectedEmployeeId}
//                     onChange={(e) => setSelectedEmployeeId(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   >
//                     <option value="">Choose an employee...</option>
//                     {filteredEmployees.map((employee) => (
//                       <option key={employee.id} value={employee.id}>
//                         {employee.name} - {employee.department}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex justify-end space-x-3">
//                   <button
//                     onClick={() => setLinkEmployeeModalOpen(false)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={linkEmployee}
//                     disabled={!selectedEmployeeId}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Link Employee
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModalOpen && userToDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
//               <div className="p-6">
//                 <div className="flex items-center mb-4">
//                   <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
//                     <AlertTriangle className="w-6 h-6 text-red-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
//                     <p className="text-sm text-gray-500">This action cannot be undone.</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 mb-6">
//                   Are you sure you want to delete <span className="font-semibold">{userToDelete.name}</span>? This will
//                   permanently remove their account from the system.
//                 </p>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     onClick={() => setDeleteModalOpen(false)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmDelete}
//                     disabled={deleteUserMutation.isLoading}
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
//                   >
//                     {deleteUserMutation.isLoading ? "Deleting..." : "Delete"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit User Modal */}
//       {editModalOpen && selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-semibold text-gray-900">Edit User</h3>
//                   <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>
//               <form onSubmit={handleEditSubmit} className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Name */}
//                   <div>
//                     <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-2">
//                       Full Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       id="editName"
//                       name="name"
//                       value={editFormData.name}
//                       onChange={handleEditInputChange}
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                         editErrors.name ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="Enter user name"
//                     />
//                     {editErrors.name && <p className="mt-1 text-sm text-red-600">{editErrors.name}</p>}
//                   </div>

//                   {/* Email */}
//                   <div>
//                     <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       id="editEmail"
//                       name="email"
//                       value={editFormData.email}
//                       onChange={handleEditInputChange}
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                         editErrors.email ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="user@example.com"
//                     />
//                     {editErrors.email && <p className="mt-1 text-sm text-red-600">{editErrors.email}</p>}
//                   </div>

//                   {/* Phone */}
//                   <div>
//                     <label htmlFor="editPhone" className="block text-sm font-medium text-gray-700 mb-2">
//                       Phone Number <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="tel"
//                       id="editPhone"
//                       name="phone"
//                       value={editFormData.phone}
//                       onChange={(e) => {
//                         const value = e.target.value.replace(/\D/g, "").slice(0, 10)
//                         setEditFormData((prev) => ({ ...prev, phone: value }))
//                       }}
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                         editErrors.phone ? "border-red-500" : "border-gray-300"
//                       }`}
//                       placeholder="10-digit phone number"
//                     />
//                     {editErrors.phone && <p className="mt-1 text-sm text-red-600">{editErrors.phone}</p>}
//                   </div>

//                   {/* Role */}
//                   <div>
//                     <label htmlFor="editRole" className="block text-sm font-medium text-gray-700 mb-2">
//                       Role <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       id="editRole"
//                       name="role"
//                       value={editFormData.role}
//                       onChange={handleEditInputChange}
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                         editErrors.role ? "border-red-500" : "border-gray-300"
//                       }`}
//                     >
//                       <option value="">Select role</option>
//                       <option value="admin">Admin</option>
//                       <option value="manager">Manager</option>
//                       <option value="employee">Employee</option>
//                       <option value="hr">HR</option>
//                       <option value="staff">Staff</option>
//                     </select>
//                     {editErrors.role && <p className="mt-1 text-sm text-red-600">{editErrors.role}</p>}
//                   </div>

//                   {/* Status */}
//                   <div className="md:col-span-2">
//                     <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700 mb-2">
//                       Status <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       id="editStatus"
//                       name="status"
//                       value={editFormData.status}
//                       onChange={handleEditInputChange}
//                       className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
//                         editErrors.status ? "border-red-500" : "border-gray-300"
//                       }`}
//                     >
//                       <option value="">Select status</option>
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                     </select>
//                     {editErrors.status && <p className="mt-1 text-sm text-red-600">{editErrors.status}</p>}
//                   </div>
//                 </div>

//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => setEditModalOpen(false)}
//                     className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={editUserMutation.isLoading}
//                     className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center"
//                   >
//                     {editUserMutation.isLoading ? "Updating..." : "Update User"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
 









import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Users,
  CheckCircle,
  UserCheck,
  Plus,
  Download,
  Eye,
  Trash2,
  X,
  AlertTriangle,
  UserX,
  Edit,
  Link,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function UserList() {
  const API_BASE_URL = "https://crmapi.technfest.com"

  // Table state
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")

  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [userModalOpen, setUserModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  })
  const [editLoading, setEditLoading] = useState(false)

  // Fetch from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError("")
        const token = sessionStorage.getItem("token") // if auth required
        const params = new URLSearchParams({
          limit: entriesPerPage,
          page: currentPage,
          q: searchTerm,
        })
        const res = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
          method: "GET",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()
        if (data.success) {
          setUsers(
            data.rows.map((u) => ({
              ...u,
              joinDate: u.created_at,
              linkedEmployeeId: null,
            })),
          )
          setTotal(data.total)
          setPages(data.pages)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [currentPage, entriesPerPage, searchTerm])

  // Client-side filters/sorting
  const filteredUsers = useMemo(() => {
    let list = [...users]
    if (roleFilter) list = list.filter((u) => u.role === roleFilter)
    if (statusFilter) list = list.filter((u) => u.status === statusFilter)
    if (sortColumn) {
      list.sort((a, b) => {
        let aValue = a[sortColumn]
        let bValue = b[sortColumn]
        if (sortColumn === "name" || sortColumn === "role" || sortColumn === "status") {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }
        if (sortColumn === "joinDate") {
          aValue = new Date(aValue)
          bValue = new Date(bValue)
        }
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }
    return list
  }, [users, roleFilter, statusFilter, sortColumn, sortDirection])

  // Stats
  const totalUsers = total
  const activeUsers = filteredUsers.filter((u) => u.status === "active").length
  const usersWithoutEmployeeLink = filteredUsers.filter((u) => !u.linkedEmployeeId).length
  const adminCount = filteredUsers.filter((u) => u.role === "admin").length

  // Helpers
  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-purple-100 text-purple-800",
      hr: "bg-green-100 text-green-800",
      employee: "bg-blue-100 text-blue-800",
      staff: "bg-gray-100 text-gray-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(col)
      setSortDirection("asc")
    }
  }

  const viewUser = (id) => {
    const user = users.find((u) => u.id === id)
    setSelectedUser(user)
    setUserModalOpen(true)
  }

  const editUser = (id) => {
    const user = users.find((u) => u.id === id)
    setSelectedUser(user)
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "",
      status: user.status || "",
    })
    setEditModalOpen(true)
  }

  const linkEmployee = (id) => {
    const user = users.find((u) => u.id === id)
    console.log("Link employee for user:", user)
    // Add link employee functionality here
  }

  const deleteUser = (id) => {
    const user = users.find((u) => u.id === id)
    setUserToDelete(user)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id))
      setDeleteModalOpen(false)
    }
  }

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!selectedUser) return

    try {
      setEditLoading(true)
      const token = sessionStorage.getItem("token")

      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(editFormData),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      const updatedUser = await response.json()

      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...editFormData } : user)),
      )

      setEditModalOpen(false)
      alert("User updated successfully!")
    } catch (err) {
      alert(`Error updating user: ${err.message}`)
    } finally {
      setEditLoading(false)
    }
  }

  const navigate = useNavigate()
  const handleAddUser = () => {
    navigate("/adduser")
  }
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6 ml-4 mr-4">
        {/* Page Title */}
        <div className="">
          {/* <h1 className="text-3xl font-bold text-gray-900">User Management</h1> */}
          {/* <p className="text-gray-600 mt-2">Manage your users and their information</p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
          {/* Total Users */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+12</span> this month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{activeUsers}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">89%</span> active rate
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Users Without Link */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Without Link</p>
                <p className="text-3xl font-bold text-gray-900">{usersWithoutEmployeeLink}</p>
                <p className="text-sm text-orange-600 mt-1">
                  <span className="font-medium">Need linking</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Admin Count */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-3xl font-bold text-gray-900">{adminCount}</p>
                <p className="text-sm text-purple-600 mt-1">
                  <span className="font-medium">System access</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="staff">Staff</option>
              </select>

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
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => console.log("Export users")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Export
              </button>
              <button
                onClick={handleAddUser}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="inline-block w-5 h-5 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
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

          {/* Table */}
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th
                      onClick={() => handleSort("name")}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      User
                    </th>
                    <th
                      onClick={() => handleSort("role")}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      Role
                    </th>
                    <th
                      onClick={() => handleSort("status")}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Linked Employee
                    </th>
                    <th
                      onClick={() => handleSort("joinDate")}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      Join Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                        >
                          {user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status?.charAt(0)?.toUpperCase() + user.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className={user.linkedEmployeeId ? "text-gray-900" : "text-gray-400"}>
                            {user.linkedEmployeeId ? "Linked" : "Not Linked"}
                          </span>
                          {user.linkedEmployeeId && (
                            <button
                              onClick={() => console.log("Unlink employee")}
                              className="ml-2 text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Unlink Employee"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(user.joinDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <button
                            onClick={() => viewUser(user.id)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!user.linkedEmployeeId && (
                            <button
                              onClick={() => linkEmployee(user.id)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Link Employee"
                            >
                              <Link className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => editUser(user.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
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
          )}

          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, total)} of{" "}
                {total} results
              </div>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-sm text-gray-700">
                  Page {currentPage} of {pages}
                </span>
                <button
                  disabled={currentPage === pages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {userModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setUserModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedUser.phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-gray-900">{selectedUser.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p className="text-gray-900">{selectedUser.status}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Join Date</label>
                      <p className="text-gray-900">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete User</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete {userToDelete.name}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Edit User</h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="edit-phone"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-role"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-status"
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? "Updating..." : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

