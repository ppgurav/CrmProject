import { useState, useMemo } from "react"
import { z } from "zod"
import {
  Search,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Download,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  X,
  Plus,
  Paperclip,
  Send,
  FileText,
  Copy,
  Printer,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react"

// Zod schemas
const ticketSchema = z.object({
  id: z.number(),
  ticketNo: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  type: z.enum(["Technical", "Billing", "General", "Account"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["open", "in-progress", "resolved", "closed"]),
  assignedTo: z.string().optional(),
  subject: z.string(),
  description: z.string(),
  lastUpdated: z.string(),
  createdAt: z.string(),
  responses: z.array(
    z.object({
      author: z.string(),
      message: z.string(),
      timestamp: z.string(),
    }),
  ),
})

const responseSchema = z.object({
  message: z.string().min(1, "Response message is required"),
})

const replySchema = z.object({
  message: z.string().min(1, "Message is required"),
  sendEmail: z.boolean(),
  sendWhatsApp: z.boolean(),
})

const internalNoteSchema = z.object({
  note: z.string().min(1, "Note is required"),
})

const ticketUpdateSchema = z.object({
  status: z.enum(["open", "in-progress", "resolved", "closed"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignedTo: z.string(),
  transferTo: z.string().optional(),
})

export default function SupportTickets() {
  // Sample ticket data
  const [tickets, setTickets] = useState([
    {
      id: 1,
      ticketNo: "TCK-0001",
      customerName: "Ravi Shah",
      customerEmail: "ravi.shah@example.com",
      type: "Technical",
      priority: "high",
      status: "open",
      assignedTo: "Ankita",
      subject: "Website loading issues",
      description:
        "The website is loading very slowly and sometimes not loading at all. This is affecting our business operations.",
      lastUpdated: "2024-01-08T12:30:00Z",
      createdAt: "2024-01-08T10:15:00Z",
      responses: [
        {
          author: "Ankita",
          message: "Thank you for reporting this issue. I'm looking into it now.",
          timestamp: "2024-01-08T12:30:00Z",
        },
      ],
      conversation: [
        {
          id: 1,
          type: "customer",
          author: "Ravi Shah",
          initials: "RS",
          timestamp: "Jan 8, 2024 10:15 AM",
          message:
            "I can't access my website panel. The website is loading very slowly and sometimes not loading at all. This is affecting our business operations. Can you please help me resolve this issue?",
          attachments: [{ name: "screenshot-error.png", size: "245 KB" }],
        },
        {
          id: 2,
          type: "admin",
          author: "Ankita (Support)",
          initials: "A",
          timestamp: "Jan 8, 2024 12:30 PM",
          message:
            "Thank you for reporting this issue, Ravi. I'm looking into it now. I can see from your screenshot that you're experiencing timeout errors. Let me check your server status and get back to you shortly.",
        },
        {
          id: 3,
          type: "internal",
          timestamp: "Jan 8, 2024 12:35 PM",
          message:
            "Checked server logs - found high CPU usage. Contacted hosting provider. Issue should be resolved within 2 hours.",
        },
      ],
    },
    {
      id: 2,
      ticketNo: "TCK-0002",
      customerName: "Priya Sharma",
      customerEmail: "priya.sharma@example.com",
      type: "Billing",
      priority: "medium",
      status: "in-progress",
      assignedTo: "Rahul",
      subject: "Invoice discrepancy",
      description:
        "There seems to be an error in my latest invoice. The amount charged is different from what was quoted.",
      lastUpdated: "2024-01-08T11:45:00Z",
      createdAt: "2024-01-07T14:20:00Z",
      responses: [
        {
          author: "Rahul",
          message: "I've reviewed your invoice and found the discrepancy. Working on a correction now.",
          timestamp: "2024-01-08T11:45:00Z",
        },
      ],
      conversation: [
        {
          id: 1,
          type: "customer",
          author: "Priya Sharma",
          initials: "PS",
          timestamp: "Jan 7, 2024 2:20 PM",
          message:
            "There seems to be an error in my latest invoice. The amount charged is different from what was quoted.",
        },
        {
          id: 2,
          type: "admin",
          author: "Rahul (Support)",
          initials: "R",
          timestamp: "Jan 8, 2024 11:45 AM",
          message: "I've reviewed your invoice and found the discrepancy. Working on a correction now.",
        },
      ],
    },
    {
      id: 3,
      ticketNo: "TCK-0003",
      customerName: "Amit Kumar",
      customerEmail: "amit.kumar@example.com",
      type: "General",
      priority: "low",
      status: "resolved",
      assignedTo: "Priya",
      subject: "Feature request",
      description: "Would like to request a new feature for the dashboard to export data in Excel format.",
      lastUpdated: "2024-01-07T16:20:00Z",
      createdAt: "2024-01-06T09:30:00Z",
      responses: [
        {
          author: "Priya",
          message: "Thank you for the suggestion. This feature has been added to our development roadmap.",
          timestamp: "2024-01-07T16:20:00Z",
        },
      ],
      conversation: [
        {
          id: 1,
          type: "customer",
          author: "Amit Kumar",
          initials: "AK",
          timestamp: "Jan 6, 2024 9:30 AM",
          message: "Would like to request a new feature for the dashboard to export data in Excel format.",
        },
        {
          id: 2,
          type: "admin",
          author: "Priya (Support)",
          initials: "P",
          timestamp: "Jan 7, 2024 4:20 PM",
          message: "Thank you for the suggestion. This feature has been added to our development roadmap.",
        },
      ],
    },
    {
      id: 4,
      ticketNo: "TCK-0004",
      customerName: "Sneha Patel",
      customerEmail: "sneha.patel@example.com",
      type: "Technical",
      priority: "urgent",
      status: "open",
      assignedTo: "Ankita",
      subject: "System crash",
      description: "The entire system crashed and we cannot access any data. This is critical for our operations.",
      lastUpdated: "2024-01-08T13:15:00Z",
      createdAt: "2024-01-08T13:00:00Z",
      responses: [],
      conversation: [
        {
          id: 1,
          type: "customer",
          author: "Sneha Patel",
          initials: "SP",
          timestamp: "Jan 8, 2024 1:00 PM",
          message: "The entire system crashed and we cannot access any data. This is critical for our operations.",
        },
      ],
    },
    {
      id: 5,
      ticketNo: "TCK-0005",
      customerName: "Rajesh Gupta",
      customerEmail: "rajesh.gupta@example.com",
      type: "Account",
      priority: "medium",
      status: "closed",
      assignedTo: "Rahul",
      subject: "Password reset request",
      description: "Unable to reset password using the forgot password feature. Need assistance with account access.",
      lastUpdated: "2024-01-07T10:30:00Z",
      createdAt: "2024-01-06T15:45:00Z",
      responses: [
        {
          author: "Rahul",
          message: "Password has been reset successfully. New credentials sent via email.",
          timestamp: "2024-01-07T10:30:00Z",
        },
      ],
      conversation: [
        {
          id: 1,
          type: "customer",
          author: "Rajesh Gupta",
          initials: "RG",
          timestamp: "Jan 6, 2024 3:45 PM",
          message: "Unable to reset password using the forgot password feature. Need assistance with account access.",
        },
        {
          id: 2,
          type: "admin",
          author: "Rahul (Support)",
          initials: "R",
          timestamp: "Jan 7, 2024 10:30 AM",
          message: "Password has been reset successfully. New credentials sent via email.",
        },
      ],
    },
  ])

  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [assignedFilter, setAssignedFilter] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(25)
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedTickets, setSelectedTickets] = useState(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Ticket details view state
  const [viewMode, setViewMode] = useState("list") // "list" or "details"
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyForm, setReplyForm] = useState({
    message: "",
    sendEmail: true,
    sendWhatsApp: false,
  })
  const [showInternalNoteModal, setShowInternalNoteModal] = useState(false)
  const [internalNote, setInternalNote] = useState("")
  const [errors, setErrors] = useState({})

  // Filter and search tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        !searchTerm ||
        ticket.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !statusFilter || ticket.status === statusFilter
      const matchesPriority = !priorityFilter || ticket.priority === priorityFilter
      const matchesAssigned =
        !assignedFilter ||
        (assignedFilter === "unassigned" ? !ticket.assignedTo : ticket.assignedTo?.toLowerCase() === assignedFilter)

      let matchesDate = true
      if (dateRange) {
        const ticketDate = new Date(ticket.createdAt)
        const now = new Date()
        switch (dateRange) {
          case "today":
            matchesDate = ticketDate.toDateString() === now.toDateString()
            break
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            matchesDate = ticketDate >= weekAgo
            break
          case "month":
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
            matchesDate = ticketDate >= monthAgo
            break
        }
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesAssigned && matchesDate
    })
  }, [tickets, searchTerm, statusFilter, priorityFilter, assignedFilter, dateRange])

  // Sort tickets
  const sortedTickets = useMemo(() => {
    if (!sortColumn) return filteredTickets

    return [...filteredTickets].sort((a, b) => {
      let aValue = a[sortColumn]
      let bValue = b[sortColumn]

      if (sortColumn === "lastUpdated" || sortColumn === "createdAt") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      } else {
        aValue = aValue ? aValue.toString().toLowerCase() : ""
        bValue = bValue ? bValue.toString().toLowerCase() : ""
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredTickets, sortColumn, sortDirection])

  // Paginated tickets
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage
    return sortedTickets.slice(startIndex, startIndex + entriesPerPage)
  }, [sortedTickets, currentPage, entriesPerPage])

  // Calculate stats
  const stats = useMemo(() => {
    const totalTickets = tickets.length
    const openTickets = tickets.filter((t) => t.status === "open").length
    const resolvedToday = tickets.filter((t) => {
      const today = new Date().toDateString()
      return t.status === "resolved" && new Date(t.lastUpdated).toDateString() === today
    }).length

    return {
      total: totalTickets,
      open: openTickets,
      resolvedToday,
      avgResponseTime: "2.4h",
    }
  }, [tickets])

  // Utility functions
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-red-100 text-red-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getTypeColor = (type) => {
    const colors = {
      Technical: "bg-purple-100 text-purple-800",
      Billing: "bg-green-100 text-green-800",
      General: "bg-blue-100 text-blue-800",
      Account: "bg-indigo-100 text-indigo-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  // Event handlers
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTickets(new Set(paginatedTickets.map((t) => t.id)))
    } else {
      setSelectedTickets(new Set())
    }
  }

  const handleSelectTicket = (ticketId, checked) => {
    const newSelected = new Set(selectedTickets)
    if (checked) {
      newSelected.add(ticketId)
    } else {
      newSelected.delete(ticketId)
    }
    setSelectedTickets(newSelected)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("")
    setPriorityFilter("")
    setAssignedFilter("")
    setDateRange("")
    setCurrentPage(1)
  }

  const viewTicket = (ticket) => {
    setSelectedTicket(ticket)
    setViewMode("details")
  }

  const backToList = () => {
    setViewMode("list")
    setSelectedTicket(null)
    setReplyForm({ message: "", sendEmail: true, sendWhatsApp: false })
    setErrors({})
  }

  const exportTickets = () => {
    const headers = [
      "Ticket No",
      "Customer Name",
      "Email",
      "Type",
      "Priority",
      "Status",
      "Assigned To",
      "Subject",
      "Created At",
      "Last Updated",
    ]

    const csvRows = [headers.join(",")]

    filteredTickets.forEach((ticket) => {
      const row = [
        `"${ticket.ticketNo}"`,
        `"${ticket.customerName}"`,
        `"${ticket.customerEmail}"`,
        `"${ticket.type}"`,
        `"${ticket.priority}"`,
        `"${ticket.status}"`,
        `"${ticket.assignedTo || "Unassigned"}"`,
        `"${ticket.subject}"`,
        `"${new Date(ticket.createdAt).toLocaleDateString()}"`,
        `"${new Date(ticket.lastUpdated).toLocaleDateString()}"`,
      ]
      csvRows.push(row.join(","))
    })

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "support-tickets.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const bulkAssign = () => {
    const assignTo = prompt("Assign to (Ankita, Rahul, Priya):")
    if (!assignTo) return

    setTickets((prev) =>
      prev.map((ticket) =>
        selectedTickets.has(ticket.id)
          ? { ...ticket, assignedTo: assignTo, lastUpdated: new Date().toISOString() }
          : ticket,
      ),
    )
    setSelectedTickets(new Set())
    setShowBulkActions(false)
    alert(`${selectedTickets.size} tickets assigned to ${assignTo}`)
  }

  const bulkClose = () => {
    if (!confirm(`Are you sure you want to close ${selectedTickets.size} tickets?`)) return

    setTickets((prev) =>
      prev.map((ticket) =>
        selectedTickets.has(ticket.id)
          ? { ...ticket, status: "closed", lastUpdated: new Date().toISOString() }
          : ticket,
      ),
    )
    setSelectedTickets(new Set())
    setShowBulkActions(false)
    alert(`${selectedTickets.size} tickets marked as closed`)
  }

  const bulkPriority = () => {
    const priority = prompt("Set priority (low, medium, high, urgent):")
    if (!priority || !["low", "medium", "high", "urgent"].includes(priority.toLowerCase())) return

    setTickets((prev) =>
      prev.map((ticket) =>
        selectedTickets.has(ticket.id)
          ? { ...ticket, priority: priority.toLowerCase(), lastUpdated: new Date().toISOString() }
          : ticket,
      ),
    )
    setSelectedTickets(new Set())
    setShowBulkActions(false)
    alert(`${selectedTickets.size} tickets priority updated to ${priority}`)
  }

  // Ticket details handlers
  const handleReplySubmit = (e) => {
    e.preventDefault()
    try {
      const validatedData = replySchema.parse(replyForm)
      const newReply = {
        id: selectedTicket.conversation.length + 1,
        type: "admin",
        author: "John Doe (Admin)",
        initials: "JD",
        timestamp: "Just now",
        message: validatedData.message,
      }

      const updatedTicket = {
        ...selectedTicket,
        conversation: [...selectedTicket.conversation, newReply],
        lastUpdated: new Date().toISOString(),
      }

      setSelectedTicket(updatedTicket)
      setTickets((prev) => prev.map((ticket) => (ticket.id === selectedTicket.id ? updatedTicket : ticket)))

      setReplyForm({ message: "", sendEmail: true, sendWhatsApp: false })
      setErrors({})
      alert("Reply sent successfully!")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      }
    }
  }

  const handleInternalNoteSubmit = (e) => {
    e.preventDefault()
    try {
      const validatedData = internalNoteSchema.parse({ note: internalNote })
      const newNote = {
        id: selectedTicket.conversation.length + 1,
        type: "internal",
        timestamp: "Just now",
        message: validatedData.note,
      }

      const updatedTicket = {
        ...selectedTicket,
        conversation: [...selectedTicket.conversation, newNote],
        lastUpdated: new Date().toISOString(),
      }

      setSelectedTicket(updatedTicket)
      setTickets((prev) => prev.map((ticket) => (ticket.id === selectedTicket.id ? updatedTicket : ticket)))

      setInternalNote("")
      setShowInternalNoteModal(false)
      setErrors({})
      alert("Internal note added successfully!")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      }
    }
  }

  const handleTicketUpdate = () => {
    try {
      const updateData = {
        status: selectedTicket.status,
        priority: selectedTicket.priority,
        assignedTo: selectedTicket.assignedTo,
      }
      ticketUpdateSchema.parse(updateData)

      const updatedTicket = {
        ...selectedTicket,
        lastUpdated: new Date().toISOString(),
      }

      setTickets((prev) => prev.map((ticket) => (ticket.id === selectedTicket.id ? updatedTicket : ticket)))
      setSelectedTicket(updatedTicket)
      alert("Ticket updated successfully!")
    } catch (error) {
      alert("Error updating ticket")
    }
  }

  // Pagination
  const totalPages = Math.ceil(sortedTickets.length / entriesPerPage)
  const startIndex = sortedTickets.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1
  const endIndex = Math.min(currentPage * entriesPerPage, sortedTickets.length)

  // Render ticket details view
  if (viewMode === "details" && selectedTicket) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
        <div className="max-w-full mx-auto p-6">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={backToList}
              className="flex items-center px-4 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Tickets
            </button>
            <div>
                        {/* <span className="text-gray-600 text-center">Ticket No:</span> */}
                        <p className="font-semibold text-gray-900 text-center">Ticket # {selectedTicket.ticketNo}</p>
                      </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Ticket Header */}
              <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-8 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h1 className="text-2xl font-bold text-gray-900">{selectedTicket.subject}</h1>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}
                        >
                          {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                        </span>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}
                        >
                          {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">Ticket No:</span>
                        <p className="font-semibold text-gray-900">{selectedTicket.ticketNo}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <p className="font-semibold text-gray-900">
                          {new Date(selectedTicket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Updated:</span>
                        <p className="font-semibold text-gray-900">{formatDateTime(selectedTicket.lastUpdated)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info Card */}
                  <div className="bg-gray-50 rounded-xl p-6 min-w-[300px]">
                    <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {getInitials(selectedTicket.customerName)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedTicket.customerName}</p>
                          <p className="text-sm text-gray-600">{selectedTicket.customerEmail}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="text-gray-900">+91 98765 43210</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Customer ID:</span>
                            <span className="text-gray-900">CUST-{selectedTicket.id.toString().padStart(3, "0")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation Thread */}
              <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
                </div>
                <div className="p-6 space-y-6">
                  {selectedTicket.conversation?.map((message) => {
                    if (message.type === "internal") {
                      return (
                        <div key={message.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                          <div className="flex items-center mb-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                            <span className="text-sm font-medium text-yellow-800">Internal Note</span>
                            <span className="text-xs text-yellow-600 ml-auto">{message.timestamp}</span>
                          </div>
                          <p className="text-sm text-yellow-700">{message.message}</p>
                        </div>
                      )
                    }

                    if (message.type === "customer") {
                      return (
                        <div key={message.id} className="flex space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {message.initials}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 max-w-2xl">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">{message.author}</span>
                                <span className="text-xs text-gray-500">{message.timestamp}</span>
                              </div>
                              <p className="text-gray-700">{message.message}</p>
                              {message.attachments && (
                                <div className="mt-3 space-y-2">
                                  {message.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                      <Paperclip className="w-4 h-4 text-gray-400" />
                                      <a href="#" className="text-indigo-600 hover:text-indigo-800">
                                        {attachment.name}
                                      </a>
                                      <span className="text-gray-500">({attachment.size})</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    }

                    if (message.type === "admin") {
                      return (
                        <div key={message.id} className="flex space-x-4 justify-end">
                          <div className="flex-1 flex justify-end">
                            <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm p-4 max-w-2xl">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{message.author}</span>
                                <span className="text-xs text-indigo-200">{message.timestamp}</span>
                              </div>
                              <p>{message.message}</p>
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {message.initials}
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>

              {/* Reply Box */}
              <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Reply to Customer</h3>
                </div>
                <div className="p-6">
                  <form onSubmit={handleReplySubmit} className="space-y-4">
                    <div>
                      <textarea
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        placeholder="Type your response here..."
                        value={replyForm.message}
                        onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })}
                      />
                      {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>

                    {/* File Upload */}
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="file" multiple className="hidden" />
                        <Paperclip className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Attach files</span>
                      </label>
                    </div>

                    {/* Reply Options */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                            checked={replyForm.sendEmail}
                            onChange={(e) => setReplyForm({ ...replyForm, sendEmail: e.target.checked })}
                          />
                          <span className="text-sm text-gray-700">Send via Email</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                            checked={replyForm.sendWhatsApp}
                            onChange={(e) => setReplyForm({ ...replyForm, sendWhatsApp: e.target.checked })}
                          />
                          <span className="text-sm text-gray-700">Send via WhatsApp</span>
                        </label>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowInternalNoteModal(true)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          Add Internal Note
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                        >
                          <Send className="w-4 h-4 inline mr-2" />
                          Send Reply
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Admin Controls */}
              <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Controls</h3>
                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={selectedTicket.status}
                      onChange={(e) => setSelectedTicket({ ...selectedTicket, status: e.target.value })}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={selectedTicket.priority}
                      onChange={(e) => setSelectedTicket({ ...selectedTicket, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={selectedTicket.assignedTo || ""}
                      onChange={(e) => setSelectedTicket({ ...selectedTicket, assignedTo: e.target.value })}
                    >
                      <option value="">Unassigned</option>
                      <option value="Ankita">Ankita</option>
                      <option value="Rahul">Rahul</option>
                      <option value="Priya">Priya</option>
                      <option value="Arjun">Arjun</option>
                    </select>
                  </div>

                  {/* Transfer to Staff */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transfer to</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="">Select staff member</option>
                      <option value="ankita">Ankita - Technical</option>
                      <option value="rahul">Rahul - Billing</option>
                      <option value="priya">Priya - General</option>
                      <option value="arjun">Arjun - Account Manager</option>
                    </select>
                  </div>

                  <button
                    onClick={handleTicketUpdate}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    Update Ticket
                  </button>
                </div>
              </div>

              {/* Ticket Information */}
              <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900">{selectedTicket.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium text-gray-900">{formatDateTime(selectedTicket.lastUpdated)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-medium text-green-600">2h 15m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolution Time:</span>
                    <span className="font-medium text-gray-400">Pending</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() =>
                      alert("Ticket logs feature would show audit trail of all changes made to this ticket.")
                    }
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm"
                  >
                    <FileText className="inline-block w-4 h-4 mr-2" />
                    View Ticket Logs
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to escalate this ticket to management?")) {
                        alert("Ticket escalated successfully! Management has been notified.")
                      }
                    }}
                    className="w-full px-4 py-2 border border-orange-300 text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 text-sm"
                  >
                    <Zap className="inline-block w-4 h-4 mr-2" />
                    Escalate Ticket
                  </button>
                  <button
                    onClick={() => {
                      const ticketId = prompt("Enter the ticket ID to merge with:")
                      if (ticketId) {
                        alert(`Ticket will be merged with ${ticketId}. This action cannot be undone.`)
                      }
                    }}
                    className="w-full px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm"
                  >
                    <Copy className="inline-block w-4 h-4 mr-2" />
                    Merge with Another
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm"
                  >
                    <Printer className="inline-block w-4 h-4 mr-2" />
                    Print Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Internal Note Modal */}
        {showInternalNoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Add Internal Note</h3>
                  <button onClick={() => setShowInternalNoteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handleInternalNoteSubmit}>
                  <div className="mb-4">
                    <label htmlFor="internalNoteText" className="block text-sm font-medium text-gray-700 mb-2">
                      Note
                    </label>
                    <textarea
                      id="internalNoteText"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Add your internal note here..."
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                    />
                    {errors.note && <p className="text-red-500 text-sm mt-1">{errors.note}</p>}
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowInternalNoteModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add Note
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

  // Render main tickets list view
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-blue-600 mt-1">
                <span className="font-medium">+12</span> this month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-3xl font-bold text-gray-900">{stats.open}</p>
              <p className="text-sm text-orange-600 mt-1">
                <span className="font-medium">8</span> high priority
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.resolvedToday}</p>
              <p className="text-sm text-green-600 mt-1">
                <span className="font-medium">+6</span> from yesterday
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgResponseTime}</p>
              <p className="text-sm text-green-600 mt-1">
                <span className="font-medium">-0.3h</span> improvement
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
          />
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Staff</option>
                <option value="ankita">Ankita</option>
                <option value="rahul">Rahul</option>
                <option value="priya">Priya</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                disabled={selectedTickets.size === 0}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Settings className="inline-block w-4 h-4 mr-2" />
                Bulk Actions
              </button>
              {showBulkActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl shadow-indigo-500/10 border border-gray-100 z-50">
                  <div className="py-2">
                    <button
                      onClick={bulkAssign}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Assign to Staff
                    </button>
                    <button
                      onClick={bulkClose}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mark as Closed
                    </button>
                    <button
                      onClick={bulkPriority}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Change Priority
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={exportTickets}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              <Download className="inline-block w-4 h-4 mr-2" />
              Export CSV
            </button>

            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                {sortedTickets.length} tickets
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Show:</label>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number.parseInt(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTickets.size === paginatedTickets.length && paginatedTickets.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("ticketNo")}
                >
                  Ticket No
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("customerName")}
                >
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("priority")}
                >
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("lastUpdated")}
                >
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No tickets found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTickets.has(ticket.id)}
                        onChange={(e) => handleSelectTicket(ticket.id, e.target.checked)}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ticket.ticketNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                          {getInitials(ticket.customerName)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{ticket.customerName}</div>
                          <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(ticket.type)}`}>
                        {ticket.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)} capitalize`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)} capitalize`}
                      >
                        {ticket.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.assignedTo || <span className="text-gray-400">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(ticket.lastUpdated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewTicket(ticket)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex} to {endIndex} of {sortedTickets.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages, currentPage - 2 + i))
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border rounded-lg text-sm ${
                        pageNum === currentPage
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
