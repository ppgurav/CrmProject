// "use client"

// import { useState } from "react"

// export default function Dashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
//   const [analyticsSubmenuOpen, setAnalyticsSubmenuOpen] = useState(false)
//   const [projectsSubmenuOpen, setProjectsSubmenuOpen] = useState(false)
//   const [settingsSubmenuOpen, setSettingsSubmenuOpen] = useState(false)

//   const openSidebar = () => setSidebarOpen(true)
//   const closeSidebar = () => setSidebarOpen(false)

//   const toggleProfileDropdown = (e) => {
//     e.stopPropagation()
//     setProfileDropdownOpen(!profileDropdownOpen)
//   }

//   const toggleSubmenu = (submenu) => {
//     switch (submenu) {
//       case "analytics":
//         setAnalyticsSubmenuOpen(!analyticsSubmenuOpen)
//         setProjectsSubmenuOpen(false)
//         setSettingsSubmenuOpen(false)
//         break
//       case "projects":
//         setProjectsSubmenuOpen(!projectsSubmenuOpen)
//         setAnalyticsSubmenuOpen(false)
//         setSettingsSubmenuOpen(false)
//         break
//       case "settings":
//         setSettingsSubmenuOpen(!settingsSubmenuOpen)
//         setAnalyticsSubmenuOpen(false)
//         setProjectsSubmenuOpen(false)
//         break
//     }
//   }

