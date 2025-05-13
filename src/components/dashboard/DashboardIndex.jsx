import { useEffect } from "react";
import { useTab } from "../../hooks/dashboard/useTab";
import { TABS } from "../../constants/activeTab";
import { useNavigate } from "react-router-dom";

export const DashboardIndex = () => {
  const { setActiveTab } = useTab();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(TABS.DASHBOARD);
    // Ensure we're at the correct base URL
    if (!window.location.pathname.endsWith("/dashboard")) {
      navigate("/dashboard", { replace: true });
    }
  }, [setActiveTab, navigate]);

  return null;
};
