
import { useState } from "react"
import { z } from "zod"
import { User, Calendar, MessageCircle, FileText, Save } from "lucide-react"

const newFollowUpSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  companyName: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Mobile must be 10 digits")
    .optional()
    .or(z.literal("")),
  tags: z.enum(["Hot", "Warm", "Cold"], { required_error: "Select a tag" }),
  assignedTo: z.string().min(1, "Assigned user is required"),
  nextFollowUpDate: z.string().min(1, "Next follow-up date is required"),
  notes: z.string().optional().or(z.literal("")),
  whatsappReminder: z.boolean().default(false),
})

const STORAGE_KEY = "crm_followups"

function loadFollowUps() {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveFollowUps(items) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export default function AddFollowUp() {
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    mobile: "",
    tags: "",
    assignedTo: "Me",
    nextFollowUpDate: "",
    notes: "",
    whatsappReminder: false,
  })

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    const v = type === "checkbox" ? checked : value
    setFormData((prev) => ({ ...prev, [name]: v }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      companyName: "",
      email: "",
      mobile: "",
      tags: "",
      assignedTo: "Me",
      nextFollowUpDate: "",
      notes: "",
      whatsappReminder: false,
    })
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const parsed = newFollowUpSchema.safeParse({
      ...formData,
      whatsappReminder: !!formData.whatsappReminder,
    })
    if (!parsed.success) {
      const errs = {}
      parsed.error.issues.forEach((i) => {
        errs[i.path[0]] = i.message
      })
      setErrors(errs)
      return
    }

    // Simulate async save and persist to localStorage
    try {
      setSaving(true)
      await new Promise((r) => setTimeout(r, 200))

      const existing = loadFollowUps()
      const now = new Date()
      const fmt = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      const nextId = (existing.reduce((m, x) => Math.max(m, x.id || 0), 0) || 0) + 1
      const record = {
        id: nextId,
        fullName: parsed.data.fullName,
        companyName: parsed.data.companyName || "",
        email: parsed.data.email || "",
        mobile: parsed.data.mobile || "",
        tags: parsed.data.tags,
        assignedTo: parsed.data.assignedTo,
        nextFollowUpDate: parsed.data.nextFollowUpDate,
        notes: parsed.data.notes || "",
        whatsappReminder: !!parsed.data.whatsappReminder,
        status: "pending",
        createdAt: fmt(now),
        lastUpdatedAt: fmt(now),
      }

      saveFollowUps([...existing, record])
      alert("Follow-up saved successfully!")
      resetForm()
    } catch (err) {
      alert("Something went wrong while saving. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      <main className="p-6 ml-4 mr-4">
        <div className="max-w-full mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Contact & Assignment */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Contact & Assignment</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Company name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Mobile */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile (WhatsApp)
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                </div>

                {/* Tag */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tag <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select</option>
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                  </select>
                  {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
                </div>

                {/* Assigned To */}
                <div>
                  <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned To <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="Me">Me</option>
                    <option value="Alice">Alice</option>
                    <option value="Bob">Bob</option>
                  </select>
                  {errors.assignedTo && <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Schedule & Notes */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Schedule & Notes</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Next Follow-Up Date */}
                <div>
                  <label htmlFor="nextFollowUpDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Next Follow-Up Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="nextFollowUpDate"
                      name="nextFollowUpDate"
                      type="date"
                      value={formData.nextFollowUpDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.nextFollowUpDate && <p className="mt-1 text-sm text-red-600">{errors.nextFollowUpDate}</p>}
                </div>

                {/* WhatsApp Reminder */}
                <div className="flex items-center">
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="whatsappReminder"
                      checked={formData.whatsappReminder}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 inline-flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1 text-emerald-600" />
                      Enable WhatsApp reminder
                    </span>
                  </label>
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Context for your next follow-up..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Final Actions */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Final Actions</h2>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-60"
                >
                  <Save className="inline-block w-5 h-5 mr-2" />
                  {saving ? "Saving..." : "Save Follow-Up"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
