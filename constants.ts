import { Vehicle, VehicleType, AppConfig } from './types';

export const DEFAULT_VEHICLES: Vehicle[] = [
  { fleetNumber: '2401', licensePlate: 'AB-12-CD', type: VehicleType.BUS, station: 'Miraflores', model: 'MAN Lion\'s City', lastInspectionDate: '2023-10-25' },
  { fleetNumber: '2402', licensePlate: 'XY-99-ZZ', type: VehicleType.BUS, station: 'Musgueira', model: 'Mercedes Citaro', lastInspectionDate: '2023-10-26' },
  { fleetNumber: '505', licensePlate: 'EL-05-05', type: VehicleType.TRAM, station: 'Santo Amaro', model: 'Remodelado', lastInspectionDate: '2023-10-20' },
  { fleetNumber: '2983', licensePlate: 'CC-88-PP', type: VehicleType.BUS, station: 'Pontinha', model: 'Volvo B7R', lastInspectionDate: '' },
];

export const DEFAULT_CONFIG: AppConfig = {
  busChecklist: [
    { id: 'b1', category: 'Segurança', label: 'Travões (Teste Estático)' },
    { id: 'b2', category: 'Segurança', label: 'Luzes Exteriores (Médios/Piscas/Stop)' },
    { id: 'b3', category: 'Exterior', label: 'Espelhos Retrovisores' },
    { id: 'b4', category: 'Exterior', label: 'Limpa Pára-brisas' },
    { id: 'b5', category: 'Interior', label: 'Validadores de Bilhetes' },
    { id: 'b6', category: 'Interior', label: 'Limpeza Geral / Lixos' },
    { id: 'b7', category: 'Mecânica', label: 'Ruídos Anormais Motor' },
    { id: 'b8', category: 'Mecânica', label: 'Nível de Combustível/Bateria' },
    { id: 'b9', category: 'Segurança', label: 'Pneus (Estado/Pressão Visual)' },
    { id: 'b10', category: 'Interior', label: 'Sinalização de Paragem' },
  ],
  tramChecklist: [
    { id: 't1', category: 'Mecânica', label: 'Pantógrafo / Trolley' },
    { id: 't2', category: 'Segurança', label: 'Areneiros (Nível Areia)' },
    { id: 't3', category: 'Segurança', label: 'Travão de Via' },
    { id: 't4', category: 'Exterior', label: 'Luzes e Sinalização' },
    { id: 't5', category: 'Interior', label: 'Limpeza e Bancos' },
    { id: 't6', category: 'Mecânica', label: 'Rodados (Ruído Visual)' },
  ]
};