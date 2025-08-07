import { useState, useEffect } from "react"
import { z } from "zod"
import { AlertCircle, Clock, CheckCircle, XCircle, User, Mail, Calendar, Tag } from "lucide-react"

// Zod schema for ticket validation
const TicketSchema = z.object({
  id: z.number(),
  ticketNo: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  subject: z.string(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["open", "in-progress", "resolved", "closed"]),
  assignedTo: z.string().nullable(),
  createdAt: z.string(),
  type: z.string(),
})

const TicketsArraySchema = z.array(TicketSchema)

// Sample ticket data
const initialTickets = [
  {
    id: 1,
    ticketNo: "TCK-0001",
    customerName: "Ravi Shah",
    customerEmail: "ravi.shah@example.com",
    subject: "Website loading issues",
    priority: "high",
    status: "open",
    assignedTo: null,
    createdAt: "2024-01-08T10:15:00Z",
    type: "Technical",
  },
  {
    id: 2,
    ticketNo: "TCK-0002",
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@example.com",
    subject: "Invoice discrepancy",
    priority: "medium",
    status: "in-progress",
    assignedTo: "rahul",
    createdAt: "2024-01-07T14:20:00Z",
    type: "Billing",
  },
  {
    id: 3,
    ticketNo: "TCK-0003",
    customerName: "Amit Kumar",
    customerEmail: "amit.kumar@example.com",
    subject: "Feature request",
    priority: "low",
    status: "open",
    assignedTo: "priya",
    createdAt: "2024-01-06T09:30:00Z",
    type: "General",
  },
  {
    id: 4,
    ticketNo: "TCK-0004",
    customerName: "Sneha Patel",
    customerEmail: "sneha.patel@example.com",
    subject: "System crash",
    priority: "urgent",
    status: "open",
    assignedTo: "ankita",
    createdAt: "2024-01-08T13:00:00Z",
    type: "Technical",
  },
  {
    id: 5,
    ticketNo: "TCK-0005",
    customerName: "Rajesh Gupta",
    customerEmail: "rajesh.gupta@example.com",
    subject: "Password reset request",
    priority: "medium",
    status: "resolved",
    assignedTo: null,
    createdAt: "2024-01-06T15:45:00Z",
    type: "Account",
  },
  {
    id: 6,
    ticketNo: "TCK-0006",
    customerName: "Meera Singh",
    customerEmail: "meera.singh@example.com",
    subject: "Payment gateway error",
    priority: "high",
    status: "open",
    assignedTo: null,
    createdAt: "2024-01-08T09:20:00Z",
    type: "Billing",
  },
  {
    id: 7,
    ticketNo: "TCK-0007",
    customerName: "Arjun Reddy",
    customerEmail: "arjun.reddy@example.com",
    subject: "Account suspension",
    priority: "urgent",
    status: "open",
    assignedTo: null,
    createdAt: "2024-01-08T11:30:00Z",
    type: "Account",
  },
  {
    id: 8,
    ticketNo: "TCK-0008",
    customerName: "Kavya Nair",
    customerEmail: "kavya.nair@example.com",
    subject: "Data export issue",
    priority: "medium",
    status: "in-progress",
    assignedTo: "ankita",
    createdAt: "2024-01-07T16:45:00Z",
    type: "Technical",
  },
  {
    id: 9,
    ticketNo: "TCK-0009",
    customerName: "Vikram Singh",
    customerEmail: "vikram.singh@example.com",
    subject: "Mobile app crashes",
    priority: "high",
    status: "open",
    assignedTo: null,
    createdAt: "2024-01-08T08:30:00Z",
    type: "Technical",
  },
  {
    id: 10,
    ticketNo: "TCK-0010",
    customerName: "Anita Desai",
    customerEmail: "anita.desai@example.com",
    subject: "Billing cycle question",
    priority: "low",
    status: "open",
    assignedTo: "rahul",
    createdAt: "2024-01-07T12:15:00Z",
    type: "Billing",
  },
  {
    id: 11,
    ticketNo: "TCK-0011",
    customerName: "Rohit Mehta",
    customerEmail: "rohit.mehta@example.com",
    subject: "API integration help",
    priority: "medium",
    status: "open",
    assignedTo: null,
    createdAt: "2024-01-08T14:45:00Z",
    type: "Technical",
  },
  {
    id: 12,
    ticketNo: "TCK-0012",
    customerName: "Deepika Rao",
    customerEmail: "deepika.rao@example.com",
    subject: "Account upgrade request",
    priority: "low",
    status: "open",
    assignedTo: "priya",
    createdAt: "2024-01-07T10:20:00Z",
    type: "General",
  },
]

