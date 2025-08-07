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
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:ml-57">
        {/* Fixed Header */}
        <div className="flex-shrink-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Container;
