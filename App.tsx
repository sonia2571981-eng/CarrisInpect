import React, { useState, useEffect } from 'react';
import { InspectionForm } from './components/InspectionForm';
import { Dashboard } from './components/Dashboard';
import { VehicleList } from './components/VehicleList';
import { ChecklistManager } from './components/ChecklistManager';
import { getInspections, exportInspectionsToExcel } from './services/dataService';
import { InspectionRecord } from './types';
import { ClipboardList, BarChart2, Settings, Download, Bus, Filter, X, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inspect' | 'dashboard' | 'fleet' | 'config'>('inspect');
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Filter State
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Load Data on Mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getInspections();
      setInspections(data);
    } catch (e) {
      console.error("Erro ao carregar dados", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectionSuccess = () => {
    setShowForm(false);
    loadData(); // Refresh data from DB
    setActiveTab('dashboard');
  };

  const handleExport = () => {
    exportInspectionsToExcel(inspections);
  };

  const clearFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
  };

  // Filter Logic
  const filteredInspections = inspections.filter(ins => {
    if (!filterStartDate && !filterEndDate) return true;
    const insDate = new Date(ins.date);
    const insTime = new Date(insDate.getFullYear(), insDate.getMonth(), insDate.getDate()).getTime();

    if (filterStartDate) {
      const startParts = filterStartDate.split('-');
      const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2])).getTime();
      if (insTime < startDate) return false;
    }

    if (filterEndDate) {
      const endParts = filterEndDate.split('-');
      const endDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2])).getTime();
      if (insTime > endDate) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-yellow-500 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">A carregar base de dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 pb-24 md:pb-8">
      {/* Navbar Desktop / Header Mobile */}
      <header className="bg-yellow-500 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white p-2 rounded-lg shadow-sm">
                <span className="font-bold text-lg md:text-xl tracking-tight text-gray-900">CARRIS<span className="text-yellow-500">Inspect</span></span>
              </div>
              {/* Desktop Nav */}
              <nav className="ml-8 hidden md:flex space-x-4">
                <button onClick={() => { setActiveTab('inspect'); setShowForm(false); }} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'inspect' ? 'bg-yellow-600 text-white' : 'text-yellow-900 hover:bg-yellow-400'}`}>Inspeções</button>
                <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-yellow-600 text-white' : 'text-yellow-900 hover:bg-yellow-400'}`}>Dashboard</button>
                <button onClick={() => setActiveTab('fleet')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'fleet' ? 'bg-yellow-600 text-white' : 'text-yellow-900 hover:bg-yellow-400'}`}>Frota</button>
                <button onClick={() => setActiveTab('config')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'config' ? 'bg-yellow-600 text-white' : 'text-yellow-900 hover:bg-yellow-400'}`}>Configurações</button>
              </nav>
            </div>
            <div>
               <button onClick={handleExport} className="bg-white text-yellow-600 hover:bg-gray-50 px-3 py-2 rounded-md text-xs md:text-sm font-medium shadow-sm flex items-center">
                 <Download className="w-4 h-4 mr-2" />
                 <span className="hidden md:inline">Exportar Relatório</span>
                 <span className="md:hidden">Exportar</span>
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-8">
        
        {activeTab === 'inspect' && (
          <div>
            {!showForm ? (
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">Histórico de Inspeções</h1>
                  <button onClick={() => setShowForm(true)} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-3 md:py-2 rounded-md shadow-md flex items-center justify-center transition-transform active:scale-95">
                    <ClipboardList className="w-5 h-5 mr-2" />
                    Nova Inspeção
                  </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex items-center text-gray-500 text-sm font-medium mr-2">
                    <Filter className="w-4 h-4 mr-2" />
                    <span className="md:hidden">Filtros:</span>
                    <span className="hidden md:inline">Filtrar por Data:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">De:</label>
                      <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Até:</label>
                      <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500" />
                    </div>
                  </div>
                  {(filterStartDate || filterEndDate) && (
                    <button onClick={clearFilters} className="text-red-500 hover:text-red-700 text-sm flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors md:ml-auto w-full md:w-auto justify-center">
                      <X className="w-4 h-4 mr-1" />
                      Limpar
                    </button>
                  )}
                </div>

                <div className="bg-white shadow overflow-hidden rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {filteredInspections.length === 0 ? (
                        <li className="px-6 py-12 text-center text-gray-500 flex flex-col items-center">
                            <ClipboardList className="w-12 h-12 text-gray-300 mb-2" />
                            <p>Nenhuma inspeção encontrada.</p>
                        </li>
                    ) : (
                        filteredInspections.map((ins) => (
                        <li key={ins.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <span className="text-base font-bold text-yellow-700">Frota {ins.vehicle.fleetNumber}</span>
                                {ins.results.some(r => r.status === 'NOK') ? (
                                    <span className="px-2 py-1 text-xs font-bold rounded bg-red-100 text-red-800 uppercase tracking-wide">Avaria</span>
                                ) : (
                                    <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800 uppercase tracking-wide">OK</span>
                                )}
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>{ins.vehicle.type}</span>
                                <span>{new Date(ins.date).toLocaleDateString()}</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                Inspetor: {ins.inspectorName}
                              </div>
                              
                              {ins.aiSummary && (
                                <div className="mt-1 p-2 bg-yellow-50 rounded text-xs text-gray-700 italic border-l-2 border-yellow-500">
                                  {ins.aiSummary}
                                </div>
                              )}
                            </div>
                        </li>
                        ))
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <InspectionForm onCancel={() => setShowForm(false)} onSuccess={handleInspectionSuccess} />
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
             <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Dashboard</h1>
             <Dashboard inspections={inspections} />
          </div>
        )}

        {activeTab === 'fleet' && (
          <div className="animate-fade-in">
            <VehicleList />
          </div>
        )}

        {activeTab === 'config' && (
          <div className="animate-fade-in">
            <ChecklistManager />
          </div>
        )}

      </main>

      {/* Mobile Bottom Navigation (Fixed) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <button onClick={() => { setActiveTab('inspect'); setShowForm(false); }} className={`flex flex-col items-center ${activeTab === 'inspect' ? 'text-yellow-600' : 'text-gray-400'}`}>
           <ClipboardList className="w-6 h-6" />
           <span className="text-[10px] mt-1 font-medium">Inspeções</span>
         </button>
         <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-yellow-600' : 'text-gray-400'}`}>
           <BarChart2 className="w-6 h-6" />
           <span className="text-[10px] mt-1 font-medium">Dash</span>
         </button>
         <button onClick={() => setActiveTab('fleet')} className={`flex flex-col items-center ${activeTab === 'fleet' ? 'text-yellow-600' : 'text-gray-400'}`}>
           <Bus className="w-6 h-6" />
           <span className="text-[10px] mt-1 font-medium">Frota</span>
         </button>
         <button onClick={() => setActiveTab('config')} className={`flex flex-col items-center ${activeTab === 'config' ? 'text-yellow-600' : 'text-gray-400'}`}>
           <Settings className="w-6 h-6" />
           <span className="text-[10px] mt-1 font-medium">Config</span>
         </button>
      </div>
    </div>
  );
};

export default App;