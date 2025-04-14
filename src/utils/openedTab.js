const TAB_KEY = "activeTab";

export const getOpenedTab = () => {
  return localStorage.getItem(TAB_KEY) || "Dashboard";
};

export const setOpenedTab = (tab) => {
  localStorage.setItem(TAB_KEY, tab);
};
