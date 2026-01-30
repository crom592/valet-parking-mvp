import { Vehicle } from '@/types/vehicle';

const STORAGE_KEY = 'valet-parking-vehicles';

export function getVehicles(): Vehicle[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveVehicles(vehicles: Vehicle[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
}

export function addVehicle(vehicle: Omit<Vehicle, 'id' | 'status' | 'checkedInAt'>): Vehicle {
  const vehicles = getVehicles();
  const newVehicle: Vehicle = {
    ...vehicle,
    id: crypto.randomUUID(),
    status: 'parked',
    checkedInAt: new Date().toISOString(),
  };
  vehicles.push(newVehicle);
  saveVehicles(vehicles);
  return newVehicle;
}

export function retrieveVehicle(id: string): Vehicle | null {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.id === id);
  if (index === -1) return null;
  
  vehicles[index] = {
    ...vehicles[index],
    status: 'retrieved',
    checkedOutAt: new Date().toISOString(),
  };
  saveVehicles(vehicles);
  return vehicles[index];
}

export function searchVehicle(plateNumber: string): Vehicle[] {
  const vehicles = getVehicles();
  const query = plateNumber.toLowerCase().replace(/\s/g, '');
  return vehicles.filter(v => 
    v.plateNumber.toLowerCase().replace(/\s/g, '').includes(query) &&
    v.status === 'parked'
  );
}

export function getParkedVehicles(): Vehicle[] {
  return getVehicles().filter(v => v.status === 'parked');
}

export function getStats() {
  const vehicles = getVehicles();
  const parked = vehicles.filter(v => v.status === 'parked').length;
  const retrieved = vehicles.filter(v => v.status === 'retrieved').length;
  return { parked, retrieved, total: vehicles.length };
}
