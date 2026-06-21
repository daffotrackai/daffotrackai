import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationDrawer from '../components/NavigationDrawer';
import PageTopBar from '../components/PageTopBar';

export default function MainLayout() {
  // ডেস্কটপের জন্য ডিফল্টভাবে ড্রয়ার ওপেন থাকবে, মোবাইলে ক্লোজ থাকবে
  const isDesktop = window.innerWidth >= 1024;
  const [drawerOpen, setDrawerOpen] = useState(isDesktop);
  const location = useLocation();

  // প্রফেশনাল টাচ: মোবাইলে কোনো রাউট/লিঙ্ক পরিবর্তন হলে স্বয়ংক্রিয়ভাবে ড্রয়ার ক্লোজ হয়ে যাবে
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setDrawerOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full bg-[#060e1a] text-white overflow-hidden relative">
      
      {/* Sidebar / Drawer */}
      <NavigationDrawer open={drawerOpen} setOpen={setDrawerOpen} />

      {/* Main Content Wrapper */}
      {/* lg:ml-[280px] এর মাধ্যমে ডেস্কটপে ড্রয়ার ওপেন থাকলে কন্টেন্ট ডানে সরে যাবে */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          drawerOpen ? 'lg:ml-[280px]' : 'ml-0'
        }`}
      >
        <PageTopBar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
        
        {/* Main content scrollable area */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <Outlet context={{ drawerOpen, setDrawerOpen }} />
        </main>
      </div>
    </div>
  );
}