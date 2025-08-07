// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { Outlet } from 'react-router-dom';

// const Container = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//       <div className="flex flex-col flex-1">
//         <Header onMenuClick={() => setSidebarOpen(true)} />
//         <main className="flex-1 bg-gray-50 p-6 lg:ml-64">
//   <Outlet />
// </main>

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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar - fixed, responsive */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content - pushed right on large screens */}
      <div className="flex flex-col flex-1 lg:ml-55">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Container;
