import React, { useState } from 'react';

const TicketForm = () => {
  const [ticket, setTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ticket),
      });

      if (response.ok) {
        // Limpar formulário
        setTicket({
          title: '',
          description: '',
          priority: 'medium',
        });
        alert('Ticket criado com sucesso!');
      } else if (response.status === 401) {
        alert('Sessão expirada. Faça login novamente.');
      } else {
        alert('Erro ao criar ticket');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Criar Novo Ticket</h2>
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

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
            Prioridade
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="priority"
            name="priority"
            value={ticket.priority}
            onChange={handleChange}
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
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