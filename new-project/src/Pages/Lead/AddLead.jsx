import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const leadSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  mobile: z.string().min(1, 'Mobile is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  companyName: z.string().optional(),
  cityState: z.string().optional(),
  leadSource: z.string().min(1, 'Lead Source is required'),
  interestedIn: z.array(z.string()).min(1, 'Select at least one interest'),
  budgetRange: z.string().optional(),
  notes: z.string().optional(),
  assignedTo: z.string().min(1, 'Assigned To is required'),
  nextFollowup: z.string().min(1, 'Next Follow-up is required'),
  priority: z.string().min(1, 'Priority is required'),
});


const AddLead = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    companyName: '',
    cityState: '',
    leadSource: '',
    interestedIn: [],
    budgetRange: '',
    notes: '',
    assignedTo: '',
    nextFollowup: '',
    priority: '',
    uploadFile: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'interestedIn') {
      const updatedInterests = checked
        ? [...formData.interestedIn, value]
        : formData.interestedIn.filter((item) => item !== value);
      setFormData({ ...formData, interestedIn: updatedInterests });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, uploadFile: e.target.files[0] });
  };

  const handleCancel = () => {
    navigate('/leadform');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      leadSchema.parse(formData);
      setErrors({});
      console.log('Form submitted:', formData);
      alert('Lead submitted!');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const interests = ['Domain', 'Hosting', 'Website', 'Email', 'WhatsApp Panel'];
  const leadSources = ['Website', 'WhatsApp', 'Referral', 'Cold Call', 'Social Media', 'Event / Exhibition'];
  const priorities = ['Low', 'Medium', 'High'];
  const employees = ['John Doe', 'Jane Smith', 'Alex Kim'];
  const budgets = ['Under 25k', '25k-50k', '50k-1L', '1L+'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow3xl rounded-3xl p-10 ]">
        <h2 className="text-4xl font-bold mb-10 text-center text-gray-800 drop-shadow">Add New Lead ✍️</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Full Name & Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Full Name {!formData.fullName && <span className="text-red-500">*</span>}
              </label>
              <input name="fullName" value={formData.fullName} onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-lg" />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Mobile {!formData.mobile && <span className="text-red-500">*</span>}
              </label>
              <input name="mobile" value={formData.mobile} onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-lg shadow-md focus:ring-4 focus:ring-indigo-300" />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
          </div>

          {/* Email & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input name="email" value={formData.email} onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-lg shadow-md " />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Company Name</label>
              <input name="companyName" value={formData.companyName} onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-lg shadow-md focus:ring-4 focus:ring-indigo-300" />
            </div>
          </div>

          {/* City & Lead Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">City, State</label>
              <input name="cityState" value={formData.cityState} onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-lg shadow-md" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Lead Source {!formData.leadSource && <span className="text-red-500">*</span>}
              </label>
              <select name="leadSource" value={formData.leadSource} onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-lg shadow-md ">
                <option value="">Select Source</option>
                {leadSources.map((src) => <option key={src} value={src}>{src}</option>)}
              </select>
              {errors.leadSource && <p className="text-red-500 text-sm mt-1">{errors.leadSource}</p>}
            </div>
          </div>

          {/* Interested In */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Interested In {!formData.interestedIn.length && <span className="text-red-500">*</span>}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {interests.map((interest) => (
                <label key={interest} className="flex items-center text-sm">
                  <input type="checkbox" name="interestedIn" value={interest}
                    checked={formData.interestedIn.includes(interest)}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded shadow" />
                  {interest}
                </label>
              ))}
            </div>
            {errors.interestedIn && <p className="text-red-500 text-sm mt-1">{errors.interestedIn}</p>}
          </div>

          {/* Budget & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Budget Range</label>
              <select name="budgetRange" value={formData.budgetRange} onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-lg shadow-md focus:ring-4 focus:ring-indigo-300">
                <option value="">Select Budget</option>
                {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Priority {!formData.priority && <span className="text-red-500">*</span>}
              </label>
              <select name="priority" value={formData.priority} onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-lg shadow-md focus:ring-4 focus:ring-indigo-300">
                <option value="">Select Priority</option>
                {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
            </div>
          </div>

          {/* Assigned To & Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Assigned To {!formData.assignedTo && <span className="text-red-500">*</span>}
              </label>
              <select name="assignedTo" value={formData.assignedTo} onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-lg shadow-md focus:ring-4 focus:ring-indigo-300">
                <option value="">Select Employee</option>
                {employees.map((emp) => <option key={emp} value={emp}>{emp}</option>)}
              </select>
              {errors.assignedTo && <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Next Follow-up Date {!formData.nextFollowup && <span className="text-red-500">*</span>}
              </label>
              <input type="date" name="nextFollowup" value={formData.nextFollowup} onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-lg shadow-md focus:ring-4 focus:ring-indigo-300" />
              {errors.nextFollowup && <p className="text-red-500 text-sm mt-1">{errors.nextFollowup}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-1">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleInputChange}
              rows={3} className="w-full border px-3 py-2 rounded-lg shadow-md focus:ring-4 focus:ring-indigo-300" />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold mb-1">Upload Visiting Card / Docs</label>
            <input type="file" name="uploadFile" onChange={handleFileUpload}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 hover:file:bg-gray-200 shadow-md" />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button onClick={handleCancel}
              type="reset"
              className="px-5 py-2 bg-gray-200 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition transform text-sm">
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:shadow-2xl hover:scale-105 transition transform text-sm">
              Submit Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLead;
