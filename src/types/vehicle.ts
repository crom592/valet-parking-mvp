export interface Vehicle {
  id: string;
  plateNumber: string;
  keyLocation: string;
  parkingSpot: string;
  status: 'parked' | 'retrieved';
  checkedInAt: string;
  checkedOutAt?: string;
  notes?: string;
}
