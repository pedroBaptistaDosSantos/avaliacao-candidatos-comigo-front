export const authService = {
  login: async (email, password) => {
     try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,    // Campo exato que a API espera
          password: password  // Campo exato que a API espera
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciais inválidas');
      }

      const data = await response.json();
      return data; // Retorna diretamente o que a API envia
      
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => localStorage.getItem('token'),
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setAuthData: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Verifica se o token é válido (implementação básica)
      // Em produção, você deve validar com sua API
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      return !isExpired;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }
};