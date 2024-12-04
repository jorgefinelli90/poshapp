export interface Event {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay: boolean;
  type: 'cita' | 'aniversario' | 'plan' | 'compra' | 'viaje';
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