//   const handleClickOutside = () => {
//     setProfileDropdownOpen(false)
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === "Escape") {
//       setProfileDropdownOpen(false)
//       setSidebarOpen(false)
//       setAnalyticsSubmenuOpen(false)
//       setProjectsSubmenuOpen(false)
//       setSettingsSubmenuOpen(false)
//     }
//   }

//   return (
//     <div
//       className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen"
//       onClick={handleClickOutside}
//       onKeyDown={handleKeyDown}
//     >
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl shadow-indigo-500/10 transform transition-transform duration-300 ease-in-out border-r border-gray-100 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//       >
//         {/* Sidebar Header */}
//         <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                 <path
//                   fillRule="evenodd"
//                   d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
//                   clipRule="evenodd"
//                 ></path>
//               </svg>
//             </div>
//             <span className="text-xl font-bold text-gray-900">Dashboard</span>
//           </div>
//           <button onClick={closeSidebar} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
//             <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//             </svg>
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="mt-6 px-3">
//           <div className="space-y-1">
//             {/* Dashboard */}
//             <a
//               href="#"
//               className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white group flex items-center px-3 py-3 text-sm font-medium rounded-xl"
//             >
//               <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
//                 ></path>
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
//                 ></path>
//               </svg>
//               Overview
//             </a>

//             {/* Analytics with submenu */}
//             <div className="relative">
//               <button
//                 onClick={() => toggleSubmenu("analytics")}
//                 className="w-full text-gray-700 hover:bg-gray-100 group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 justify-between"
//               >
//                 <div className="flex items-center">
//                   <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                     ></path>
//                   </svg>
//                   Analytics
//                 </div>
//                 <svg
//                   className={`w-4 h-4 transition-transform duration-200 ${analyticsSubmenuOpen ? "rotate-180" : ""}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </button>
//               <div className={`ml-6 mt-1 space-y-1 ${analyticsSubmenuOpen ? "block" : "hidden"}`}>
//                 <a
//                   href="#"
//                   className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V9a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z"
//                     ></path>
//                   </svg>
//                   Reports
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
//                     ></path>
//                   </svg>
//                   Statistics
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                     ></path>
//                   </svg>
//                   Real-time Data
//                 </a>
//               </div>
//             </div>

//             {/* Projects with submenu */}
//             <div className="relative">
//               <button
//                 onClick={() => toggleSubmenu("projects")}
//                 className="w-full text-gray-700 hover:bg-gray-100 group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 justify-between"
//               >
//                 <div className="flex items-center">
//                   <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
//                     ></path>
//                   </svg>
//                   Projects
//                   <span className="ml-auto mr-2 bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full">
//                     12
//                   </span>
//                 </div>
//                 <svg
//                   className={`w-4 h-4 transition-transform duration-200 ${projectsSubmenuOpen ? "rotate-180" : ""}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </button>
//               <div className={`ml-6 mt-1 space-y-1 ${projectsSubmenuOpen ? "block" : "hidden"}`}>
//                 <a
//                   href="#"
//                   className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                     ></path>
//                   </svg>
//                   Create New
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                     ></path>
//                   </svg>
//                   All Projects
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                     ></path>
//                   </svg>
//                   Favorites
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
//                     ></path>
//                   </svg>
//                   Archived
//                 </a>
//               </div>
//             </div>

//             {/* Team */}
//             <a
//               href="#"
//               className="text-gray-700 hover:bg-gray-100 group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200"
//             >
//               <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//                 ></path>
//               </svg>
//               Team
//             </a>

//             {/* Messages */}
//             <a
//               href="#"
//               className="text-gray-700 hover:bg-gray-100 group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200"
//             >
//               <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//                 ></path>
//               </svg>
//               Messages
//               <span className="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">3</span>
//             </a>

//             {/* Settings with submenu */}
//             <div className="relative">
//               <button
//                 onClick={() => toggleSubmenu("settings")}
//                 className="w-full text-gray-700 hover:bg-gray-100 group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 justify-between"
//               >
//                 <div className="flex items-center">
//                   <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//                     ></path>
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                     ></path>
//                   </svg>
//                   Settings
//                 </div>
//                 <svg
//                   className={`w-4 h-4 transition-transform duration-200 ${settingsSubmenuOpen ? "rotate-180" : ""}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </button>
//               <div className={`ml-6 mt-1 space-y-1 ${settingsSubmenuOpen ? "block" : "hidden"}`}>
//                 <a
//                   href="#"
//                   className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                     ></path>
//                   </svg>
//                   Profile
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                     ></path>
//                   </svg>
//                   Security
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M15 17h5l-5 5v-5zM10.07 2.82l3.93 3.93-3.93 3.93-3.93-3.93 3.93-3.93z"
//                     ></path>
//                   </svg>
//                   Notifications
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-1a2 2 0 114 0z"
//                     ></path>
//                   </svg>
//                   Integrations
//                 </a>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Section */}
//           <div className="mt-8 pt-6 border-t border-gray-200">
//             <a
//               href="#"
//               className="text-gray-700 hover:bg-gray-100 group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200"
//             >
//               <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 ></path>
//               </svg>
//               Help & Support
//             </a>
//           </div>
//         </nav>
//       </div>

//       {/* Sidebar Overlay */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeSidebar}></div>
//       )}

//       {/* Main Content */}
//       <div className="lg:pl-64">
//         {/* Top Navigation */}
//         <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
//           <div className="flex items-center justify-between h-16 px-6">
//             {/* Mobile menu button */}
//             <button onClick={openSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
//               <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
//               </svg>
//             </button>

//             {/* Page Title */}
//             <div className="flex-1 lg:flex-none">
//               <h1 className="text-2xl font-bold text-gray-900 ml-4 lg:ml-0">Overview</h1>
//             </div>

//             {/* Right side */}
//             <div className="flex items-center space-x-4">
//               {/* Search */}
//               <div className="hidden md:block relative">
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
//                 />
//                 <svg
//                   className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   ></path>
//                 </svg>
//               </div>

//               {/* Notifications */}
//               <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl relative">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M15 17h5l-5 5v-5zM10.07 2.82l3.93 3.93-3.93 3.93-3.93-3.93 3.93-3.93z"
//                   ></path>
//                 </svg>
//                 <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                   3
//                 </span>
//               </button>

//               {/* Profile Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={toggleProfileDropdown}
//                   className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
//                 >
//                   <img
//                     className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500"
//                     src="/placeholder.svg?height=32&width=32"
//                     alt="Profile"
//                   />
//                   <div className="hidden md:block text-left">
//                     <div className="text-sm font-medium text-gray-900">John Doe</div>
//                     <div className="text-xs text-gray-500">john@example.com</div>
//                   </div>
//                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                   </svg>
//                 </button>

//                 {/* Dropdown Menu */}
//                 {profileDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl shadow-indigo-500/10 border border-gray-100 z-50 animate-fade-in">
//                     <div className="p-4 border-b border-gray-100">
//                       <div className="flex items-center space-x-3">
//                         <img
//                           className="h-10 w-10 rounded-full object-cover"
//                           src="/placeholder.svg?height=40&width=40"
//                           alt="Profile"
//                         />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">John Doe</div>
//                           <div className="text-xs text-gray-500">john@example.com</div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="py-2">
//                       <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                           ></path>
//                         </svg>
//                         Your Profile
//                       </a>
//                       <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//                           ></path>
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                           ></path>
//                         </svg>
//                         Settings
//                       </a>
//                       <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                           ></path>
//                         </svg>
//                         Help Center
//                       </a>
//                       <div className="border-t border-gray-100 my-2"></div>
//                       <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
//                         <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                           ></path>
//                         </svg>
//                         Sign Out
//                       </a>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content Area */}
//         <main className="p-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {/* Total Users */}
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Users</p>
//                   <p className="text-3xl font-bold text-gray-900">12,345</p>
//                   <p className="text-sm text-green-600 mt-1">
//                     <span className="font-medium">+12%</span> from last month
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Revenue */}
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Revenue</p>
//                   <p className="text-3xl font-bold text-gray-900">$89,432</p>
//                   <p className="text-sm text-green-600 mt-1">
//                     <span className="font-medium">+8%</span> from last month
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Orders */}
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Orders</p>
//                   <p className="text-3xl font-bold text-gray-900">1,234</p>
//                   <p className="text-sm text-red-600 mt-1">
//                     <span className="font-medium">-3%</span> from last month
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Growth */}
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Growth</p>
//                   <p className="text-3xl font-bold text-gray-900">23.5%</p>
//                   <p className="text-sm text-green-600 mt-1">
//                     <span className="font-medium">+5%</span> from last month
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Charts and Tables Row */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             {/* Chart Card */}
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
//                 <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
//                   <option>Last 7 days</option>
//                   <option>Last 30 days</option>
//                   <option>Last 90 days</option>
//                 </select>
//               </div>
//               <div className="h-64 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl flex items-center justify-center">
//                 <p className="text-gray-500">Chart placeholder - Revenue data visualization</p>
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                     <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                     </svg>
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900">New order completed</p>
//                     <p className="text-xs text-gray-500">2 minutes ago</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                     <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       ></path>
//                     </svg>
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900">New user registered</p>
//                     <p className="text-xs text-gray-500">5 minutes ago</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
//                     <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                       ></path>
//                     </svg>
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900">Server maintenance scheduled</p>
//                     <p className="text-xs text-gray-500">1 hour ago</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Orders Table */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100">
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
//                 <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View all</button>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Order ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Customer
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   <tr className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12345</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Smith</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
//                         Completed
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$299.00</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 15, 2024</td>
//                   </tr>
//                   <tr className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12344</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sarah Johnson</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
//                         Pending
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$149.00</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 14, 2024</td>
//                   </tr>
//                   <tr className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#12343</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mike Davis</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
//                         Processing
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$89.00</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 13, 2024</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }


import { useState } from "react"

export default function Dashboard() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen">
      {/* Main Content Area */}
      <main className="p-6 lg:pl-0">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">12,345</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+12%</span> from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$89,432</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+8%</span> from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orders</p>
                <p className="text-3xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-red-600 mt-1">
                  <span className="font-medium">-3%</span> from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Growth */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth</p>
                <p className="text-3xl font-bold text-gray-900">23.5%</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">+5%</span> from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Chart Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-64 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Chart placeholder – visualization here</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { msg: "New order completed", time: "2 minutes ago", icon: "✔️" },
                { msg: "New user registered", time: "5 minutes ago", icon: "👤" },
                { msg: "Server maintenance scheduled", time: "1 hour ago", icon: "⚠️" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span>{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.msg}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/5 border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Order ID", "Customer", "Status", "Amount", "Date"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { id: "#12345", name: "John Smith", status: "Completed", amount: "$299.00", date: "Jan 15, 2024" },
                  { id: "#12344", name: "Sarah Johnson", status: "Pending", amount: "$149.00", date: "Jan 14, 2024" },
                  { id: "#12343", name: "Mike Davis", status: "Processing", amount: "$89.00", date: "Jan 13, 2024" },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          row.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : row.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
