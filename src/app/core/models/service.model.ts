export interface ServiceDto {
  id: number;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}

export interface UpsertServiceRequest {
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}
