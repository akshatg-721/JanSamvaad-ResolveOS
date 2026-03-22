export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    register: "/api/auth/register",
    session: "/api/auth/session",
  },
  complaints: {
    list: "/api/complaints",
    byId: (id: string) => `/api/complaints/${id}`,
    status: (id: string) => `/api/complaints/${id}/status`,
    upvote: (id: string) => `/api/complaints/${id}/upvote`,
  },
  dashboard: {
    stats: "/api/admin/stats",
    analytics: "/api/analytics",
    activity: "/api/activity",
    tickets: "/api/tickets",
    ticketById: (id: string) => `/api/tickets/${id}`,
    ticketResolve: (id: string) => `/api/tickets/${id}/resolve`,
    ticketGenerateQr: (id: string) => `/api/tickets/${id}/generate-qr`,
  },
  users: {
    me: "/api/users/me",
    password: "/api/users/me/password",
  },
  upload: {
    list: "/api/upload",
    byId: (id: string) => `/api/upload/${id}`,
  },
} as const;
