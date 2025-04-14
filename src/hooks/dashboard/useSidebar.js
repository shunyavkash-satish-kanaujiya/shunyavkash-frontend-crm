import { useState } from "react";

export const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  return { sidebarOpen, setSidebarOpen, openSubmenu, setOpenSubmenu };
};
