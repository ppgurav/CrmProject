// import React, { useState } from 'react';
// import { z } from 'zod';
// import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

// // Zod schema for filters
// const filterSchema = z.object({
//   fromDate: z.string().optional(),
//   toDate: z.string().optional(),
//   vendor: z.string().optional(),
//   billType: z.string().optional(),
//   paymentStatus: z.string().optional(),
//   search: z.string().optional()
// });

// // Sample data
// const invoicesData = [
//   {
//     id: 1,
//     invoiceNumber: 'INV-2025-511',
//     invoiceDate: '2025-08-08',
//     poNumber: 'PO-2023-001',
//     billType: 'Services',
//     vendorName: 'ABC Pvt Ltd',
//     vendorGSTIN: '29ABCDE1234F1Z5',
//     totalAmount: 29500,
//     paidAmount: 29500,
//     balanceAmount: 0,
//     paymentStatus: 'Paid',
//     paymentDate: '2025-08-10'
//   },
//   {
//     id: 2,
//     invoiceNumber: 'INV-2025-520',
//     invoiceDate: '2025-08-05',
//     poNumber: '',
//     billType: 'Goods',
//     vendorName: 'XYZ Traders',
//     vendorGSTIN: '29XYZDE5678G1Z9',
//     totalAmount: 15000,
//     paidAmount: 0,
//     balanceAmount: 15000,
//     paymentStatus: 'Unpaid',
//     paymentDate: ''
//   },
//   {
//     id: 3,
//     invoiceNumber: 'INV-2025-525',
//     invoiceDate: '2025-08-04',
//     poNumber: 'PO-2023-008',
//     billType: 'Goods',
//     vendorName: 'LMN Corp',
//     vendorGSTIN: '29LMNOP9876H1Z1',
//     totalAmount: 20000,
//     paidAmount: 12000,
//     balanceAmount: 8000,
//     paymentStatus: 'Partial',
//     paymentDate: '2025-08-06'
//   }
// ];

// const AllInvoiceTable = () => {
//   const [filters, setFilters] = useState({
//     fromDate: '',
//     toDate: '',
//     vendor: '',
//     billType: '',
//     paymentStatus: '',
//     search: ''
//   });

//   const [selected, setSelected] = useState([]);

//   // Handle filter change
//   const handleChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   // Handle bulk selection
//   const toggleSelect = (id) => {
//     setSelected(prev =>
//       prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
//     );
//   };

//   // Filter invoices based on filters state
//   const filteredInvoices = invoicesData.filter(inv => {
//     const matchesSearch =
//       !filters.search ||
//       inv.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
//       inv.vendorName.toLowerCase().includes(filters.search.toLowerCase());
//     const matchesStatus =
//       !filters.paymentStatus || inv.paymentStatus === filters.paymentStatus;
//     return matchesSearch && matchesStatus;
//   });

//   // Get status badge styles and icon
//   const getStatusBadge = (status) => {
//     if (status === 'Paid') return { color: 'bg-green-100 text-green-800', Icon: CheckCircle };
//     if (status === 'Unpaid') return { color: 'bg-red-100 text-red-800', Icon: XCircle };
//     if (status === 'Partial') return { color: 'bg-orange-100 text-orange-800', Icon: Clock };
//     return { color: '', Icon: null };
//   };

//   return (
//     <div className="p-4 space-y-4">
//       {/* Filters */}
//       <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4">
//         <input type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} className="border p-2 rounded" />
//         <input type="date" name="toDate" value={filters.toDate} onChange={handleChange} className="border p-2 rounded" />
//         <input type="text" name="vendor" placeholder="Vendor" value={filters.vendor} onChange={handleChange} className="border p-2 rounded" />
//         <select name="billType" value={filters.billType} onChange={handleChange} className="border p-2 rounded">
//           <option value="">Bill Type</option>
//           <option value="Goods">Goods</option>
//           <option value="Services">Services</option>
//         </select>
//         <select name="paymentStatus" value={filters.paymentStatus} onChange={handleChange} className="border p-2 rounded">
//           <option value="">All Status</option>
//           <option value="Paid">Paid</option>
//           <option value="Unpaid">Unpaid</option>
//           <option value="Partial">Partial</option>
//         </select>
//         <input type="text" name="search" placeholder="Search Invoice..." value={filters.search} onChange={handleChange} className="border p-2 rounded flex-1" />
//       </div>

