
import { useState, useEffect, useMemo } from "react";
import { Search, FileText, CheckCircle, Clock, Plus, Download, Eye, Edit, Trash2, X, AlertTriangle, PanelLeft, Mail } from 'lucide-react';


import PurchaseOrder from "./PurchaseOrder";
import Modal from "../../Component/Modal";
import { useNavigate } from "react-router-dom";

export default function PurchaseTable() {
  // Sample purchase order data
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 1,
      poNumber: "PO-2024-001",
      poDate: "2024-01-10",
      vendor: "CloudHost Solutions",
      vendorContactPerson: "Alice Smith",
      vendorMobileEmail: "9876543210 / alice@cloudhost.com",
      referenceNo: "REQ-001",
      deliveryDate: "2024-02-10",
      paymentTerms: "Net 30",
      purchaseType: "Services",
      items: [
        { productService: "Cloud Hosting (Standard)", description: "Standard cloud hosting package, 10GB SSD", hsnSacCode: "998314", quantity: 1, unitPrice: 12000, discount: 0, gst: 18 },
        { productService: "Domain Registration (1 year)", description: "Annual domain registration for .com", hsnSacCode: "998313", quantity: 1, unitPrice: 1500, discount: 0, gst: 18 },
      ],
      additionalNotes: "Urgent delivery required.",
      attachment: null,
      status: "approved",
    },
    {
      id: 2,
      poNumber: "PO-2024-002",
      poDate: "2024-01-15",
      vendor: "Hardware Hub Inc.",
      vendorContactPerson: "Bob Johnson",
      vendorMobileEmail: "9988776655 / bob@hardwarehub.com",
      referenceNo: "REQ-002",
      deliveryDate: "2024-02-15",
      paymentTerms: "Advance 50%",
      purchaseType: "Goods",
      items: [
        { productService: "Laptop (Dell XPS 15)", description: "Dell XPS 15, i7, 16GB RAM, 512GB SSD", hsnSacCode: "847130", quantity: 5, unitPrice: 85000, discount: 5, gst: 18 },
      ],
      additionalNotes: "",
      attachment: null,
      status: "pending",
    },
    {
      id: 3,
      poNumber: "PO-2024-003",
      poDate: "2024-01-20",
      vendor: "Software Innovations",
      vendorContactPerson: "Charlie Brown",
      vendorMobileEmail: "9123456789 / charlie@softwareinnovations.com",
      referenceNo: "REQ-003",
      deliveryDate: "2024-02-20",
      paymentTerms: "Net 45",
      purchaseType: "Services",
      items: [
        { productService: "IT Consulting Services", description: "Hourly IT consulting for network setup", hsnSacCode: "998311", quantity: 40, unitPrice: 1500, discount: 0, gst: 18 },
        { productService: "Microsoft Office 365 (Annual)", description: "Annual subscription for Microsoft Office 365 Business Standard", hsnSacCode: "998430", quantity: 10, unitPrice: 5000, discount: 0, gst: 18 },
      ],
      additionalNotes: "Project Alpha related.",
      attachment: null,
      status: "draft",
    },
    {
      id: 4,
      poNumber: "PO-2024-004",
      poDate: "2024-01-25",
      vendor: "CloudHost Solutions",
      vendorContactPerson: "Alice Smith",
      vendorMobileEmail: "9876543210 / alice@cloudhost.com",
      referenceNo: "REQ-004",
      deliveryDate: "2024-02-25",
      paymentTerms: "Net 15",
      purchaseType: "Services",
      items: [
        { productService: "Cloud Hosting (Standard)", description: "Standard cloud hosting package, 10GB SSD", hsnSacCode: "998314", quantity: 1, unitPrice: 12000, discount: 0, gst: 18 },
      ],
      additionalNotes: "",
      attachment: null,
      status: "rejected",
    },
    {
      id: 5,
      poNumber: "PO-2024-005",
      poDate: "2024-02-01",
      vendor: "Hardware Hub Inc.",
      vendorContactPerson: "Bob Johnson",
      vendorMobileEmail: "9988776655 / bob@hardwarehub.com",
      referenceNo: "REQ-005",
      deliveryDate: "2024-03-01",
      paymentTerms: "Net 30",
      purchaseType: "Goods",
      items: [
        { productService: "Laptop (Dell XPS 15)", description: "Dell XPS 15, i7, 16GB RAM, 512GB SSD", hsnSacCode: "847130", quantity: 2, unitPrice: 85000, discount: 0, gst: 18 },
      ],
      additionalNotes: "For new hires.",
      attachment: null,
      status: "completed",
    },
  ]);

  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedPOs, setSelectedPOs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPoForForm, setSelectedPoForForm] = useState(null); // For edit/view
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [poToDelete, setPoToDelete] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);


  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate item-wise totals (copied from PurchaseOrderForm for dashboard display)
  const calculateItemTotals = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const discount = parseFloat(item.discount) || 0;
    const gst = parseFloat(item.gst) || 0;

    const amountBeforeDiscount = quantity * unitPrice;
    const itemDiscountAmount = amountBeforeDiscount * (discount / 100);
    const amountAfterDiscount = amountBeforeDiscount - itemDiscountAmount;
    const itemGSTAmount = amountAfterDiscount * (gst / 100);
    const itemTotal = amountAfterDiscount + itemGSTAmount;

    return {
      amountBeforeDiscount,
      itemDiscountAmount,
      itemGSTAmount,
      itemTotal,
    };
  };

  // Calculate grand total for a single PO
  const calculatePoGrandTotal = (po) => {
    let grandTotal = 0;
    po.items.forEach(item => {
      grandTotal += calculateItemTotals(item).itemTotal;
    });
    return grandTotal;
  };

  // Filter and sort purchase orders
  const filteredPurchaseOrders = useMemo(() => {
    const filtered = purchaseOrders.filter((po) => {
      const matchesSearch =
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.vendorMobileEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || po.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort purchase orders
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        switch (sortColumn) {
          case "poNumber":
            aValue = a.poNumber.toLowerCase();
            bValue = b.poNumber.toLowerCase();
            break;
          case "vendor":
            aValue = a.vendor.toLowerCase();
            bValue = b.vendor.toLowerCase();
            break;
          case "poDate":
            aValue = new Date(a.poDate);
            bValue = new Date(b.poDate);
            break;
          case "deliveryDate":
            aValue = new Date(a.deliveryDate);
            bValue = new Date(b.deliveryDate);
            break;
          case "grandTotal":
            aValue = calculatePoGrandTotal(a);
            bValue = calculatePoGrandTotal(b);
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [purchaseOrders, searchTerm, statusFilter, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredPurchaseOrders.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentPurchaseOrders = filteredPurchaseOrders.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedPOs(currentPurchaseOrders.map((po) => po.id));
    } else {
      setSelectedPOs([]);
    }
  };

  const handleSelectPO = (id, checked) => {
    if (checked) {
      setSelectedPOs([...selectedPOs, id]);
    } else {
      setSelectedPOs(selectedPOs.filter((poId) => poId !== id));
      setSelectAll(false);
    }
  };

  const handleAddPurchaseOrder = () => {
    setSelectedPoForForm(null); // Clear any previous data for new PO
    setModalTitle("Add New Purchase Order");
    setIsReadOnlyMode(false);
    setIsFormModalOpen(true);
  };

  const handleEditPurchaseOrder = (id) => {
    const po = purchaseOrders.find((p) => p.id === id);
    setSelectedPoForForm(po);
    setModalTitle(`Edit Purchase Order: ${po.poNumber}`);
    setIsReadOnlyMode(false);
    setIsFormModalOpen(true);
  };

  const navigate = useNavigate();

  const handleAddOrder = () => {
    navigate('/purchase/purchase-order');
  };
  const handleViewPurchaseOrder = (id) => {
    const po = purchaseOrders.find((p) => p.id === id);
    setSelectedPoForForm(po);
    setModalTitle(`View Purchase Order: ${po.poNumber}`);
    setIsReadOnlyMode(true);
    setIsFormModalOpen(true);
  };

  const handleDeletePurchaseOrder = (id) => {
    const po = purchaseOrders.find((p) => p.id === id);
    setPoToDelete(po);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (poToDelete) {
      setPurchaseOrders(purchaseOrders.filter((po) => po.id !== poToDelete.id));
      setIsDeleteModalOpen(false);
      setPoToDelete(null);
    }
  };

  const handleSavePoForm = (formData, status) => {
    if (formData.id) {
      // Editing existing PO
      setPurchaseOrders(prev => prev.map(po =>
        po.id === formData.id ? { ...formData, status: status || po.status } : po
      ));
      alert("Purchase Order updated successfully!");
    } else {
      // Adding new PO
      const newPo = { ...formData, id: purchaseOrders.length + 1, status: status || 'draft' };
      setPurchaseOrders(prev => [...prev, newPo]);
      alert("Purchase Order added successfully!");
    }
    setIsFormModalOpen(false); // Close modal after save
  };

  const handleDownloadPDF = () => {
    alert("Downloading Purchase Order as PDF...");
    // Implement PDF generation logic here
  };

  const handleEmailToVendor = () => {
    alert("Sending Purchase Order as PDF to vendor...");
    // Implement email sending logic here
  };

  // Calculate stats
  const totalPOs = purchaseOrders.length;
  const approvedPOs = purchaseOrders.filter((po) => po.status === "approved").length;
  const pendingPOs = purchaseOrders.filter((po) => po.status === "pending").length;
  const draftPOs = purchaseOrders.filter((po) => po.status === "draft").length;
  const totalPoValue = purchaseOrders.filter((po) => po.status === "approved" || po.status === "completed").reduce((sum, po) => sum + calculatePoGrandTotal(po), 0);
  const pendingPoValue = purchaseOrders.filter((po) => po.status === "pending").reduce((sum, po) => sum + calculatePoGrandTotal(po), 0);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen p-6">
      {/* Main Content Area */}
      <main className="max-w-full mx-auto">
        {/* Page Title */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600 mt-2">Manage your purchase orders and track their status</p>
        </div> */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
          {/* Total POs */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total POs</p>
                <p className="text-3xl font-bold text-gray-900">{totalPOs}</p>
                <p className="text-sm text-green-600 mt-1"><span className="font-medium">+2</span> this month</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Approved POs */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-gray-900">{approvedPOs}</p>
                <p className="text-sm text-green-600 mt-1"><span className="font-medium">{formatCurrency(totalPoValue)}</span></p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Pending POs */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{pendingPOs}</p>
                <p className="text-sm text-yellow-600 mt-1"><span className="font-medium">{formatCurrency(pendingPoValue)}</span></p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Draft POs */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-3xl font-bold text-gray-900">{draftPOs}</p>
                <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Unsubmitted</span></p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-slate-400 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search purchase orders..."
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
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center"
              >
                <Download className="inline-block w-5 h-5 mr-2" /> Export
              </button>
              <button
                onClick={handleAddOrder}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center"
              >
                <Plus className="inline-block w-5 h-5 mr-2" /> Add Purchase Order
              </button>
            </div>
          </div>
        </div>

        {/* Purchase Order Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Purchase Orders</h3>
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
                  <th onClick={() => handleSort("poNumber")} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    PO Number<PanelLeft className="inline-block w-4 h-4 ml-1" /></th>
                  <th onClick={() => handleSort("vendor")} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Vendor<PanelLeft className="inline-block w-4 h-4 ml-1" /></th>
                  <th onClick={() => handleSort("poDate")} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    PO Date</th>
                  <th onClick={() => handleSort("deliveryDate")} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Delivery Date</th>
                  <th onClick={() => handleSort("grandTotal")} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Grand Total</th>
                  <th onClick={() => handleSort("status")} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPurchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPOs.includes(po.id)}
                        onChange={(e) => handleSelectPO(po.id, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{po.poNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{po.vendor.split(" ").map((n) => n[0]).join("")}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{po.vendor}</div>
                          <div className="text-sm text-gray-500">{po.vendorMobileEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(po.poDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(po.deliveryDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(calculatePoGrandTotal(po))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}
                      >
                        {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewPurchaseOrder(po.id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPurchaseOrder(po.id)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePurchaseOrder(po.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span>{startIndex + 1}</span> to <span>{Math.min(endIndex, filteredPurchaseOrders.length)}</span> of{" "}
                <span>{filteredPurchaseOrders.length}</span> entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous</button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 border rounded-lg ${page === currentPage
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                      >
                        {page}</button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Purchase Order Form Modal */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={modalTitle}>
        <PurchaseOrder
          initialData={selectedPoForForm}
          onSave={handleSavePoForm}
          onClose={() => setIsFormModalOpen(false)}
          readOnly={isReadOnlyMode}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && poToDelete && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
         <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Purchase Order</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete purchase order{" "}
                  <span className="font-semibold">{poToDelete.poNumber}</span>? This will permanently remove
                  the purchase order from the system.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel</button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