export default function AssignTicket() {
  const [tickets, setTickets] = useState([])
  const [selectedTickets, setSelectedTickets] = useState(new Set())
  const [currentView, setCurrentView] = useState("kanban")
  const [draggedTicket, setDraggedTicket] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    try {
      const validatedTickets = TicketsArraySchema.parse(initialTickets)
      setTickets(validatedTickets)
    } catch (error) {
      console.error("Ticket validation failed:", error)
      setTickets(initialTickets) // Fallback to original data
    }
  }, [])

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  }

  const statusColors = {
    open: "bg-red-100 text-red-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  }

  const statusIcons = {
    open: AlertCircle,
    "in-progress": Clock,
    resolved: CheckCircle,
    closed: XCircle,
  }

  const getStats = () => {
    const stats = {
      unassigned: 0,
      ankita: 0,
      rahul: 0,
      priya: 0,
    }

    tickets.forEach((ticket) => {
      const assignedTo = ticket.assignedTo || "unassigned"
      if (stats.hasOwnProperty(assignedTo)) {
        stats[assignedTo]++
      }
    })

    return stats
  }

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
      })
    }
  }

  const showNotification = (message, type = "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const assignTicket = (ticketId, newAssignment) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, assignedTo: newAssignment === "unassigned" ? null : newAssignment }
          : ticket,
      ),
    )

    const ticket = tickets.find((t) => t.id === ticketId)
    const staffName =
      newAssignment && newAssignment !== "unassigned"
        ? newAssignment.charAt(0).toUpperCase() + newAssignment.slice(1)
        : "Unassigned"

    showNotification(`Ticket ${ticket?.ticketNo} assigned to ${staffName}`, "success")
  }

  const handleDragStart = (e, ticket) => {
    setDraggedTicket(ticket)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, newAssignment) => {
    e.preventDefault()
    if (draggedTicket) {
      assignTicket(draggedTicket.id, newAssignment)
      setDraggedTicket(null)
    }
  }

  const toggleSelectAll = () => {
    if (selectedTickets.size === tickets.length) {
      setSelectedTickets(new Set())
    } else {
      setSelectedTickets(new Set(tickets.map((t) => t.id)))
    }
  }

  const toggleTicketSelection = (ticketId) => {
    const newSelected = new Set(selectedTickets)
    if (newSelected.has(ticketId)) {
      newSelected.delete(ticketId)
    } else {
      newSelected.add(ticketId)
    }
    setSelectedTickets(newSelected)
  }

  const bulkAssignTickets = (assignment) => {
    if (!assignment || selectedTickets.size === 0) return

    const newAssignment = assignment === "unassigned" ? null : assignment

    setTickets((prevTickets) =>
      prevTickets.map((ticket) => (selectedTickets.has(ticket.id) ? { ...ticket, assignedTo: newAssignment } : ticket)),
    )

    const staffName = newAssignment ? newAssignment.charAt(0).toUpperCase() + newAssignment.slice(1) : "Unassigned"

    showNotification(`${selectedTickets.size} tickets assigned to ${staffName}`, "success")
    setSelectedTickets(new Set())
  }

  const TicketCard = ({ ticket }) => {
    const StatusIcon = statusIcons[ticket.status]

    return (
      <div
        className="bg-gray-50 rounded-xl p-4 border border-gray-200 cursor-move hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        draggable
        onDragStart={(e) => handleDragStart(e, ticket)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              checked={selectedTickets.has(ticket.id)}
              onChange={() => toggleTicketSelection(ticket.id)}
            />
            <span className="text-sm font-medium text-gray-900">{ticket.ticketNo}</span>
          </div>
          <div className="flex space-x-1">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]} capitalize`}
            >
              {ticket.priority}
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]} capitalize flex items-center space-x-1`}
            >
              <StatusIcon className="w-3 h-3" />
              <span>{ticket.status.replace("-", " ")}</span>
            </span>
          </div>
        </div>

        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{ticket.subject}</h4>

        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
            {ticket.customerName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <span className="text-sm text-gray-600">{ticket.customerName}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Tag className="w-3 h-3" />
            <span>{ticket.type}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDateTime(ticket.createdAt)}</span>
          </div>
        </div>
      </div>
    )
  }

  const KanbanColumn = ({ title, staff, tickets, color, icon: Icon }) => {
    return (
      <div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, staff)}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div
                  className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                >
                  {typeof Icon === "string" ? Icon : <Icon className="w-4 h-4" />}
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                staff === "unassigned"
                  ? "bg-red-100 text-red-800"
                  : staff === "ankita"
                    ? "bg-blue-100 text-blue-800"
                    : staff === "rahul"
                      ? "bg-green-100 text-green-800"
                      : "bg-purple-100 text-purple-800"
              }`}
            >
              {tickets.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {staff === "unassigned"
              ? "Tickets waiting for assignment"
              : staff === "ankita"
                ? "Technical Support"
                : staff === "rahul"
                  ? "Billing Support"
                  : "General Support"}
          </p>
        </div>

        <div className="p-4 space-y-3 min-h-[400px]">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen p-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg animate-bounce ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Page Title */}
      {/* <div className=""> */}
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Assign Tickets</h1> */}
        {/* <p className="text-gray-600">Manage and assign support tickets to team members</p> */}
      {/* </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-3">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unassigned</p>
              <p className="text-3xl font-bold text-gray-900">{stats.unassigned}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ankita</p>
              <p className="text-3xl font-bold text-gray-900">{stats.ankita}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rahul</p>
              <p className="text-3xl font-bold text-gray-900">{stats.rahul}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Priya</p>
              <p className="text-3xl font-bold text-gray-900">{stats.priya}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSelectAll}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              {selectedTickets.size === tickets.length ? "Deselect All" : "Select All"}
            </button>
            <span className="text-sm text-gray-600">
              {selectedTickets.size} ticket{selectedTickets.size !== 1 ? "s" : ""} selected
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView("kanban")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  currentView === "kanban" ? "text-white bg-indigo-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setCurrentView("list")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  currentView === "list" ? "text-white bg-indigo-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                List
              </button>
            </div>

            <select
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={(e) => bulkAssignTickets(e.target.value)}
              value=""
            >
              <option value="">Assign to...</option>
              <option value="ankita">Ankita - Technical Support</option>
              <option value="rahul">Rahul - Billing Support</option>
              <option value="priya">Priya - General Support</option>
              <option value="unassigned">Unassign</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban View */}
      {currentView === "kanban" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <KanbanColumn
            title="Unassigned"
            staff="unassigned"
            tickets={tickets.filter((t) => !t.assignedTo)}
            color="bg-gradient-to-r from-red-500 to-orange-500"
            icon={AlertCircle}
          />
          <KanbanColumn
            title="Ankita"
            staff="ankita"
            tickets={tickets.filter((t) => t.assignedTo === "ankita")}
            color="bg-gradient-to-r from-blue-500 to-indigo-500"
            icon="A"
          />
          <KanbanColumn
            title="Rahul"
            staff="rahul"
            tickets={tickets.filter((t) => t.assignedTo === "rahul")}
            color="bg-gradient-to-r from-green-500 to-emerald-500"
            icon="R"
          />
          <KanbanColumn
            title="Priya"
            staff="priya"
            tickets={tickets.filter((t) => t.assignedTo === "priya")}
            color="bg-gradient-to-r from-purple-500 to-pink-500"
            icon="P"
          />
        </div>
      )}

      {/* List View */}
      {currentView === "list" && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">All Tickets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                      checked={selectedTickets.size === tickets.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => {
                  const StatusIcon = statusIcons[ticket.status]
                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                          checked={selectedTickets.has(ticket.id)}
                          onChange={() => toggleTicketSelection(ticket.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{ticket.ticketNo}</div>
                          <div className="text-sm text-gray-500">{ticket.subject}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                            {ticket.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{ticket.customerName}</div>
                            <div className="text-sm text-gray-500 flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{ticket.customerEmail}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]} capitalize`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]} capitalize flex items-center space-x-1 w-fit`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{ticket.status.replace("-", " ")}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.assignedTo ? (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{ticket.assignedTo.charAt(0).toUpperCase() + ticket.assignedTo.slice(1)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={ticket.assignedTo || "unassigned"}
                          onChange={(e) => assignTicket(ticket.id, e.target.value)}
                        >
                          <option value="unassigned">Unassigned</option>
                          <option value="ankita">Ankita</option>
                          <option value="rahul">Rahul</option>
                          <option value="priya">Priya</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
