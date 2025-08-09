// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { Outlet } from 'react-router-dom';

// const Container = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50 overflow-x-hidden">
//       {/* Sidebar - fixed, responsive */}
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       {/* Main content - pushed right on large screens */}
//       <div className="flex flex-col flex-1 lg:ml-55 md:ml-55">
//         <Header onMenuClick={() => setSidebarOpen(true)} />

//         <main className="flex-1 ">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Container;


import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Container = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="fixed lg:static inset-y-0 left-0 w-56 bg-white shadow-lg z-30 lg:z-auto"
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 lg:ml-56 min-h-screen min-w-0">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable Outlet container */}
        <main className="flex-1 overflow-auto overflow-x-auto  min-h-0">
          {/* min-h-0 + min-w-0 ensure flexbox allows shrinking and scrolling */}
          <div className="w-full h-full min-w-0 ">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Container;
