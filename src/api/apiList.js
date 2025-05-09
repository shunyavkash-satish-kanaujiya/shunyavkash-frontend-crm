export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/register",
    // REGISTER: "/auth/register",
    FETCH_USER: "/auth/me",
    FORGET_PASSWORD: "/auth/forgot-password",
    VERIFY_PASSWORD: "/auth/verify-password",
    RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
  },
  EMPLOYEES: {
    BASE: "/employee",
    CREATE: "/employee",
    UPDATE: (id) => `/employee/${id}`,
    DELETE: (id) => `/employee/${id}`,
    GET_ONE: (id) => `/employee/${id}`,

    REMOVE_TAG: (id) => `/employee/${id}`,
  },
  CLIENT: {
    BASE: "/client",
    CREATE: "/client",
    UPDATE: (id) => `/client/${id}`,
    DELETE: (id) => `/client/${id}`,
    // GET_ONE: (id) => `/clients/${id}`, // No Detailed Page
  },
  PROJECTS: {
    BASE: "/project",
    CREATE: "/project",
    UPDATE: (id) => `/project/${id}`,
    DELETE: (id) => `/project/${id}`,
    GET_ONE: (id) => `/project/${id}`,

    UPDATE_PROJECT_PRIORITY: (id) => `/project/${id}`,

    ARCHIVE_PROJECT: (id) => `/project/${id}/archive`,
    FETCH_ARCHIVED_PROJECTS: "/project/archived",
    RESTORE_ARCHIVED_PROJECT: (id) => `/project/${id}/archive`,

    ASSIGN_EMPLOYEE: (id) => `/project/${id}/assign`,
    REMOVE_ASSIGNED_EMPLOYEE: (id) => `/project/${id}/remove-employee`,
  },
  TIMESHEET: {
    BASE: "/timesheet",
    CREATE: "/timesheet",
    UPDATE: (id) => `/timesheet/${id}`,
    DELETE: (id) => `/timesheet/${id}`,
    GET_ONE: (id) => `/timesheet/${id}`,

    UPDATE_STATUS: (id) => `/timesheet/${id}`,
    FINALIZE_TIMESHEET: (id) => `/timesheet/${id}`,
    UPDATE_DESCRIPTION: (id) => `/timesheet/${id}`,
  },
  INVOICE: {
    BASE: "/invoice",
    CREATE: "/invoice",
    DELETE: (id) => `/invoice/${id}`,
    GET_ONE: (id) => `/invoice/${id}`,

    UPDATE_INVOICE_STATUS: (id) => `/invoice/${id}/status`,
    REGENERATE_PDF: (id) => `/invoice/${id}/regenerate`,
    SEND_INVOICE: (id) => `/invoice/${id}/send`,
  },
};
