import React, { useState, useEffect } from 'react';
import TicketForm from './TicketForm';
import TicketList from './TicketList';
import { authService } from '../services/auth';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      onLogout();
    }
  }, [onLogout]);

  // Verifica se user existe e tem as propriedades necessárias
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Erro: Usuário não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Tickets</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Olá, {user.name || user.email}</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {user.role || 'USER'}
            </span>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 font-medium rounded-md ${activeTab === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('list')}
              >
                Listar Tickets
              </button>
              <button
                className={`px-4 py-2 font-medium rounded-md ${activeTab === 'create' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('create')}
              >
                Criar Ticket
              </button>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {activeTab === 'list' ? 
              <TicketList userRole={user.role} /> : 
              <TicketForm />
            }
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;