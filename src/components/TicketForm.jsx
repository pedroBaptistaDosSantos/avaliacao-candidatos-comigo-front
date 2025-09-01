import React, { useState } from 'react';
import { authService } from '../services/auth';

const TicketForm = () => {
  const [ticket, setTicket] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM', // Padrão em maiúsculo
    category: 'Sistema', // Valor padrão
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!ticket.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!ticket.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (ticket.description.length < 10) newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const token = authService.getToken();
      const user = authService.getUser();
      
      // Dados no formato exigido pela API
      const ticketData = {
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority.toUpperCase(), // Garante maiúsculo
        category: ticket.category,
        userId: user.id, // Pega o ID do usuário logado
        status: 'OPEN' // Status padrão
      };

      console.log('Enviando ticket:', ticketData);

      const response = await fetch('http://localhost:3000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ticketData),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Limpar formulário
        setTicket({
          title: '',
          description: '',
          priority: 'MEDIUM',
          category: 'Sistema'
        });
        setSuccessMessage('Ticket criado com sucesso!');
      } else {
        throw new Error(responseData.message || 'Erro ao criar ticket');
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Criar Novo Ticket</h2>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {errors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Título *
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.title ? 'border-red-500' : ''}`}
            id="title"
            name="title"
            type="text"
            placeholder="Título do ticket"
            value={ticket.title}
            onChange={handleChange}
          />
          {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Descrição *
          </label>
          <textarea
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.description ? 'border-red-500' : ''}`}
            id="description"
            name="description"
            rows="4"
            placeholder="Descreva detalhadamente o problema ou solicitação"
            value={ticket.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Categoria *
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            name="category"
            value={ticket.category}
            onChange={handleChange}
          >
            <option value="Sistema">Sistema</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Rede">Rede</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
            Prioridade *
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="priority"
            name="priority"
            value={ticket.priority}
            onChange={handleChange}
          >
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Criando...' : 'Criar Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;