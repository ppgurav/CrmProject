import { useState } from "react"
import { z } from "zod"
import { Paperclip, Send, FileText, Zap, Copy, Printer, AlertTriangle, X, Plus } from "lucide-react"

// Zod schemas for validation
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

export default function TicketDetails() {
  const [ticket, setTicket] = useState({
    id: "TCK-0001",
    title: "Website loading issues",
    status: "open",
    priority: "high",
    assignedTo: "ankita",
    customer: {
      name: "Ravi Shah",
      email: "ravi.shah@example.com",
      phone: "+91 98765 43210",
      id: "CUST-001",
      initials: "RS",
    },
    created: "Jan 8, 2024 10:15 AM",
    lastUpdated: "2h ago",
    responseTime: "2h 15m",
  })

  const [conversation, setConversation] = useState([
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
    {
      id: 4,
      type: "customer",
      author: "Ravi Shah",
      initials: "RS",
      timestamp: "Jan 8, 2024 2:45 PM",
      message:
        "Thank you for the quick response! The website seems to be loading faster now. Is there anything I can do to prevent this from happening again?",
    },
  ])

  const [replyForm, setReplyForm] = useState({
    message: "",
    sendEmail: true,
    sendWhatsApp: false,
  })

  const [showInternalNoteModal, setShowInternalNoteModal] = useState(false)
  const [internalNote, setInternalNote] = useState("")
  const [errors, setErrors] = useState({})

  const handleReplySubmit = (e) => {
    e.preventDefault()

    try {
      const validatedData = replySchema.parse(replyForm)

      const newReply = {
        id: conversation.length + 1,
        type: "admin",
        author: "John Doe (Admin)",
        initials: "JD",
        timestamp: "Just now",
        message: validatedData.message,
      }

      setConversation([...conversation, newReply])
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
        id: conversation.length + 1,
        type: "internal",
        timestamp: "Just now",
        message: validatedData.note,
      }

      setConversation([...conversation, newNote])
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
        status: ticket.status,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo,
      }

      ticketUpdateSchema.parse(updateData)
      alert("Ticket updated successfully!")
    } catch (error) {
      alert("Error updating ticket")
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      <div className="max-w-full mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Ticket Header */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-8 border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(ticket.priority)}`}
                      >
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <span className="text-gray-600">Ticket No:</span>
                      <p className="font-semibold text-gray-900">{ticket.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <p className="font-semibold text-gray-900">{ticket.created}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Updated:</span>
                      <p className="font-semibold text-gray-900">{ticket.lastUpdated}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Info Card */}
                <div className="bg-gray-50 rounded-xl p-6 min-w-[300px]">
                  <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {ticket.customer.initials}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{ticket.customer.name}</p>
                        <p className="text-sm text-gray-600">{ticket.customer.email}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="text-gray-900">{ticket.customer.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Customer ID:</span>
                          <span className="text-gray-900">{ticket.customer.id}</span>
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
                {conversation.map((message) => {
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
                    value={ticket.status}
                    onChange={(e) => setTicket({ ...ticket, status: e.target.value })}
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
                    value={ticket.priority}
                    onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
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
                    value={ticket.assignedTo}
                    onChange={(e) => setTicket({ ...ticket, assignedTo: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    <option value="ankita">Ankita</option>
                    <option value="rahul">Rahul</option>
                    <option value="priya">Priya</option>
                    <option value="arjun">Arjun</option>
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
                  <span className="font-medium text-gray-900">Technical</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-gray-900">Jan 8, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium text-gray-900">{ticket.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-medium text-green-600">{ticket.responseTime}</span>
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
