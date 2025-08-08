import { useState } from "react"
import { User, DollarSign, MinusCircle, Clock, Check, X, Plus } from 'lucide-react'

export default function SalaryStructure() {
  const [formData, setFormData] = useState({
    structureName: "",
    employeeType: "",
    effectiveFrom: "",
    payFrequency: "",
    overtimeEligible: false,
    overtimeRate: "",
    lossOfPayRule: "",
    remarks: "",
  })

  const [earnings, setEarnings] = useState([
    { componentName: "", amountPercentage: "", calculationType: "", taxable: false },
  ])

  const [deductions, setDeductions] = useState([
    { componentName: "", amountPercentage: "", calculationType: "", deductionType: "" },
  ])

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleEarningsChange = (index, e) => {
    const { name, value, type, checked } = e.target
    const newEarnings = [...earnings]
    newEarnings[index][name] = type === "checkbox" ? checked : value
    setEarnings(newEarnings)
  }

  const addEarningRow = () => {
    setEarnings((prev) => [
      ...prev,
      { componentName: "", amountPercentage: "", calculationType: "", taxable: false },
    ])
  }

  const removeEarningRow = (index) => {
    setEarnings((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDeductionsChange = (index, e) => {
    const { name, value, type, checked } = e.target
    const newDeductions = [...deductions]
    newDeductions[index][name] = type === "checkbox" ? checked : value
    setDeductions(newDeductions)
  }

  const addDeductionRow = () => {
    setDeductions((prev) => [
      ...prev,
      { componentName: "", amountPercentage: "", calculationType: "", deductionType: "" },
    ])
  }

  const removeDeductionRow = (index) => {
    setDeductions((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}

    // Basic Information validation
    const requiredBasicFields = ["structureName", "employeeType", "effectiveFrom", "payFrequency"]
    requiredBasicFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required"
      }
    })

    // Earnings validation
    earnings.forEach((earning, index) => {
      if (!earning.componentName.trim()) {
        newErrors[`earningComponentName_${index}`] = "Component Name is required"
      }
      if (!earning.amountPercentage || isNaN(earning.amountPercentage)) {
        newErrors[`earningAmountPercentage_${index}`] = "Amount/Percentage is required and must be a number"
      }
      if (!earning.calculationType.trim()) {
        newErrors[`earningCalculationType_${index}`] = "Calculation Type is required"
      }
    })

    // Deductions validation
    deductions.forEach((deduction, index) => {
      if (!deduction.componentName.trim()) {
        newErrors[`deductionComponentName_${index}`] = "Component Name is required"
      }
      if (!deduction.amountPercentage || isNaN(deduction.amountPercentage)) {
        newErrors[`deductionAmountPercentage_${index}`] = "Amount/Percentage is required and must be a number"
      }
      if (!deduction.calculationType.trim()) {
        newErrors[`deductionCalculationType_${index}`] = "Calculation Type is required"
      }
      if (!deduction.deductionType.trim()) {
        newErrors[`deductionDeductionType_${index}`] = "Deduction Type is required"
      }
    })

    // Other Details validation
    if (formData.overtimeEligible && (!formData.overtimeRate || isNaN(formData.overtimeRate))) {
      newErrors.overtimeRate = "Overtime Rate is required if eligible and must be a number"
    }
    if (formData.lossOfPayRule && isNaN(formData.lossOfPayRule)) {
      newErrors.lossOfPayRule = "Loss of Pay Rule must be a number"
    }


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      alert("Salary Structure saved successfully!")
      console.log("Form Data:", formData)
      console.log("Earnings:", earnings)
      console.log("Deductions:", deductions)
    } else {
      alert("Please correct the errors in the form.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-full mx-auto p-6 bg-white bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen space-y-8 mb-8 mr-4 ml-4">
      {/* 1. Basic Information */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Structure Name */}
          <div>
            <label htmlFor="structureName" className="block text-sm font-medium text-gray-700 mb-2">
              Structure Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="structureName"
              name="structureName"
              value={formData.structureName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.structureName ? "border-red-500" : "border-gray-300"}`}
              placeholder="e.g., Standard Monthly Payroll"
            />
            {errors.structureName && <p className="mt-1 text-sm text-red-600">{errors.structureName}</p>}
          </div>
          {/* Employee Type */}
          <div>
            <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700 mb-2">
              Employee Type <span className="text-red-500">*</span>
            </label>
            <select
              id="employeeType"
              name="employeeType"
              value={formData.employeeType}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.employeeType ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select employee type</option>
              <option value="payroll">Payroll</option>
              <option value="intern">Intern</option>
              <option value="temporary">Temporary</option>
            </select>
            {errors.employeeType && <p className="mt-1 text-sm text-red-600">{errors.employeeType}</p>}
          </div>
          {/* Effective From */}
          <div>
            <label htmlFor="effectiveFrom" className="block text-sm font-medium text-gray-700 mb-2">
              Effective From <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="effectiveFrom"
              name="effectiveFrom"
              value={formData.effectiveFrom}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.effectiveFrom ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.effectiveFrom && <p className="mt-1 text-sm text-red-600">{errors.effectiveFrom}</p>}
          </div>
          {/* Pay Frequency */}
          <div>
            <label htmlFor="payFrequency" className="block text-sm font-medium text-gray-700 mb-2">
              Pay Frequency <span className="text-red-500">*</span>
            </label>
            <select
              id="payFrequency"
              name="payFrequency"
              value={formData.payFrequency}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.payFrequency ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select pay frequency</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
              <option value="hourly">Hourly</option>
            </select>
            {errors.payFrequency && <p className="mt-1 text-sm text-red-600">{errors.payFrequency}</p>}
          </div>
        </div>
      </div>

      {/* 2. Earnings */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Earnings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component Name <span className="text-red-500">*</span>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount / Percentage <span className="text-red-500">*</span>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calculation Type <span className="text-red-500">*</span>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxable?
                </th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {earnings.map((earning, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name="componentName"
                      value={earning.componentName}
                      onChange={(e) => handleEarningsChange(index, e)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`earningComponentName_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      placeholder="e.g., Basic"
                    />
                    {errors[`earningComponentName_${index}`] && <p className="mt-1 text-xs text-red-600">{errors[`earningComponentName_${index}`]}</p>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      name="amountPercentage"
                      value={earning.amountPercentage}
                      onChange={(e) => handleEarningsChange(index, e)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`earningAmountPercentage_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Amount/Percentage"
                    />
                    {errors[`earningAmountPercentage_${index}`] && <p className="mt-1 text-xs text-red-600">{errors[`earningAmountPercentage_${index}`]}</p>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <select
                      name="calculationType"
                      value={earning.calculationType}
                      onChange={(e) => handleEarningsChange(index, e)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`earningCalculationType_${index}`] ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">Select type</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="percent_basic">% of Basic</option>
                      <option value="percent_gross">% of Gross</option>
                    </select>
                    {errors[`earningCalculationType_${index}`] && <p className="mt-1 text-xs text-red-600">{errors[`earningCalculationType_${index}`]}</p>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      name="taxable"
                      checked={earning.taxable}
                      onChange={(e) => handleEarningsChange(index, e)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {earnings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEarningRow(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <button
            type="button"
            onClick={addEarningRow}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Earning
          </button>
        </div>
      </div>

      {/* 3. Deductions */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <MinusCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Deductions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component Name <span className="text-red-500">*</span>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount / Percentage <span className="text-red-500">*</span>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calculation Type <span className="text-red-500">*</span>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deduction Type <span className="text-red-500">*</span>
                </th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deductions.map((deduction, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name="componentName"
                      value={deduction.componentName}
                      onChange={(e) => handleDeductionsChange(index, e)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`deductionComponentName_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      placeholder="e.g., PF"
                    />
                    {errors[`deductionComponentName_${index}`] && <p className="mt-1 text-xs text-red-600">{errors[`deductionComponentName_${index}`]}</p>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      name="amountPercentage"
                      value={deduction.amountPercentage}
                      onChange={(e) => handleDeductionsChange(index, e)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`deductionAmountPercentage_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Amount/Percentage"
                    />
                    {errors[`deductionAmountPercentage_${index}`] && <p className="mt-1 text-xs text-red-600">{errors[`deductionAmountPercentage_${index}`]}</p>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <select
                      name="calculationType"
                      value={deduction.calculationType}
                      onChange={(e) => handleDeductionsChange(index, e)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`deductionCalculationType_${index}`] ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">Select type</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="percent">% of Gross</option>
                    </select>
                    {errors[`deductionCalculationType_${index}`] && <p className="mt-1 text-xs text-red-600">{errors[`deductionCalculationType_${index}`]}</p>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <select
                      name="deductionType"
                      value={deduction.deductionType}
                      onChange={(e) => handleDeductionsChange(index, e)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors[`deductionDeductionType_${index}`] ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">Select type</option>
                      <option value="statutory">Statutory</option>
                      <option value="other">Other</option>
                    </select>
                    {errors[`deductionDeductionType_${index}`] && <p className="mt-1 text-xs text-red-600">{errors[`deductionDeductionType_${index}`]}</p>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {deductions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDeductionRow(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <button
            type="button"
            onClick={addDeductionRow}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Deduction
          </button>
        </div>
      </div>

      {/* 4. Other Details */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Other Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overtime Eligible? */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="overtimeEligible"
              name="overtimeEligible"
              checked={formData.overtimeEligible}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="overtimeEligible" className="ml-2 block text-sm font-medium text-gray-700">
              Overtime Eligible?
            </label>
          </div>
          {/* Overtime Rate */}
          <div>
            <label htmlFor="overtimeRate" className="block text-sm font-medium text-gray-700  ">
              Overtime Rate (₹ per hour)
            </label>
            <input
              type="number"
              id="overtimeRate"
              name="overtimeRate"
              value={formData.overtimeRate}
              onChange={handleInputChange}
              disabled={!formData.overtimeEligible}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.overtimeRate ? "border-red-500" : "border-gray-300"} ${!formData.overtimeEligible ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="e.g., 150"
            />
            {errors.overtimeRate && <p className="mt-1 text-sm text-red-600">{errors.overtimeRate}</p>}
          </div>
          {/* Loss of Pay Rule */}
          <div>
            <label htmlFor="lossOfPayRule" className="block text-sm font-medium text-gray-700 mb-2">
              Loss of Pay Rule (Per Day Amount)
            </label>
            <input
              type="number"
              id="lossOfPayRule"
              name="lossOfPayRule"
              value={formData.lossOfPayRule}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.lossOfPayRule ? "border-red-500" : "border-gray-300"}`}
              placeholder="e.g., 500"
            />
            {errors.lossOfPayRule && <p className="mt-1 text-sm text-red-600">{errors.lossOfPayRule}</p>}
          </div>
        </div>
      </div>

      {/* 5. Submit Section */}
      <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center"
          >
            <Check className="w-5 h-5 mr-2" /> Save Structure
          </button>
        </div>
      </div>
    </form>
  )
}
