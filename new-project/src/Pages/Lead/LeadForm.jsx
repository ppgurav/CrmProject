
import { useState } from "react"
import { z } from "zod"
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Edit,
  Eye,
  RefreshCw,
  User,
  FileText,
  History,
  Mail,
  RotateCcw,
  CheckCircle,
  Clock,
  X,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// Validation schema
const leadSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobile: z.string().min(10, "Valid mobile number required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  companyName: z.string().optional(),
  cityState: z.string().optional(),
  leadSource: z.string().min(1, "Lead source is required"),
  interestedIn: z.array(z.string()).min(1, "Select at least one interest"),
  budgetRange: z.string().optional(),
  notes: z.string().optional(),
  assignedTo: z.string().min(1, "Assigned to is required"),
  nextFollowup: z.string().min(1, "Next follow-up date is required"),
  priority: z.string().min(1, "Priority is required"),
})

export default function LeadForm() {
  const [activeTab, setActiveTab] = useState("leads")
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [leadDetailTab, setLeadDetailTab] = useState("info")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [errors, setErrors] = useState({})

  // Sample data
  const [leads, setLeads] = useState([
    {
      id: 1,
      fullName: "Amit Shah",
      mobile: "98765XXXXX",
      email: "amit@example.com",
      companyName: "Shah Enterprises",
      cityState: "Mumbai, Maharashtra",
      leadSource: "Facebook Ads",
      status: "Follow-up",
      assignedTo: "Priya",
      lastFollowup: "2 Aug",
      nextFollowup: "5 Aug",
      priority: "High",
      interestedIn: ["Website", "Domain"],
      budgetRange: "50k-1L",
      notes: "Interested in e-commerce website",
    },
    {
      id: 2,
      fullName: "Sneha Patel",
      mobile: "98234XXXXX",
      email: "sneha@example.com",
      companyName: "Patel Industries",
      cityState: "Ahmedabad, Gujarat",
      leadSource: "Referral",
      status: "Contacted",
      assignedTo: "Ravi",
      lastFollowup: "3 Aug",
      nextFollowup: "6 Aug",
      priority: "Medium",
      interestedIn: ["Hosting", "Email"],
      budgetRange: "25k-50k",
      notes: "Referred by existing client",
    },
    {
      id: 3,
      fullName: "Karan Mehta",
      mobile: "98111XXXXX",
      email: "karan@example.com",
      companyName: "Mehta Corp",
      cityState: "Pune, Maharashtra",
      leadSource: "WhatsApp",
      status: "New",
      assignedTo: "Ankita",
      lastFollowup: "–",
      nextFollowup: "5 Aug",
      priority: "High",
      interestedIn: ["Website", "WhatsApp Panel"],
      budgetRange: "1L+",
      notes: "New lead from WhatsApp marketing",
    },
    {
        id: 4,
        fullName: "Ankita",
        mobile: "99765XXXXX",
        email: "ankita@example.com",
        companyName: "ankita Enterprises",
        cityState: "Mumbai, Maharashtra",
        leadSource: "Facebook Ads",
        status: "Follow-up",
        assignedTo: "Priya",
        lastFollowup: "2 Aug",
        nextFollowup: "5 Aug",
        priority: "High",
        interestedIn: ["Website", "Domain"],
        budgetRange: "50k-1L",
        notes: "Interested in e-commerce website",
      },
  ])

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    companyName: "",
    cityState: "",
    leadSource: "",
    interestedIn: [],
    budgetRange: "",
    notes: "",
    assignedTo: "",
    nextFollowup: "",
    priority: "",
  })

  const employees = ["Priya", "Ravi", "Ankita", "Apurva"]
  const leadSources = [
    "Website",
    "WhatsApp",
    "Referral",
    "Cold Call",
    "Facebook Ads",
    "Instagram Ads",
    "Google Ads",
    "Event / Exhibition",
  ]
  const interests = ["Domain", "Hosting", "Website", "Email", "WhatsApp Panel"]
  const priorities = ["Low", "Medium", "High"]
  const statuses = [
    "New",
    "Contacted",
    "Follow-up",
    "Demo Given",
    "Proposal Sent",
    "Not Interested",
    "Converted",
    "Closed",
  ]
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      uploadFile: file, // store file object
    }));
  };
  
  const todayFollowups = leads.filter((lead) => lead.nextFollowup === "5 Aug" || lead.nextFollowup === "Today")

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      if (name === "interestedIn") {
        setFormData((prev) => ({
          ...prev,
          interestedIn: checked ? [...prev.interestedIn, value] : prev.interestedIn.filter((item) => item !== value),
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    try {
      leadSchema.parse(formData)

      const newLead = {
        id: leads.length + 1,
        ...formData,
        status: "New",
        lastFollowup: "–",
      }

      setLeads([...leads, newLead])
      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        companyName: "",
        cityState: "",
        leadSource: "",
        interestedIn: [],
        budgetRange: "",
        notes: "",
        assignedTo: "",
        nextFollowup: "",
        priority: "",
      })
      setShowAddForm(false)
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

  const getStatusColor = (status) => {
    const colors = {
      New: "bg-blue-100 text-blue-800",
      Contacted: "bg-yellow-100 text-yellow-800",
      "Follow-up": "bg-orange-100 text-orange-800",
      "Demo Given": "bg-purple-100 text-purple-800",
      "Proposal Sent": "bg-indigo-100 text-indigo-800",
      "Not Interested": "bg-red-100 text-red-800",
      Converted: "bg-green-100 text-green-800",
      Closed: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }
  const navigate = useNavigate();


  const handleAddCustomerLead = () => {
    // Navigate to add customer page
    console.log("Navigate to add customer page")
    navigate('/leadform/addlead');

  }
  const getPriorityColor = (priority) => {
    const colors = {
      High: "text-red-600",
      Medium: "text-yellow-600",
      Low: "text-green-600",
    }
    return colors[priority] || "text-gray-600"
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.mobile.includes(searchTerm) ||
      lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    // <div className="min-h-screen bg-gray-50">
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen p-6">
      {/* Header */}
      <div className=" ">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-1">
            {/* <div className=""> */}
              {/* <Users className="h-8 w-8 text-blue-600" /> */}
              {/* <h1 className="text-2xl font-bold text-gray-900">Lead Management System</h1> */}
            {/* </div> */}
            <button
              onClick={handleAddCustomerLead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 ml-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 rounded-2xl">
        {/* Tabs */}
        <div className="mb-7">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("leads")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "leads"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Leads
              </button>
              <button
                onClick={() => setActiveTab("followups")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "followups"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Today's Follow-ups ({todayFollowups.length})
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "leads" && (
          <div>
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Follow-up
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Next Follow-up
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{lead.fullName}</div>
                              <div className="text-sm text-gray-500">{lead.companyName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.mobile}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.leadSource}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.assignedTo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.lastFollowup}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-900">{lead.nextFollowup}</span>
                            <span className={`text-xs ${getPriorityColor(lead.priority)}`}>●</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => setSelectedLead(lead)} className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-purple-600 hover:text-purple-900">
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "followups" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Today's Follow-ups</h3>
              <p className="text-sm text-gray-500">Quick-access list of today's due follow-ups</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Follow-up Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todayFollowups.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.mobile}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Today</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.assignedTo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs hover:bg-green-200">
                            <Phone className="h-3 w-3 inline mr-1" />
                            Call
                          </button>
                          <button className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200">
                            <MessageSquare className="h-3 w-3 inline mr-1" />
                            WhatsApp
                          </button>
                          <button className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs hover:bg-gray-200">
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {/* {showAddForm && (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Add New Lead</h2>
        <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
   
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
          </div>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City, State</label>
            <input
              type="text"
              name="cityState"
              value={formData.cityState}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source *</label>
            <select
              name="leadSource"
              value={formData.leadSource}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Source</option>
              <option value="Website">Website</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Social Media">Social Media (Facebook, Instagram, etc.)</option>
              <option value="Event / Exhibition">Event / Exhibition</option>
            </select>
            {errors.leadSource && <p className="text-red-500 text-xs mt-1">{errors.leadSource}</p>}
          </div>
        </div>

       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interested In *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {["Domain", "Hosting", "Website", "Email", "WhatsApp Panel"].map((interest) => (
              <label key={interest} className="flex items-center">
                <input
                  type="checkbox"
                  name="interestedIn"
                  value={interest}
                  checked={formData.interestedIn.includes(interest)}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{interest}</span>
              </label>
            ))}
          </div>
          {errors.interestedIn && <p className="text-red-500 text-xs mt-1">{errors.interestedIn}</p>}
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
            <select
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Budget</option>
              <option value="Under 25k">Under 25k</option>
              <option value="25k-50k">25k-50k</option>
              <option value="50k-1L">50k-1L</option>
              <option value="1L+">1L+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority}</p>}
          </div>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To *</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
            {errors.assignedTo && <p className="text-red-500 text-xs mt-1">{errors.assignedTo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date *</label>
            <input
              type="date"
              name="nextFollowup"
              value={formData.nextFollowup}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.nextFollowup && <p className="text-red-500 text-xs mt-1">{errors.nextFollowup}</p>}
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes..."
          />
        </div>

  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Visiting Card / Docs (optional)</label>
          <input
            type="file"
            name="uploadFile"
            onChange={handleFileUpload}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 hover:file:bg-gray-200"
          />
        </div>

     
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Add Lead
          </button>
        </div>
      </form>
    </div>
  </div>
)} */}


      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

<div className="bg-white rounded-lg max-w-7xl w-full h-[700px] overflow-y-auto">

            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">{selectedLead.fullName}</h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Lead Detail Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "info", label: "🔹 Lead Info", icon: User },
                  { id: "notes", label: "📝 Notes & Comments", icon: FileText },
                  { id: "followup", label: "📞 Follow-up History", icon: History },
                  { id: "logs", label: "📤 WhatsApp & Email Logs", icon: Mail },
                  { id: "conversion", label: "🔁 Conversion History", icon: RotateCcw },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setLeadDetailTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      leadDetailTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {leadDetailTab === "info" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <p className="text-sm text-gray-900">{selectedLead.fullName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Mobile</label>
                          <p className="text-sm text-gray-900">{selectedLead.mobile}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-sm text-gray-900">{selectedLead.email || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Company</label>
                          <p className="text-sm text-gray-900">{selectedLead.companyName || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Location</label>
                          <p className="text-sm text-gray-900">{selectedLead.cityState || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Details</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Source</label>
                          <p className="text-sm text-gray-900">{selectedLead.leadSource}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLead.status)}`}
                          >
                            {selectedLead.status}
                          </span>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Priority</label>
                          <p className={`text-sm font-medium ${getPriorityColor(selectedLead.priority)}`}>
                            {selectedLead.priority}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Assigned To</label>
                          <p className="text-sm text-gray-900">{selectedLead.assignedTo}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Interested In</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedLead.interestedIn.map((interest) => (
                              <span
                                key={interest}
                                className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Budget Range</label>
                          <p className="text-sm text-gray-900">{selectedLead.budgetRange || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedLead.notes && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {leadDetailTab === "notes" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Notes & Comments</h3>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      Add Note
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm text-gray-900">Priya</span>
                        <span className="text-xs text-gray-500">2 Aug, 2:30 PM</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Initial contact made. Client interested in e-commerce solution.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm text-gray-900">Priya</span>
                        <span className="text-xs text-gray-500">1 Aug, 4:15 PM</span>
                      </div>
                      <p className="text-sm text-gray-700">Sent initial proposal. Waiting for feedback.</p>
                    </div>
                  </div>
                </div>
              )}

              {leadDetailTab === "followup" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Follow-up History</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm text-gray-900">Call Completed</span>
                          <span className="text-xs text-gray-500">2 Aug, 3:00 PM</span>
                        </div>
                        <p className="text-sm text-gray-600">Discussed requirements and budget</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm text-gray-900">Follow-up Scheduled</span>
                          <span className="text-xs text-gray-500">5 Aug, 10:00 AM</span>
                        </div>
                        <p className="text-sm text-gray-600">Demo presentation scheduled</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {leadDetailTab === "logs" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Communication Logs</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 border rounded">
                      <MessageSquare className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm text-gray-900">WhatsApp Message Sent</span>
                          <span className="text-xs text-gray-500">2 Aug, 2:45 PM</span>
                        </div>
                        <p className="text-sm text-gray-600">Initial introduction and service overview</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm text-gray-900">Email Sent</span>
                          <span className="text-xs text-gray-500">1 Aug, 5:00 PM</span>
                        </div>
                        <p className="text-sm text-gray-600">Proposal document shared</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {leadDetailTab === "conversion" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Conversion History</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Lead Created</span>
                        <span className="text-sm text-gray-500">30 Jul, 2024</span>
                      </div>
                      <div className="text-sm text-gray-600">Lead generated from Facebook Ads campaign</div>
                    </div>
                    <div className="p-4 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">First Contact</span>
                        <span className="text-sm text-gray-500">1 Aug, 2024</span>
                      </div>
                      <div className="text-sm text-gray-600">Initial phone call made</div>
                    </div>
                    <div className="p-4 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Proposal Sent</span>
                        <span className="text-sm text-gray-500">2 Aug, 2024</span>
                      </div>
                      <div className="text-sm text-gray-600">Detailed proposal shared via email</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
