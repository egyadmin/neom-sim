export interface Project {
  id: number;
  name: string;
  description?: string;
  branch: string;
  startDate: string;
  endDate?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface SimCard {
  id: number;
  number: string;
  serviceType: string;
  provider: 'STC' | 'Zain' | 'Mobily';
  monthlyCost: number;
  projectId: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  technicalFiles?: {
    dwg?: string;
    kmz?: string;
  };
}