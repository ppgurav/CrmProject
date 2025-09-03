import { useState, useEffect, useMemo } from "react"
import { z } from "zod"
import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react"
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

const followUpSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z
    .string()
    .min(8, "Phone must be at least 8 digits")
    .regex(/[0-9()+\-.\s]+/, "Only numbers and phone symbols allowed"),
  company: z.string().optional().or(z.literal("")),
  status: z.enum(["hot", "warm", "cold"]),
  nextFollowUp: z.string().min(1, "Next follow-up date is required"),
  lastContacted: z.string().optional().or(z.literal("")),
  assignee: z.string().min(1, "Assignee is required"),
  notes: z.string().optional().or(z.literal("")),
})

export default function FollowUpForm() {
  const [followUps, setFollowUps] = useState([
    {
      id: 1,
      name: "Jane Cooper",
      email: "jane.cooper@example.com",
      phone: "+1 202 555 0173",
      company: "Cooper & Co",
      status: "hot",
      nextFollowUp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
      lastContacted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      assignee: "Alex Johnson",
      notes: "Interested in yearly plan, wants case studies.",
    },
    {
      id: 2,
      name: "Robert Fox",
      email: "robert.fox@brandlab.com",
      phone: "+44 20 7946 0958",
      company: "BrandLab",
      status: "warm",
      nextFollowUp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // overdue by 2 days
      lastContacted: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: "Priya Singh",
      notes: "Requested pricing breakdown for teams.",
    },
    {
      id: 3,
      name: "Leslie Alexander",
      email: "leslie.a@example.com",
      phone: "+91 98765 43210",
      company: "Design Studio Pro",
      status: "hot",
      nextFollowUp: new Date().toISOString(), // today
      lastContacted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: "Alex Johnson",
      notes: "Demo scheduled. Needs WhatsApp reminder an hour before.",
    },
    {
      id: 4,
      name: "Kristin Watson",
      email: "kristin.w@globalent.com",
      phone: "+1 415 555 0199",
      company: "Global Enterprises",
      status: "cold",
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastContacted: "",
      assignee: "Marco Liu",
      notes: "Not ready to buy yet. Revisit next week.",
    },
    {
      id: 5,
      name: "Cody Fisher",
      email: "cody.fisher@example.com",
      phone: "+61 2 1234 5678",
      company: "Ecom X",
      status: "warm",
      nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastContacted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: "Priya Singh",
      notes: "Asked for WhatsApp updates only.",
    },
    {
      id: 6,
      name: "Guy Hawkins",
      email: "guy.hawkins@aurora.io",
      phone: "+49 30 123456",
      company: "Aurora",
      status: "hot",
      nextFollowUp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // missed by 1 day
      lastContacted: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      assignee: "Alex Johnson",
      notes: "High intent. Wants integration details.",
    },
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [assigneeFilter, setAssigneeFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedRows, setSelectedRows] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [leadToDelete, setLeadToDelete] = useState(null)

  const [banner, setBanner] = useState({ type: "", message: "" })

  const whatsappMutation = useMutation({
    mutationFn: async ({ phone, message }) => {
      await new Promise((r) => setTimeout(r, 700))
      const ph = (phone || "").replace(/\D/g, "")
      const text = encodeURIComponent(message || "Following up regarding your interest.")
      // Open WhatsApp in a new tab (supports mobile/desktop WhatsApp)
      window.open(`https://wa.me/${ph}?text=${text}`, "_blank", "noopener,noreferrer")
      return { ok: true }
    },
    onSuccess: () => {
      setBanner({ type: "success", message: "WhatsApp reminder opened successfully." })
      setTimeout(() => setBanner({ type: "", message: "" }), 2000)
    },
    onError: () => {
      setBanner({ type: "error", message: "Failed to open WhatsApp reminder." })
      setTimeout(() => setBanner({ type: "", message: "" }), 2000)
    },
  })

  const formatDate = (iso) => {
    if (!iso) return "—"
    try {
      return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    } catch {
      return iso
    }
  }

  const isToday = (iso) => {
    if (!iso) return false
    const d = new Date(iso)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  }

  const isPast = (iso) => {
    if (!iso) return false
    return new Date(iso).getTime() < new Date(new Date().toDateString()).getTime()
  }

  const getStatusPill = (status) => {
    switch (status) {
      case "hot":
        return "bg-red-100 text-red-800"
      case "warm":
        return "bg-yellow-100 text-yellow-800"
      case "cold":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFollowUpPill = (iso) => {
    if (isToday(iso)) return "bg-blue-100 text-blue-800"
    if (isPast(iso)) return "bg-red-100 text-red-800"
    return "bg-green-100 text-green-800"
  }

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase()
    const f = followUps.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(term) ||
        (f.email || "").toLowerCase().includes(term) ||
        (f.company || "").toLowerCase().includes(term) ||
        (f.phone || "").toLowerCase().includes(term)
      const matchesStatus = !statusFilter || f.status === statusFilter
      const matchesAssignee = !assigneeFilter || f.assignee === assigneeFilter
      return matchesSearch && matchesStatus && matchesAssignee
    })

    if (sortColumn) {
      f.sort((a, b) => {
        let aVal, bVal
        switch (sortColumn) {
          case "name":
            aVal = a.name.toLowerCase()
            bVal = b.name.toLowerCase()
            break
          case "company":
            aVal = (a.company || "").toLowerCase()
            bVal = (b.company || "").toLowerCase()
            break
          case "status":
            aVal = a.status
            bVal = b.status
            break
          case "assignee":
            aVal = a.assignee.toLowerCase()
            bVal = b.assignee.toLowerCase()
            break
          case "nextFollowUp":
            aVal = new Date(a.nextFollowUp)
            bVal = new Date(b.nextFollowUp)
            break
          case "lastContacted":
            aVal = a.lastContacted ? new Date(a.lastContacted) : new Date(0)
            bVal = b.lastContacted ? new Date(b.lastContacted) : new Date(0)
            break
          default:
            return 0
        }
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }
    return f
  }, [followUps, searchTerm, statusFilter, assigneeFilter, sortColumn, sortDirection])

  const totalPages = Math.ceil(filtered.length / entriesPerPage) || 1
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const rows = filtered.slice(startIndex, endIndex)

  const totalLeads = followUps.length
  const pendingToday = followUps.filter((f) => isToday(f.nextFollowUp)).length
  const missed = followUps.filter((f) => isPast(f.nextFollowUp)).length
  const hotLeads = followUps.filter((f) => f.status === "hot").length

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, assigneeFilter])

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked) setSelectedRows(rows.map((r) => r.id))
    else setSelectedRows([])
  }

  const handleSelectRow = (id, checked) => {
    if (checked) setSelectedRows([...selectedRows, id])
    else {
      setSelectedRows(selectedRows.filter((x) => x !== id))
      setSelectAll(false)
    }
  }

  const handleSort = (col) => {
    if (sortColumn === col) setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    else {
      setSortColumn(col)
      setSortDirection("asc")
    }
  }

  const viewLead = (id) => {
    const lead = followUps.find((f) => f.id === id)
    setSelectedLead(lead)
    setDetailsModalOpen(true)
  }

  const openEdit = (lead) => {
    setSelectedLead(lead || null)
    setFormState(
      lead || {
        id: Date.now(),
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "warm",
        nextFollowUp: new Date().toISOString().slice(0, 10),
        lastContacted: "",
        assignee: "",
        notes: "",
      },
    )
    setFormErrors({})
    setEditModalOpen(true)
  }

  
  const navigate = useNavigate()
  const handleAddFollowUpForm = () => {
    // Navigate to add customer page
    console.log("Navigate to add customer page")
    navigate("/addfollowupform")
  }

  const deleteLeadAsk = (id) => {
    const lead = followUps.find((f) => f.id === id)
    setLeadToDelete(lead)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (leadToDelete) {
      setFollowUps(followUps.filter((f) => f.id !== leadToDelete.id))
      setDeleteModalOpen(false)
      setLeadToDelete(null)
    }
  }

  const exportCSV = () => {
    const header = "Name,Email,Phone,Company,Status,Assignee,Next Follow-Up,Last Contacted,Notes\n"
    const body = filtered
      .map((f) => {
        const row = [
          f.name,
          f.email || "",
          f.phone || "",
          f.company || "",
          f.status,
          f.assignee || "",
          formatDate(f.nextFollowUp),
          formatDate(f.lastContacted),
          (f.notes || "").replace(/"/g, '""'),
        ]
        return `"${row.join('","')}"`
      })
      .join("\n")
    const uri = "data:text/csv;charset=utf-8," + header + body
    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(uri))
    link.setAttribute("download", "followups.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const [formState, setFormState] = useState({
    id: Date.now(),
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "warm",
    nextFollowUp: new Date().toISOString().slice(0, 10),
    lastContacted: "",
    assignee: "",
    notes: "",
  })
  const [formErrors, setFormErrors] = useState({})

  const updateForm = (key, val) => setFormState((s) => ({ ...s, [key]: val }))

  const saveLead = () => {
    // normalize nextFollowUp date
    const normalized = {
      ...formState,
      nextFollowUp:
        formState.nextFollowUp.length <= 10
          ? new Date(formState.nextFollowUp + "T00:00:00").toISOString()
          : formState.nextFollowUp,
      lastContacted:
        formState.lastContacted && formState.lastContacted.length <= 10
          ? new Date(formState.lastContacted + "T00:00:00").toISOString()
          : formState.lastContacted,
    }

    const parsed = followUpSchema.safeParse(normalized)
    if (!parsed.success) {
      const errs = {}
      parsed.error.issues.forEach((i) => {
        errs[i.path[0]] = i.message
      })
      setFormErrors(errs)
      return
    }

    setFollowUps((list) => {
      const exists = list.some((x) => x.id === normalized.id)
      if (exists) {
        return list.map((x) => (x.id === normalized.id ? normalized : x))
      }
      return [normalized, ...list]
    })
    setEditModalOpen(false)
    setBanner({ type: "success", message: "Follow-up saved." })
    setTimeout(() => setBanner({ type: "", message: "" }), 2000)
  }

  const uniqueAssignees = Array.from(new Set(followUps.map((f) => f.assignee).filter(Boolean)))

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6 ml-4 mr-4">
        {/* Notification banner */}
        {banner.message ? (
          <div
            className={`mb-4 rounded-xl p-4 border ${
              banner.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            {banner.message}
          </div>
        ) : null}

        {/* Stats Cards (Dashboard) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
          {/* Total Leads */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+2</span> this week
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Pending Today */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Today</p>
                <p className="text-3xl font-bold text-gray-900">{pendingToday}</p>
                <p className="text-sm text-blue-600 mt-1">
                  <span className="font-medium">Due today</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Missed */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Missed</p>
                <p className="text-3xl font-bold text-gray-900">{missed}</p>
                <p className="text-sm text-red-600 mt-1">
                  <span className="font-medium">Needs attention</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Hot Leads */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                <p className="text-3xl font-bold text-gray-900">{hotLeads}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">High intent</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions (same formatting/padding as invoice) */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search leads..."
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
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>

              {/* Assignee Filter */}
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Assignees</option>
                {uniqueAssignees.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={exportCSV}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                <Download className="inline-block w-5 h-5 mr-2" />
                Export
              </button>
              <button
                onClick={handleAddFollowUpForm}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="inline-block w-5 h-5 mr-2" />
                Add Follow-Up
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Follow-Ups</h3>
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
                    onClick={() => handleSort("name")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Lead/Customer
                  </th>
                  <th
                    onClick={() => handleSort("company")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Company
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Status
                  </th>
                  <th
                    onClick={() => handleSort("assignee")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Assignee
                  </th>
                  <th
                    onClick={() => handleSort("nextFollowUp")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Next Follow-Up
                  </th>
                  <th
                    onClick={() => handleSort("lastContacted")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Last Contacted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(f.id)}
                        onChange={(e) => handleSelectRow(f.id, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {f.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{f.name}</div>
                          <div className="text-sm text-gray-500">{f.email || f.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{f.company || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusPill(f.status)}`}
                      >
                        {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{f.assignee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFollowUpPill(f.nextFollowUp)}`}
                      >
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {formatDate(f.nextFollowUp)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(f.lastContacted)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs">
                      <div className="truncate" title={f.notes || ""}>
                        {f.notes || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewLead(f.id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(f)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            whatsappMutation.mutate({
                              phone: f.phone,
                              message: `Hi ${f.name.split(" ")[0]}, quick reminder about our next follow-up on ${formatDate(f.nextFollowUp)}.`,
                            })
                          }
                          className="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50"
                          title="WhatsApp Reminder"
                          disabled={whatsappMutation.isPending}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLeadAsk(f.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={9}>
                      No follow-ups found. Adjust your filters or add a new follow-up.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (same styling as invoice) */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span>{filtered.length ? startIndex + 1 : 0}</span> to{" "}
                <span>{Math.min(endIndex, filtered.length)}</span> of <span>{filtered.length}</span> entries
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

      {/* Details Modal */}
      {detailsModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Follow-Up Details</h3>
                  <button onClick={() => setDetailsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Lead Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-gray-900">{selectedLead.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company</label>
                        <p className="text-gray-900">{selectedLead.company || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact</label>
                        <p className="text-gray-900">
                          {(selectedLead.email || "—") + " · " + (selectedLead.phone || "—")}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Assignee</label>
                        <p className="text-gray-900">{selectedLead.assignee}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Status & Schedule</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusPill(selectedLead.status)}`}
                        >
                          {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Next Follow-Up</label>
                        <p className="text-gray-900">{formatDate(selectedLead.nextFollowUp)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last Contacted</label>
                        <p className="text-gray-900">{formatDate(selectedLead.lastContacted)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">WhatsApp</label>
                        <div className="mt-1">
                          <button
                            onClick={() =>
                              whatsappMutation.mutate({
                                phone: selectedLead.phone,
                                message: `Hi ${selectedLead.name.split(" ")[0]}, a quick reminder about our next follow-up on ${formatDate(
                                  selectedLead.nextFollowUp,
                                )}.`,
                              })
                            }
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                          >
                            Send Reminder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedLead.notes ? (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Notes</h4>
                    <p className="text-gray-700">{selectedLead.notes}</p>
                  </div>
                ) : null}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setDetailsModalOpen(false)
                      openEdit(selectedLead)
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Edit Follow-Up
                  </button>
                  <button
                    onClick={() =>
                      whatsappMutation.mutate({
                        phone: selectedLead.phone,
                        message: `Hi ${selectedLead.name.split(" ")[0]}, a quick reminder about our next follow-up on ${formatDate(
                          selectedLead.nextFollowUp,
                        )}.`,
                      })
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setDetailsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {followUps.some((x) => x.id === formState.id) ? "Edit Follow-Up" : "Add Follow-Up"}
                  </h3>
                  <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      value={formState.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.name ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Jane Cooper"
                    />
                    {formErrors.name ? <p className="text-xs text-red-600 mt-1">{formErrors.name}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      value={formState.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.email ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="jane@example.com"
                    />
                    {formErrors.email ? <p className="text-xs text-red-600 mt-1">{formErrors.email}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      value={formState.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.phone ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="+1 202 555 0173"
                    />
                    {formErrors.phone ? <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      value={formState.company}
                      onChange={(e) => updateForm("company", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                      placeholder="Acme Inc"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formState.status}
                      onChange={(e) => updateForm("status", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                    >
                      <option value="hot">Hot</option>
                      <option value="warm">Warm</option>
                      <option value="cold">Cold</option>
                    </select>
                    {formErrors.status ? <p className="text-xs text-red-600 mt-1">{formErrors.status}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                    <input
                      value={formState.assignee}
                      onChange={(e) => updateForm("assignee", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.assignee ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Alex Johnson"
                    />
                    {formErrors.assignee ? <p className="text-xs text-red-600 mt-1">{formErrors.assignee}</p> : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-Up</label>
                    <input
                      type="date"
                      value={formState.nextFollowUp?.slice(0, 10)}
                      onChange={(e) => updateForm("nextFollowUp", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.nextFollowUp ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {formErrors.nextFollowUp ? (
                      <p className="text-xs text-red-600 mt-1">{formErrors.nextFollowUp}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Contacted</label>
                    <input
                      type="date"
                      value={formState.lastContacted ? formState.lastContacted.slice(0, 10) : ""}
                      onChange={(e) => updateForm("lastContacted", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={formState.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                      rows={4}
                      placeholder="Add context about last conversation, objections, needs, etc."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveLead}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Follow-Up</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete <span className="font-semibold">{leadToDelete.name}</span>? This will
                  permanently remove the follow-up from the system.
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
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

