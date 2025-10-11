
import { useEffect, useState } from "react"
import { z } from "zod"
import {  Plus,  Search,  Filter,  Phone,  MessageSquare,  Edit, Eye,  RefreshCw,  User,  FileText,  History,  Mail,  RotateCcw,  CheckCircle,  Clock,  X,} from "lucide-react"
import { useNavigate } from "react-router-dom"

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

  const reminders = [
    {
      assignedTo: "Priya",
      dateTime: "2 Aug, 2:30 PM",
      message: "Initial contact made. Client interested in e-commerce solution.",
    },
    {
      assignedTo: "Priya",
      dateTime: "1 Aug, 4:15 PM",
      message: "Sent initial proposal. Waiting for feedback.",
    },
  ];
  

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

  // async function handleSendPaymentLink(reminder) {
  //   try {
  //     // Example: get lead info
  //     const phoneNumber = reminder.phone || leadDetails?.phone; // E.g. "+919876543210"
  //     const amount = reminder.amount || 500; // Customize per reminder or lead
  
  //     // Call backend API to generate & send WhatsApp message
  //     const response = await fetch("/api/payment/send-whatsapp-link", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         leadId: leadDetails?.id,
  //         phoneNumber,
  //         amount,
  //       }),
  //     });
  
  //     if (response.ok) {
  //       alert(`WhatsApp payment link sent to ${phoneNumber}`);
  //     } else {
  //       alert("Failed to send WhatsApp payment link");
  //     }
  //   } catch (error) {
  //     console.error("Error sending WhatsApp payment link:", error);
  //   }
  // }
  
  /* --- Optional auto-send logic --- */
  // useEffect(() => {
  //   const now = new Date();
  
  //   reminders?.forEach((reminder) => {
  //     const reminderTime = new Date(reminder.dateTime);
  //     const isDue = reminderTime <= now;
  
  //     // Auto-send if due and marked for auto send
  //     if (isDue && reminder.autoSend && !reminder.linkSent) {
  //       handleSendPaymentLink(reminder);
  //       reminder.linkSent = true; // avoid duplicates
  //     }
  //   });
  // }, [reminders]);




  const handleSendPaymentLink = (reminder) => {
    const phone = lead.phone.replace("+", "").trim(); // format phone
    const leadName = lead.name;
  
    const messageLines = [
      `Hello ${leadName},`,
      ``,
      `Here’s your payment quote based on our reminder:`,
      `"${reminder.message}"`,
      ``,
      ...reminder.quote.items.map(item => `${item.name}: $${item.price}`),
      ``,
      `Total: $${reminder.quote.total}`,
      ``,
      `Please complete the payment at: https://yourpaymentlink.com/lead/${lead.id}`
    ];
  
    const encodedMsg = encodeURIComponent(messageLines.join("\n"));
    const whatsappURL = `https://wa.me/${phone}?text=${encodedMsg}`;
  
    window.open(whatsappURL, "_blank");
  };
  

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
      <div className="">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center ">
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

      <div className="bg-white max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 rounded-2xl ml-4 mr-4">
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
                  { id: "Details", label: " Quatation", icon: User },
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