//       {/* Bulk Actions */}
//       {selected.length > 0 && (
//         <div className="bg-gray-100 p-2 rounded flex gap-4 items-center">
//           <span>{selected.length} selected</span>
//           <button className="bg-green-500 text-white px-3 py-1 rounded">Mark Paid</button>
//           <button className="bg-blue-500 text-white px-3 py-1 rounded">Export</button>
//           <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
//         </div>
//       )}

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse bg-white rounded shadow">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border">
//                 <input
//                   type="checkbox"
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelected(filteredInvoices.map(inv => inv.id));
//                     } else {
//                       setSelected([]);
//                     }
//                   }}
//                   checked={selected.length === filteredInvoices.length && filteredInvoices.length > 0}
//                 />
//               </th>
//               <th className="p-2 border">Invoice Number</th>
//               <th className="p-2 border">Invoice Date</th>
//               <th className="p-2 border">PO No.</th>
//               <th className="p-2 border">Bill Type</th>
//               <th className="p-2 border">Vendor Name</th>
//               <th className="p-2 border">Vendor GSTIN</th>
//               <th className="p-2 border">Total (₹)</th>
//               <th className="p-2 border">Paid (₹)</th>
//               <th className="p-2 border">Balance (₹)</th>
//               <th className="p-2 border">Status</th>
//               <th className="p-2 border">Payment Date</th>
//               <th className="p-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredInvoices.map(inv => {
//               const { color, Icon } = getStatusBadge(inv.paymentStatus);
//               const overdue = inv.paymentStatus === 'Unpaid' && new Date(inv.invoiceDate) < new Date();
//               return (
//                 <tr key={inv.id} className="hover:bg-gray-50">
//                   <td className="p-2 border">
//                     <input type="checkbox" checked={selected.includes(inv.id)} onChange={() => toggleSelect(inv.id)} />
//                   </td>
//                   <td className="p-2 border text-blue-600 cursor-pointer hover:underline">{inv.invoiceNumber}</td>
//                   <td className="p-2 border">{inv.invoiceDate}</td>
//                   <td className="p-2 border">{inv.poNumber || '—'}</td>
//                   <td className="p-2 border">{inv.billType}</td>
//                   <td className="p-2 border flex items-center gap-1">
//                     {inv.vendorName}
//                     {inv.paymentStatus === 'Paid' && <CheckCircle className="h-4 w-4 text-green-500" />}
//                   </td>
//                   <td className="p-2 border">{inv.vendorGSTIN}</td>
//                   <td className="p-2 border">{inv.totalAmount.toLocaleString()}</td>
//                   <td className="p-2 border">{inv.paidAmount.toLocaleString()}</td>
//                   <td className="p-2 border">{inv.balanceAmount.toLocaleString()}</td>
//                   <td className="p-2 border">
//                     <span className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-semibold rounded ${color}`}>
//                       {Icon && <Icon className="h-5 w-5 inline" />} {inv.paymentStatus}
//                     </span>
//                     {overdue && (
//                       <span className="ml-1 text-xs text-red-600 inline-flex items-center gap-1">
//                         <AlertTriangle className="h-4 w-4" /> overdue
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-2 border">{inv.paymentDate || '—'}</td>
//                   <td className="p-2 border space-x-2">
//                     <button className="text-blue-600 hover:underline">View</button>
//                     <button className="text-yellow-600 hover:underline">Edit</button>
//                     <button className="text-red-600 hover:underline">Delete</button>
//                     <button className="text-green-600 hover:underline">PDF</button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AllInvoiceTable;


