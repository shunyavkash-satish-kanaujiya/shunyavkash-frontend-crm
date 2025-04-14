import { useState, useEffect } from "react";
import { getOpenedTab, setOpenedTab } from "../../utils/openedTab";

export const useTab = () => {
  const [activeTab, setActiveTab] = useState(getOpenedTab);

  useEffect(() => {
    setOpenedTab(activeTab);
  }, [activeTab]);

  return { activeTab, setActiveTab };
};