{/* {leadDetailTab === "Details" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900"> </h3>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Select Remainder
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
              )} */}
{leadDetailTab === "Details" && (
  <div className="space-y-4">
    {/* Header */}
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900">Reminders</h3>
      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
        Select Reminder
      </button>
    </div>

    {/* Reminder List */}
    <div className="space-y-3">
      {reminders && reminders.length > 0 ? (
        reminders.map((reminder, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded shadow-sm space-y-3">
            {/* Reminder Info */}
            <div className="flex justify-between items-start">
              <span className="font-medium text-sm text-gray-900">{reminder.assignedTo}</span>
              <span className="text-xs text-gray-500">{reminder.dateTime}</span>
            </div>
            <p className="text-sm text-gray-700">{reminder.message}</p>

            {/* Quote Section */}
            {reminder.quote && (
              <div className="bg-white border border-gray-200 rounded p-3">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Quote Details</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  {reminder.quote.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t pt-2 mt-2 font-medium text-indigo-600">
                  <span>Total</span>
                  <span>${reminder.quote.total}</span>
                </div>
              </div>
            )}

            {/* Send WhatsApp Payment Link Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleSendPaymentLink(reminder)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Send WhatsApp Payment Link
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 italic">No reminders yet.</p>
      )}
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







// import { useState } from "react"
// import { z } from "zod"
// import {
//   Plus,
//   Search,
//   Filter,
//   Phone,
//   MessageSquare,
//   Edit,
//   Eye,
//   RefreshCw,
//   User,
//   FileText,
//   History,
//   Mail,
//   RotateCcw,
//   CheckCircle,
//   Clock,
//   X,
// } from "lucide-react"
// import { useRouter } from "next/navigation"
// import axios from "axios"
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import { toast } from "react-hot-toast"

// const api = axios.create({
//   baseURL: "https://crmapi.technfest.com",
//   headers: {
//     Authorization: `Bearer ${typeof window !== "undefined" ? sessionStorage.getItem("token") : ""}`,
//     "Content-Type": "application/json",
//   },
// })

// const leadSchema = z.object({
//   fullName: z.string().min(1, "Full name is required"),
//   mobile: z.string().min(10, "Valid mobile number required"),
//   email: z.string().email("Valid email required").optional().or(z.literal("")),
//   companyName: z.string().optional(),
//   cityState: z.string().optional(),
//   leadSource: z.string().min(1, "Lead source is required"),
//   interestedIn: z.array(z.string()).min(1, "Select at least one interest"),
//   budgetRange: z.string().optional(),
//   notes: z.string().optional(),
//   assignedTo: z.string().min(1, "Assigned to is required"),
//   nextFollowup: z.string().min(1, "Next follow-up date is required"),
//   priority: z.string().min(1, "Priority is required"),
// })

// export default function LeadForm() {
//   const [activeTab, setActiveTab] = useState("leads")
//   const [showAddForm, setShowAddForm] = useState(false)
//   const [selectedLead, setSelectedLead] = useState(null)
//   const [leadDetailTab, setLeadDetailTab] = useState("info")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [errors, setErrors] = useState({})
//   const queryClient = useQueryClient()
//   const router = useRouter()

//   const {
//     data: leads = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["leads"],
//     queryFn: async () => {
//       const response = await api.get("/leads?page=1&limit=100")
//       return response.data.data || response.data
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed to fetch leads")
//     },
//   })

//   const createLeadMutation = useMutation({
//     mutationFn: async (leadData) => {
//       const response = await api.post("/leads", {
//         full_name: leadData.fullName,
//         mobile: leadData.mobile,
//         email: leadData.email,
//         company: leadData.companyName,
//         city_state: leadData.cityState,
//         source: leadData.leadSource,
//         interested_in: leadData.interestedIn.join(", "),
//         budget_range: leadData.budgetRange,
//         notes: leadData.notes,
//         assigned_to: leadData.assignedTo,
//         next_followup: leadData.nextFollowup,
//         priority: leadData.priority,
//       })
//       return response.data
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(["leads"])
//       toast.success(data?.message || "Lead created successfully!")
//       setShowAddForm(false)
//       setFormData({
//         fullName: "",
//         mobile: "",
//         email: "",
//         companyName: "",
//         cityState: "",
//         leadSource: "",
//         interestedIn: [],
//         budgetRange: "",
//         notes: "",
//         assignedTo: "",
//         nextFollowup: "",
//         priority: "",
//       })
//       setErrors({})
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed to create lead")
//     },
//   })

//   const updateStatusMutation = useMutation({
//     mutationFn: async ({ leadId, status }) => {
//       const response = await api.put(`/leads/${leadId}/status`, { status })
//       return response.data
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(["leads"])
//       toast.success(data?.message || "Lead status updated successfully!")
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed to update lead status")
//     },
//   })

//   const updateLeadMutation = useMutation({
//     mutationFn: async (leadData) => {
//       const response = await api.put(`/leads/${leadData.id}`, {
//         full_name: leadData.fullName,
//         mobile: leadData.mobile,
//         email: leadData.email,
//         company: leadData.companyName,
//         city_state: leadData.cityState,
//         source: leadData.leadSource,
//         interested_in: leadData.interestedIn.join(", "),
//         budget_range: leadData.budgetRange,
//         notes: leadData.notes,
//         assigned_to: leadData.assignedTo,
//         next_followup: leadData.nextFollowup,
//         priority: leadData.priority,
//       })
//       return response.data
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(["leads"])
//       toast.success(data?.message || "Lead updated successfully!")
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed to update lead")
//     },
//   })

//   const deleteLeadMutation = useMutation({
//     mutationFn: async (leadId) => {
//       const response = await api.delete(`/leads/${leadId}`)
//       return response.data
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries(["leads"])
//       toast.success(data?.message || "Lead deleted successfully!")
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed to delete lead")
//     },
//   })

//   const [formData, setFormData] = useState({
//     fullName: "",
//     mobile: "",
//     email: "",
//     companyName: "",
//     cityState: "",
//     leadSource: "",
//     interestedIn: [],
//     budgetRange: "",
//     notes: "",
//     assignedTo: "",
//     nextFollowup: "",
//     priority: "",
//   })

//   const employees = ["Priya", "Ravi", "Ankita", "Apurva"]
//   const leadSources = [
//     "Website",
//     "WhatsApp",
//     "Referral",
//     "Cold Call",
//     "Facebook Ads",
//     "Instagram Ads",
//     "Google Ads",
//     "Event / Exhibition",
//   ]
//   const interests = ["Domain", "Hosting", "Website", "Email", "WhatsApp Panel"]
//   const priorities = ["Low", "Medium", "High"]
//   const statuses = [
//     "New",
//     "Contacted",
//     "Follow-up",
//     "Demo Given",
//     "Proposal Sent",
//     "Not Interested",
//     "Converted",
//     "Closed",
//   ]
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0]
//     setFormData((prev) => ({
//       ...prev,
//       uploadFile: file, // store file object
//     }))
//   }

//   const todayFollowups = leads.filter((lead) => lead.nextFollowup === "5 Aug" || lead.nextFollowup === "Today")

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target

//     if (type === "checkbox") {
//       if (name === "interestedIn") {
//         setFormData((prev) => ({
//           ...prev,
//           interestedIn: checked ? [...prev.interestedIn, value] : prev.interestedIn.filter((item) => item !== value),
//         }))
//       }
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }))
//     }
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     try {
//       leadSchema.parse(formData)
//       createLeadMutation.mutate(formData)
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const newErrors = {}
//         error.errors.forEach((err) => {
//           newErrors[err.path[0]] = err.message
//         })
//         setErrors(newErrors)
//       }
//     }
//   }

//   const getStatusColor = (status) => {
//     const colors = {
//       New: "bg-blue-100 text-blue-800",
//       Contacted: "bg-yellow-100 text-yellow-800",
//       "Follow-up": "bg-orange-100 text-orange-800",
//       "Demo Given": "bg-purple-100 text-purple-800",
//       "Proposal Sent": "bg-indigo-100 text-indigo-800",
//       "Not Interested": "bg-red-100 text-red-800",
//       Converted: "bg-green-100 text-green-800",
//       Closed: "bg-gray-100 text-gray-800",
//     }
//     return colors[status] || "bg-gray-100 text-gray-800"
//   }

//   const handleAddCustomerLead = () => {
//     // Navigate to add customer page
//     console.log("Navigate to add customer page")
//     router.push("/leadform/addlead")
//   }
//   const getPriorityColor = (priority) => {
//     const colors = {
//       High: "text-red-600",
//       Medium: "text-yellow-600",
//       Low: "text-green-600",
//     }
//     return colors[priority] || "text-gray-600"
//   }

//   const filteredLeads = leads.filter((lead) => {
//     const matchesSearch =
//       lead.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       lead.mobile?.includes(searchTerm) ||
//       lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || lead.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   if (isLoading) {
//     return (
//       <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen p-6 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
//           <p className="text-gray-600">Loading leads...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     // <div className="min-h-screen bg-gray-50">
//     <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen p-6">
//       {/* Header */}
//       <div className="">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center ">
//             {/* <div className=""> */}
//             {/* <Users className="h-8 w-8 text-blue-600" /> */}
//             {/* <h1 className="text-2xl font-bold text-gray-900">Lead Management System</h1> */}
//             {/* </div> */}
//             <button
//               onClick={handleAddCustomerLead}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 ml-auto"
//             >
//               <Plus className="h-4 w-4" />
//               <span>Add Lead</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 rounded-2xl ml-4 mr-4">
//         {/* Tabs */}
//         <div className="mb-7">
//           <div className="border-b border-gray-200">
//             <nav className="-mb-px flex space-x-8">
//               <button
//                 onClick={() => setActiveTab("leads")}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "leads"
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 All Leads
//               </button>
//               <button
//                 onClick={() => setActiveTab("followups")}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "followups"
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Today's Follow-ups ({todayFollowups.length})
//               </button>
//             </nav>
//           </div>
//         </div>

//         {activeTab === "leads" && (
//           <div>
//             {/* Search and Filter */}
//             <div className="mb-6 flex flex-col sm:flex-row gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <input
//                   type="text"
//                   placeholder="Search leads..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div className="relative">
//                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="all">All Status</option>
//                   {statuses.map((status) => (
//                     <option key={status} value={status}>
//                       {status}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Leads Table */}
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Lead Name
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Mobile
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Source
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Assigned To
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Last Follow-up
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Next Follow-up
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredLeads.map((lead) => (
//                       <tr key={lead.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">{lead.fullName || lead.full_name}</div>
//                               <div className="text-sm text-gray-500">{lead.companyName || lead.company}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.mobile}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {lead.leadSource || lead.source}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}
//                           >
//                             {lead.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {lead.assignedTo || lead.assigned_to}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {lead.lastFollowup || lead.last_followup || "–"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center space-x-1">
//                             <span className="text-sm text-gray-900">{lead.nextFollowup || lead.next_followup}</span>
//                             <span className={`text-xs ${getPriorityColor(lead.priority)}`}>●</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex items-center space-x-2">
//                             <button onClick={() => setSelectedLead(lead)} className="text-blue-600 hover:text-blue-900">
//                               <Eye className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => updateLeadMutation.mutate(lead)}
//                               className="text-green-600 hover:text-green-900"
//                               disabled={updateLeadMutation.isLoading}
//                             >
//                               <Edit className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => updateStatusMutation.mutate({ leadId: lead.id, status: "Follow-up" })}
//                               className="text-purple-600 hover:text-purple-900"
//                               disabled={updateStatusMutation.isLoading}
//                             >
//                               <RefreshCw className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "followups" && (
//           <div className="bg-white rounded-lg shadow">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-900">Today's Follow-ups</h3>
//               <p className="text-sm text-gray-500">Quick-access list of today's due follow-ups</p>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Lead
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Mobile
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Follow-up Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Assigned To
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {todayFollowups.map((lead) => (
//                     <tr key={lead.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {lead.fullName || lead.full_name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.mobile}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}
//                         >
//                           {lead.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Today</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {lead.assignedTo || lead.assigned_to}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs hover:bg-green-200">
//                             <Phone className="h-3 w-3 inline mr-1" />
//                             Call
//                           </button>
//                           <button className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200">
//                             <MessageSquare className="h-3 w-3 inline mr-1" />
//                             WhatsApp
//                           </button>
//                           <button
//                             onClick={() => updateStatusMutation.mutate({ leadId: lead.id, status: "Contacted" })}
//                             className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs hover:bg-gray-200"
//                             disabled={updateStatusMutation.isLoading}
//                           >
//                             Update
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add Lead Modal */}
//       {/* Lead Detail Modal */}
//       {selectedLead && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-7xl w-full h-[700px] overflow-y-auto">
//             <div className="flex justify-between items-center p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-900">{selectedLead.fullName || selectedLead.full_name}</h2>
//               <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Lead Detail Tabs */}
//             <div className="border-b border-gray-200">
//               <nav className="flex space-x-8 px-6">
//                 {[
//                   { id: "info", label: "🔹 Lead Info", icon: User },
//                   { id: "notes", label: "📝 Notes & Comments", icon: FileText },
//                   { id: "followup", label: "📞 Follow-up History", icon: History },
//                   { id: "logs", label: "📤 WhatsApp & Email Logs", icon: Mail },
//                   { id: "conversion", label: "🔁 Conversion History", icon: RotateCcw },
//                 ].map((tab) => (
//                   <button
//                     key={tab.id}
//                     onClick={() => setLeadDetailTab(tab.id)}
//                     className={`py-3 px-1 border-b-2 font-medium text-sm ${
//                       leadDetailTab === tab.id
//                         ? "border-blue-500 text-blue-600"
//                         : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                     }`}
//                   >
//                     {tab.label}
//                   </button>
//                 ))}
//               </nav>
//             </div>

//             <div className="p-6">
//               {leadDetailTab === "info" && (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
//                       <div className="space-y-3">
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Full Name</label>
//                           <p className="text-sm text-gray-900">{selectedLead.fullName || selectedLead.full_name}</p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Mobile</label>
//                           <p className="text-sm text-gray-900">{selectedLead.mobile}</p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Email</label>
//                           <p className="text-sm text-gray-900">{selectedLead.email || "Not provided"}</p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Company</label>
//                           <p className="text-sm text-gray-900">
//                             {selectedLead.companyName || selectedLead.company || "Not provided"}
//                           </p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Location</label>
//                           <p className="text-sm text-gray-900">
//                             {selectedLead.cityState || selectedLead.city_state || "Not provided"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Details</h3>
//                       <div className="space-y-3">
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Source</label>
//                           <p className="text-sm text-gray-900">{selectedLead.leadSource || selectedLead.source}</p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Status</label>
//                           <span
//                             className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLead.status)}`}
//                           >
//                             {selectedLead.status}
//                           </span>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Priority</label>
//                           <p className={`text-sm font-medium ${getPriorityColor(selectedLead.priority)}`}>
//                             {selectedLead.priority}
//                           </p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Assigned To</label>
//                           <p className="text-sm text-gray-900">{selectedLead.assignedTo || selectedLead.assigned_to}</p>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Interested In</label>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             {(selectedLead.interestedIn || selectedLead.interested_in?.split(", ") || []).map(
//                               (interest) => (
//                                 <span
//                                   key={interest}
//                                   className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
//                                 >
//                                   {interest}
//                                 </span>
//                               ),
//                             )}
//                           </div>
//                         </div>
//                         <div>
//                           <label className="text-sm font-medium text-gray-500">Budget Range</label>
//                           <p className="text-sm text-gray-900">
//                             {selectedLead.budgetRange || selectedLead.budget_range || "Not specified"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {selectedLead.notes && (
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
//                       <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedLead.notes}</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {leadDetailTab === "notes" && (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <h3 className="text-lg font-medium text-gray-900">Notes & Comments</h3>
//                     <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
//                       Add Note
//                     </button>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="bg-gray-50 p-4 rounded">
//                       <div className="flex justify-between items-start mb-2">
//                         <span className="font-medium text-sm text-gray-900">Priya</span>
//                         <span className="text-xs text-gray-500">2 Aug, 2:30 PM</span>
//                       </div>
//                       <p className="text-sm text-gray-700">
//                         Initial contact made. Client interested in e-commerce solution.
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded">
//                       <div className="flex justify-between items-start mb-2">
//                         <span className="font-medium text-sm text-gray-900">Priya</span>
//                         <span className="text-xs text-gray-500">1 Aug, 4:15 PM</span>
//                       </div>
//                       <p className="text-sm text-gray-700">Sent initial proposal. Waiting for feedback.</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {leadDetailTab === "followup" && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium text-gray-900">Follow-up History</h3>
//                   <div className="space-y-3">
//                     <div className="flex items-start space-x-3 p-3 bg-green-50 rounded">
//                       <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
//                       <div className="flex-1">
//                         <div className="flex justify-between items-start">
//                           <span className="font-medium text-sm text-gray-900">Call Completed</span>
//                           <span className="text-xs text-gray-500">2 Aug, 3:00 PM</span>
//                         </div>
//                         <p className="text-sm text-gray-600">Discussed requirements and budget</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded">
//                       <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
//                       <div className="flex-1">
//                         <div className="flex justify-between items-start">
//                           <span className="font-medium text-sm text-gray-900">Follow-up Scheduled</span>
//                           <span className="text-xs text-gray-500">5 Aug, 10:00 AM</span>
//                         </div>
//                         <p className="text-sm text-gray-600">Demo presentation scheduled</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {leadDetailTab === "logs" && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium text-gray-900">Communication Logs</h3>
//                   <div className="space-y-3">
//                     <div className="flex items-start space-x-3 p-3 border rounded">
//                       <MessageSquare className="h-5 w-5 text-green-600 mt-0.5" />
//                       <div className="flex-1">
//                         <div className="flex justify-between items-start">
//                           <span className="font-medium text-sm text-gray-900">WhatsApp Message Sent</span>
//                           <span className="text-xs text-gray-500">2 Aug, 2:45 PM</span>
//                         </div>
//                         <p className="text-sm text-gray-600">Initial introduction and service overview</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start space-x-3 p-3 border rounded">
//                       <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
//                       <div className="flex-1">
//                         <div className="flex justify-between items-start">
//                           <span className="font-medium text-sm text-gray-900">Email Sent</span>
//                           <span className="text-xs text-gray-500">1 Aug, 5:00 PM</span>
//                         </div>
//                         <p className="text-sm text-gray-600">Proposal document shared</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {leadDetailTab === "conversion" && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium text-gray-900">Conversion History</h3>
//                   <div className="space-y-3">
//                     <div className="p-4 border rounded">
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="font-medium text-gray-900">Lead Created</span>
//                         <span className="text-sm text-gray-500">30 Jul, 2024</span>
//                       </div>
//                       <div className="text-sm text-gray-600">Lead generated from Facebook Ads campaign</div>
//                     </div>
//                     <div className="p-4 border rounded">
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="font-medium text-gray-900">First Contact</span>
//                         <span className="text-sm text-gray-500">1 Aug, 2024</span>
//                       </div>
//                       <div className="text-sm text-gray-600">Initial phone call made</div>
//                     </div>
//                     <div className="p-4 border rounded">
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="font-medium text-gray-900">Proposal Sent</span>
//                         <span className="text-sm text-gray-500">2 Aug, 2024</span>
//                       </div>
//                       <div className="text-sm text-gray-600">Detailed proposal shared via email</div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
