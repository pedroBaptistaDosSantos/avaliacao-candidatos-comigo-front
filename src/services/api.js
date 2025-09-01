// services/api.js
const API_BASE_URL = 'http://localhost:3000/api';

export const apiService = {
  // Tickets
  getTickets: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  },

  createTicket: async (ticketData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ticketData)
    });
    return response;
  },

  deleteTicket: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  },

  // Autenticação
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    return response;
  }
};

export default apiService;