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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:ml-55 h-screen">
        {/* Header stays fixed at the top */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable Outlet content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Container;

