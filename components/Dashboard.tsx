import React from 'react';
import { InspectionRecord, InspectionStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Truck } from 'lucide-react';

interface Props {
  inspections: InspectionRecord[];
}

export const Dashboard: React.FC<Props> = ({ inspections }) => {
  // Stats Calculation
  const total = inspections.length;
  const issues = inspections.filter(i => i.results.some(r => r.status === InspectionStatus.NOK)).length;
  const clean = total - issues;

  // Data for Pie Chart
  const statusData = [
    { name: 'Sem Anomalias', value: clean },
    { name: 'Com Avarias', value: issues },
  ];
  const COLORS = ['#22c55e', '#ef4444'];

  // Data for Bar Chart (Issues by Category)
  const categoryIssues: Record<string, number> = {};
  inspections.forEach(ins => {
    ins.results.forEach(res => {
      if (res.status === InspectionStatus.NOK) {
        categoryIssues[res.category] = (categoryIssues[res.category] || 0) + 1;
      }
    });
  });

  const barData = Object.keys(categoryIssues).map(key => ({
    name: key,
    issues: categoryIssues[key]
  }));

  if (total === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm">
        <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-500">Ainda não existem dados de inspeção.</h3>
        <p className="text-gray-400">Realize a primeira verificação para ver o dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Inspeções</p>
            <p className="text-2xl font-bold text-gray-800">{total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-green-100 rounded-full mr-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Aprovados</p>
            <p className="text-2xl font-bold text-gray-800">{clean}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-red-100 rounded-full mr-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Com Avarias</p>
            <p className="text-2xl font-bold text-gray-800">{issues}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Avarias por Categoria</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="issues" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Estado da Frota</h3>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Alerts Table */}
      {issues > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-red-50">
            <h3 className="text-lg font-semibold text-red-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alertas Recentes de Manutenção
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {inspections
              .filter(i => i.results.some(r => r.status === InspectionStatus.NOK))
              .slice(0, 5)
              .map(ins => (
                <div key={ins.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-800">Frota {ins.vehicle.fleetNumber}</span>
                    <span className="text-xs text-gray-500">{new Date(ins.date).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-1">
                    {ins.results
                      .filter(r => r.status === InspectionStatus.NOK)
                      .map((r, idx) => (
                        <div key={idx} className="text-sm text-red-600 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {r.category}: {r.label}
                        </div>
                      ))}
                  </div>
                  {ins.aiSummary && (
                    <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-600 italic border-l-2 border-yellow-500">
                      <strong>IA:</strong> {ins.aiSummary}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};