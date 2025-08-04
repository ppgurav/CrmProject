
import { useState } from "react"
import { z } from "zod"
import { Package, Tag, FileText, DollarSign, Receipt, Hash, Power } from "lucide-react"

const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productType: z.enum(["Product", "Service"], {
    required_error: "Product type is required",
  }),
  category: z.enum(["Domain", "Hosting", "Email", "Website"], {
    required_error: "Category is required",
  }),
  description: z.string().optional(),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  gstRate: z.enum(["0", "5", "12", "18", "28"], {
    required_error: "GST rate is required",
  }),
  hsnSacCode: z.string().min(6, "HSN/SAC code must be at least 6 digits"),
  activeStatus: z.enum(["Active", "Inactive"], {
    required_error: "Active status is required",
  }),
})

export default function ProductService() {
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    category: "",
    description: "",
    unitPrice: "",
    gstRate: "",
    hsnSacCode: "",
    activeStatus: "Active",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Convert unitPrice to number for validation
      const dataToValidate = {
        ...formData,
        unitPrice: formData.unitPrice ? Number.parseFloat(formData.unitPrice) : 0,
      }

      const validatedData = productSchema.parse(dataToValidate)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Form submitted successfully:", validatedData)
      alert("Product saved successfully!")

      // Reset form
      setFormData({
        productName: "",
        productType: "",
        category: "",
        description: "",
        unitPrice: "",
        gstRate: "",
        hsnSacCode: "",
        activeStatus: "Active",
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1> */}
            {/* <p className="text-gray-600">Fill in the details to add a new product to your inventory</p> */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 mr-2" />
                Product Name *
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange("productName", e.target.value)}
                placeholder="e.g., TickZap - 3 Year Panel"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.productName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.productName && <p className="mt-1 text-sm text-red-600">{errors.productName}</p>}
            </div>

            {/* Product Type */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 mr-2" />
                Product Type *
              </label>
              <select
                value={formData.productType}
                onChange={(e) => handleInputChange("productType", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.productType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select product type</option>
                <option value="Product">Product</option>
                <option value="Service">Service</option>
              </select>
              {errors.productType && <p className="mt-1 text-sm text-red-600">{errors.productType}</p>}
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
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select category</option>
                <option value="Domain">Domain</option>
                <option value="Hosting">Hosting</option>
                <option value="Email">Email</option>
                <option value="Website">Website</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
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
                value={formData.unitPrice}
                onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.unitPrice ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.unitPrice && <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>}
            </div>

            {/* GST Rate */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Receipt className="w-4 h-4 mr-2" />
                GST Rate (%) *
              </label>
              <select
                value={formData.gstRate}
                onChange={(e) => handleInputChange("gstRate", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.gstRate ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select GST rate</option>
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
              {errors.gstRate && <p className="mt-1 text-sm text-red-600">{errors.gstRate}</p>}
            </div>

            {/* HSN / SAC Code */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 mr-2" />
                HSN / SAC Code *
              </label>
              <input
                type="text"
                value={formData.hsnSacCode}
                onChange={(e) => handleInputChange("hsnSacCode", e.target.value)}
                placeholder="6+ digit GST classification code"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.hsnSacCode ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.hsnSacCode && <p className="mt-1 text-sm text-red-600">{errors.hsnSacCode}</p>}
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
                    value="Active"
                    checked={formData.activeStatus === "Active"}
                    onChange={(e) => handleInputChange("activeStatus", e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="activeStatus"
                    value="Inactive"
                    checked={formData.activeStatus === "Inactive"}
                    onChange={(e) => handleInputChange("activeStatus", e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Inactive</span>
                </label>
              </div>
              {errors.activeStatus && <p className="mt-1 text-sm text-red-600">{errors.activeStatus}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isSubmitting ? (
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
  )
}
