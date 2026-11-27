import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// Sidebar + page area. <Outlet /> is where the current page appears.
export default function Layout() {
  const [open, setOpen] = useState(false); // phone menu open or closed

  return (
    <div className="app-layout">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      <main className="main-content">
        <button className="menu-toggle" onClick={() => setOpen(!open)}>☰ Menu</button>
        <Outlet />
      </main>
    </div>
  );
}