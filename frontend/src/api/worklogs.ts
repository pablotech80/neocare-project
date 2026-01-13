import api from './axios';
import type {
  Worklog,
  CreateWorklogRequest,
  UpdateWorklogRequest,
  WeeklyWorklogsResponse
} from '../types/worklog';

// TODO: Cambiar USE_MOCK a false cuando el backend esté listo
const USE_MOCK = false;

// Mock data para desarrollo
let mockWorklogs: Worklog[] = [
  {
    id: 1,
    card_id: 1,
    user_id: 1,
    date: '2025-01-20',
    hours: 2.5,
    note: 'Diseño inicial de mockups en Figma',
    created_at: '2025-01-20T10:00:00',
    updated_at: '2025-01-20T10:00:00',
  },
  {
    id: 2,
    card_id: 1,
    user_id: 1,
    date: '2025-01-21',
    hours: 3.0,
    note: 'Revisión y ajustes del diseño',
    created_at: '2025-01-21T14:30:00',
    updated_at: '2025-01-21T14:30:00',
  },
  {
    id: 3,
    card_id: 2,
    user_id: 1,
    date: '2025-01-22',
    hours: 4.5,
    note: 'Implementación del formulario de login',
    created_at: '2025-01-22T09:15:00',
    updated_at: '2025-01-22T09:15:00',
  },
  {
    id: 4,
    card_id: 2,
    user_id: 1,
    date: '2025-01-23',
    hours: 1.5,
    note: null,
    created_at: '2025-01-23T16:00:00',
    updated_at: '2025-01-23T16:00:00',
  },
];
let mockIdCounter = 5;

// Helper para calcular el número de semana ISO
const getISOWeek = (date: Date): string => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-${String(weekNo).padStart(2, '0')}`;
};

// Helper para obtener fechas de una semana ISO
const getWeekDates = (weekStr: string): { start: Date; end: Date } => {
  const [year, week] = weekStr.split('-').map(Number);
  const jan4 = new Date(year, 0, 4);
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - (jan4.getDay() || 7) + 1 + (week - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return { start: weekStart, end: weekEnd };
};

// Crear worklog para una tarjeta
export const createWorklog = async (
  cardId: number,
  data: CreateWorklogRequest
): Promise<Worklog> => {
  if (USE_MOCK) {
    // Simular usuario actual (normalmente vendría del contexto de auth)
    const currentUserId = 1;

    const newWorklog: Worklog = {
      id: mockIdCounter++,
      card_id: cardId,
      user_id: currentUserId,
      date: data.date,
      hours: data.hours,
      note: data.note || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockWorklogs.push(newWorklog);
    return Promise.resolve(newWorklog);
  }
  const response = await api.post<Worklog>(`/cards/${cardId}/worklogs`, data);
  return response.data;
};

// Listar worklogs de una tarjeta
export const getCardWorklogs = async (cardId: number): Promise<Worklog[]> => {
  if (USE_MOCK) {
    return Promise.resolve(
      mockWorklogs
        .filter(w => w.card_id === cardId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }
  const response = await api.get<Worklog[]>(`/cards/${cardId}/worklogs`);
  return response.data;
};

// Editar worklog propio
export const updateWorklog = async (
  id: number,
  data: UpdateWorklogRequest
): Promise<Worklog> => {
  if (USE_MOCK) {
    const index = mockWorklogs.findIndex(w => w.id === id);
    if (index === -1) throw new Error('Worklog not found');

    // Simular validación de ownership (solo el autor puede editar)
    const currentUserId = 1;
    if (mockWorklogs[index].user_id !== currentUserId) {
      throw new Error('No tienes permiso para editar este worklog');
    }

    mockWorklogs[index] = {
      ...mockWorklogs[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return Promise.resolve(mockWorklogs[index]);
  }
  const response = await api.patch<Worklog>(`/worklogs/${id}`, data);
  return response.data;
};

// Eliminar worklog propio
export const deleteWorklog = async (id: number): Promise<void> => {
  if (USE_MOCK) {
    const index = mockWorklogs.findIndex(w => w.id === id);
    if (index === -1) throw new Error('Worklog not found');

    // Simular validación de ownership
    const currentUserId = 1;
    if (mockWorklogs[index].user_id !== currentUserId) {
      throw new Error('No tienes permiso para eliminar este worklog');
    }

    mockWorklogs = mockWorklogs.filter(w => w.id !== id);
    return Promise.resolve();
  }
  await api.delete(`/worklogs/${id}`);
};

// Obtener worklogs semanales del usuario autenticado
export const getWeeklyWorklogs = async (week?: string): Promise<WeeklyWorklogsResponse> => {
  if (USE_MOCK) {
    const currentUserId = 1;
    const targetWeek = week || getISOWeek(new Date());
    const { start, end } = getWeekDates(targetWeek);

    // Filtrar worklogs del usuario en la semana especificada
    const weekWorklogs = mockWorklogs.filter(w => {
      if (w.user_id !== currentUserId) return false;
      const worklogDate = new Date(w.date);
      return worklogDate >= start && worklogDate <= end;
    });

    // Calcular totales diarios
    const dailyTotals: Record<string, number> = {};
    weekWorklogs.forEach(w => {
      dailyTotals[w.date] = (dailyTotals[w.date] || 0) + w.hours;
    });

    // Calcular total semanal
    const totalWeekHours = weekWorklogs.reduce((sum, w) => sum + w.hours, 0);

    return Promise.resolve({
      week: targetWeek,
      total_week_hours: totalWeekHours,
      daily_totals: dailyTotals,
      worklogs: weekWorklogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    });
  }

  const queryParam = week ? `?week=${week}` : '';
  const response = await api.get<WeeklyWorklogsResponse>(`/users/me/worklogs${queryParam}`);
  return response.data;
};