import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { Search, FileText, CheckCircle, Clock, Plus, Download, Eye, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Zod schema for invoice validation
const invoiceSchema = z.object({
  id: z.number(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string(), // YYYY-MM-DD format
  purchaseOrderNo: z.string().optional().nullable(),
  billType: z.enum(["Goods", "Services"]),
  vendorName: z.string().min(1, "Vendor name is required"),
  vendorGSTIN: z.string().optional().nullable(),
  totalAmount: z.number().positive("Total amount must be positive"),
  paidAmount: z.number().min(0, "Paid amount cannot be negative"),
  balanceAmount: z.number().min(0, "Balance amount cannot be negative"),
  paymentStatus: z.enum(["Paid", "Unpaid", "Partial"]),
  paymentDate: z.string().optional().nullable(), // YYYY-MM-DD format
});

export default function AllInvoiceTable() {
  // Sample invoice data
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: "INV-2025-511",
      invoiceDate: "2025-08-08",
      purchaseOrderNo: "PO-2023-001",
      billType: "Services",
      vendorName: "ABC Pvt Ltd",
      vendorGSTIN: "27ABCDE1234F1Z5",
      totalAmount: 29500.0,
      paidAmount: 29500.0,
      balanceAmount: 0.0,
      paymentStatus: "Paid",
      paymentDate: "2025-08-10",
    },
    {
      id: 2,
      invoiceNumber: "INV-2025-520",
      invoiceDate: "2025-08-05",
      purchaseOrderNo: null,
      billType: "Goods",
      vendorName: "XYZ Traders",
      vendorGSTIN: "09XYZAB1234C1Z9",
      totalAmount: 15000.0,
      paidAmount: 0.0,
      balanceAmount: 15000.0,
      paymentStatus: "Unpaid",
      paymentDate: null,
    },
    {
      id: 3,
      invoiceNumber: "INV-2025-525",
      invoiceDate: "2025-08-04",
      purchaseOrderNo: "PO-2023-008",
      billType: "Goods",
      vendorName: "LMN Corp",
      vendorGSTIN: "33LMNPQ5678R1Z2",
      totalAmount: 20000.0,
      paidAmount: 12000.0,
      balanceAmount: 8000.0,
      paymentStatus: "Partial",
      paymentDate: "2025-08-06",
    },
    {
      id: 4,
      invoiceNumber: "INV-2025-530",
      invoiceDate: "2025-07-20", // Past due date for overdue example
      purchaseOrderNo: null,
      billType: "Services",
      vendorName: "PQR Solutions",
      vendorGSTIN: "07PQRST9876U1Z7",
      totalAmount: 5000.0,
      paidAmount: 0.0,
      balanceAmount: 5000.0,
      paymentStatus: "Unpaid",
      paymentDate: null,
    },
    {
      id: 5,
      invoiceNumber: "INV-2025-535",
      invoiceDate: "2025-08-01",
      purchaseOrderNo: "PO-2023-010",
      billType: "Goods",
      vendorName: "ABC Pvt Ltd",
      vendorGSTIN: "27ABCDE1234F1Z5",
      totalAmount: 10000.0,
      paidAmount: 10000.0,
      balanceAmount: 0.0,
      paymentStatus: "Paid",
      paymentDate: "2025-08-03",
    },
    {
      id: 6,
      invoiceNumber: "INV-2025-540",
      invoiceDate: "2025-08-07",
      purchaseOrderNo: null,
      billType: "Services",
      vendorName: "Tech Innovators",
      vendorGSTIN: "12ABCDE1234F1Z1",
      totalAmount: 7500.0,
      paidAmount: 2500.0,
      balanceAmount: 5000.0,
      paymentStatus: "Partial",
      paymentDate: "2025-08-07",
    },
  ]);

  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [billTypeFilter, setBillTypeFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Modal state
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null); // For single delete
  const [isBulkDelete, setIsBulkDelete] = useState(false); // To differentiate bulk vs single delete

  // Get unique vendors for dropdown
  const uniqueVendors = useMemo(() => {
    const vendors = new Set(invoices.map((inv) => inv.vendorName));
    return ["", ...Array.from(vendors).sort()];
  }, [invoices]);

  // Helper function to check if an invoice is overdue
  const isInvoiceOverdue = (invoiceDate, paymentStatus) => {
    if (paymentStatus !== "Unpaid") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const invDate = new Date(invoiceDate);
    invDate.setHours(0, 0, 0, 0); // Normalize to start of day
    return invDate < today;
  };

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    let filtered = invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.purchaseOrderNo && invoice.purchaseOrderNo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesVendor = !vendorFilter || invoice.vendorName === vendorFilter;
      const matchesBillType = !billTypeFilter || invoice.billType === billTypeFilter;
      const matchesPaymentStatus = !paymentStatusFilter || invoice.paymentStatus === paymentStatusFilter;

      const invoiceDate = new Date(invoice.invoiceDate);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const matchesDateRange =
        (!from || invoiceDate >= from) && (!to || invoiceDate <= to);

      return (
        matchesSearch &&
        matchesVendor &&
        matchesBillType &&
        matchesPaymentStatus &&
        matchesDateRange
      );
    });

    // Sort invoices
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        switch (sortColumn) {
          case "invoiceNumber":
            aValue = a.invoiceNumber.toLowerCase();
            bValue = b.invoiceNumber.toLowerCase();
            break;
          case "invoiceDate":
            aValue = new Date(a.invoiceDate);
            bValue = new Date(b.invoiceDate);
            break;
          case "purchaseOrderNo":
            aValue = (a.purchaseOrderNo || "").toLowerCase();
            bValue = (b.purchaseOrderNo || "").toLowerCase();
            break;
          case "billType":
            aValue = a.billType.toLowerCase();
            bValue = b.billType.toLowerCase();
            break;
          case "vendorName":
            aValue = a.vendorName.toLowerCase();
            bValue = b.vendorName.toLowerCase();
            break;
          case "totalAmount":
          case "paidAmount":
          case "balanceAmount":
            aValue = a[sortColumn];
            bValue = b[sortColumn];
            break;
          case "paymentStatus":
            aValue = a.paymentStatus.toLowerCase();
            bValue = b.paymentStatus.toLowerCase();
            break;
          case "paymentDate":
            aValue = a.paymentDate ? new Date(a.paymentDate) : new Date(0); // Handle null dates
            bValue = b.paymentDate ? new Date(b.paymentDate) : new Date(0);
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
  }, [
    invoices,
    searchTerm,
    fromDate,
    toDate,
    vendorFilter,
    billTypeFilter,
    paymentStatusFilter,
    sortColumn,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  // Helper functions
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Unpaid":
        return "bg-red-100 text-red-800";
      case "Partial":
        return "bg-orange-100 text-orange-800";
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
      setSelectedInvoices(currentInvoices.map((inv) => inv.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (id, checked) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, id]);
    } else {
      setSelectedInvoices(selectedInvoices.filter((invId) => invId !== id));
      setSelectAll(false);
    }
  };

  const viewInvoice = (id) => {
    const invoice = invoices.find((inv) => inv.id === id);
    setSelectedInvoice(invoice);
    setInvoiceModalOpen(true);
  };

  const deleteInvoice = (id) => {
    const invoice = invoices.find((inv) => inv.id === id);
    setInvoiceToDelete(invoice);
    setIsBulkDelete(false);
    setDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    setIsBulkDelete(true);
    setInvoiceToDelete(null); // Clear single invoice to delete
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (isBulkDelete) {
      setInvoices(invoices.filter((inv) => !selectedInvoices.includes(inv.id)));
      setSelectedInvoices([]);
      setSelectAll(false);
    } else if (invoiceToDelete) {
      setInvoices(invoices.filter((inv) => inv.id !== invoiceToDelete.id));
    }
    setDeleteModalOpen(false);
    setInvoiceToDelete(null);
    setIsBulkDelete(false);
  };

  const handleMarkPaid = () => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) => {
        if (selectedInvoices.includes(invoice.id)) {
          return {
            ...invoice,
            paymentStatus: "Paid",
            paidAmount: invoice.totalAmount,
            balanceAmount: 0,
            paymentDate: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD
          };
        }
        return invoice;
      })
    );
    setSelectedInvoices([]);
    setSelectAll(false);
  };

  const exportInvoices = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Invoice Number,Invoice Date,PO No.,Bill Type,Vendor Name,Vendor GSTIN,Total Amount (₹),Paid Amount (₹),Balance Amount (₹),Payment Status,Payment Date\n" +
      filteredInvoices
        .map(
          (inv) =>
            `"${inv.invoiceNumber}","${new Date(inv.invoiceDate).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}","${
              inv.purchaseOrderNo || ""
            }","${inv.billType}","${inv.vendorName}","${inv.vendorGSTIN || ""}","${formatCurrency(
              inv.totalAmount
            )}","${formatCurrency(inv.paidAmount)}","${formatCurrency(inv.balanceAmount)}","${
              inv.paymentStatus
            }","${inv.paymentDate ? new Date(inv.paymentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : ""}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invoices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate stats
  const totalInvoices = invoices.length;
  const paidInvoicesCount = invoices.filter((inv) => inv.paymentStatus === "Paid").length;
  const unpaidInvoicesCount = invoices.filter((inv) => inv.paymentStatus === "Unpaid").length;
  const partialInvoicesCount = invoices.filter((inv) => inv.paymentStatus === "Partial").length;
  const overdueInvoicesCount = invoices.filter((inv) => inv.paymentStatus === "Unpaid" && isInvoiceOverdue(inv.invoiceDate, inv.paymentStatus)).length;

  const totalPaidAmount = invoices.filter((inv) => inv.paymentStatus === "Paid").reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalUnpaidBalance = invoices.filter((inv) => inv.paymentStatus === "Unpaid").reduce((sum, inv) => sum + inv.balanceAmount, 0);
  const totalPartialBalance = invoices.filter((inv) => inv.paymentStatus === "Partial").reduce((sum, inv) => sum + inv.balanceAmount, 0);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, fromDate, toDate, vendorFilter, billTypeFilter, paymentStatusFilter]);

  const navigate = useNavigate()

  const handleAddInvoice = () => {
    navigate("/purchase/invoices/all")
  }
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6 ml-4 mr-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
          {/* Total Invoices */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-3xl font-bold text-gray-900">{totalInvoices}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+3</span> this month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          {/* Paid Invoices */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                <p className="text-3xl font-bold text-gray-900">{paidInvoicesCount}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">{formatCurrency(totalPaidAmount)}</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          {/* Unpaid Invoices */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unpaid Invoices</p>
                <p className="text-3xl font-bold text-gray-900">{unpaidInvoicesCount}</p>
                <p className="text-sm text-red-600 mt-1">
                  <span className="font-medium">{formatCurrency(totalUnpaidBalance)}</span> remaining
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          {/* Partial Invoices */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Partial Invoices</p>
                <p className="text-3xl font-bold text-gray-900">{partialInvoicesCount}</p>
                <p className="text-sm text-orange-600 mt-1">
                  <span className="font-medium">{formatCurrency(totalPartialBalance)}</span> remaining
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100 mb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 max-w-md min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search Invoice No., Vendor, Reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              {/* Date Range */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  aria-label="From Date"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  aria-label="To Date"
                />
              </div>
              {/* Vendor Filter */}
              <select
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-label="Filter by Vendor"
              >
                <option value="">All Vendors</option>
                {uniqueVendors.map((vendor) => (
                  <option key={vendor} value={vendor}>
                    {vendor || "N/A"}
                  </option>
                ))}
              </select>
              {/* Bill Type Filter */}
              <select
                value={billTypeFilter}
                onChange={(e) => setBillTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-label="Filter by Bill Type"
              >
                <option value="">All Bill Types</option>
                <option value="Goods">Goods</option>
                <option value="Services">Services</option>
              </select>
              {/* Payment Status Filter */}
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-label="Filter by Payment Status"
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              {selectedInvoices.length > 0 && (
                <>
                  <button
                    onClick={handleMarkPaid}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    Mark Paid
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    Delete Selected
                  </button>
                </>
              )}
              {/* <button
                onClick={exportInvoices}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                <Download className="inline-block w-5 h-5 mr-2" /> Export
              </button>
              <button
              onClick={handleAddInvoice}
                // onClick={() => alert("Add Invoice functionality not implemented in this demo.")}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Plus className="inline-block w-5 h-5 mr-2" /> Add Invoice
              </button> */}
            </div>
            
          </div>
          
        </div>
        
        <div className="flex justify-end items-center mb-3 w-full space-x-4">
  <button
    onClick={exportInvoices}
    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
  >
    <Download className="inline-block w-5 h-5 mr-2" /> Export
  </button>
  
  <button
    onClick={handleAddInvoice}
    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
  >
    <Plus className="inline-block w-5 h-5 mr-2" /> Add Invoice
  </button>
</div>
        {/* Invoice Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">All Invoices</h3>
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
                    onClick={() => handleSort("invoiceNumber")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Invoice Number
                  </th>
                  <th
                    onClick={() => handleSort("invoiceDate")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Invoice Date
                  </th>
                  <th
                    onClick={() => handleSort("purchaseOrderNo")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    PO No.
                  </th>
                  <th
                    onClick={() => handleSort("billType")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Bill Type
                  </th>
                  <th
                    onClick={() => handleSort("vendorName")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Vendor Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor GSTIN
                  </th>
                  <th
                    onClick={() => handleSort("totalAmount")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Total Amount (₹)
                  </th>
                  <th
                    onClick={() => handleSort("paidAmount")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Paid Amount (₹)
                  </th>
                  <th
                    onClick={() => handleSort("balanceAmount")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Balance Amount (₹)
                  </th>
                  <th
                    onClick={() => handleSort("paymentStatus")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Payment Status
                  </th>
                  <th
                    onClick={() => handleSort("paymentDate")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Payment Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={(e) => handleSelectInvoice(invoice.id, e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewInvoice(invoice.id)}
                        className="text-sm font-medium text-indigo-600 hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.purchaseOrderNo || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.billType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.vendorName}
                        </div>
                        {invoice.paymentStatus === "Paid" && (
                          <CheckCircle className="w-4 h-4 text-green-500 ml-2" title="Paid" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.vendorGSTIN || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(invoice.paidAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(invoice.balanceAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          invoice.paymentStatus
                        )}`}
                      >
                        {invoice.paymentStatus}
                        {invoice.paymentStatus === "Unpaid" &&
                          isInvoiceOverdue(invoice.invoiceDate, invoice.paymentStatus) && (
                            <span className="ml-1 text-red-800">
                              <AlertTriangle className="inline-block w-3 h-3" /> Overdue
                            </span>
                          )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.paymentDate
                        ? new Date(invoice.paymentDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewInvoice(invoice.id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert("Edit functionality not implemented in this demo.")}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteInvoice(invoice.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert("Download PDF functionality not implemented in this demo.")}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
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
                Showing <span>{startIndex + 1}</span> to{" "}
                <span>{Math.min(endIndex, filteredInvoices.length)}</span> of{" "}
                <span>{filteredInvoices.length}</span> entries
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
                  {Array.from({ length: totalPages }, (_, i) => {
                    const page = i + 1;
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
                    );
                  }).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
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
      {/* Invoice Details Modal */}
      {invoiceModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Invoice Details</h3>
                <button onClick={() => setInvoiceModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Invoice Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Invoice Number</label>
                      <p className="text-gray-900">{selectedInvoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Invoice Date</label>
                      <p className="text-gray-900">
                        {new Date(selectedInvoice.invoiceDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Purchase Order No.</label>
                      <p className="text-gray-900">{selectedInvoice.purchaseOrderNo || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bill Type</label>
                      <p className="text-gray-900">{selectedInvoice.billType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Status</label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          selectedInvoice.paymentStatus
                        )}`}
                      >
                        {selectedInvoice.paymentStatus}
                        {selectedInvoice.paymentStatus === "Unpaid" &&
                          isInvoiceOverdue(selectedInvoice.invoiceDate, selectedInvoice.paymentStatus) && (
                            <span className="ml-1 text-red-800">
                              <AlertTriangle className="inline-block w-3 h-3" /> Overdue
                            </span>
                          )}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Date</label>
                      <p className="text-gray-900">
                        {selectedInvoice.paymentDate
                          ? new Date(selectedInvoice.paymentDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Vendor Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vendor Name</label>
                      <p className="text-gray-900">{selectedInvoice.vendorName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vendor GSTIN</label>
                      <p className="text-gray-900">{selectedInvoice.vendorGSTIN || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Amount</label>
                      <p className="text-2xl font-bold text-indigo-600">{formatCurrency(selectedInvoice.totalAmount)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Paid Amount</label>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(selectedInvoice.paidAmount)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Balance Amount</label>
                      <p className="text-xl font-bold text-red-600">{formatCurrency(selectedInvoice.balanceAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => alert("Edit Invoice functionality not implemented in this demo.")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Edit Invoice
                </button>
                <button
                  onClick={() => alert("Download PDF functionality not implemented in this demo.")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setInvoiceModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isBulkDelete ? "Delete Selected Invoices" : "Delete Invoice"}
                  </h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {isBulkDelete
                    ? `${selectedInvoices.length} selected invoice(s)`
                    : invoiceToDelete?.invoiceNumber}
                </span>
                ? This will permanently remove the invoice(s) from the system.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
