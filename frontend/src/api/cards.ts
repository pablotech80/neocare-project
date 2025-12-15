import api from './axios';

export interface Card {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  status: 'pending' | 'in_progress' | 'done';
  list_id: number;
  board_id: number;
}

export interface CreateCardRequest {
  title: string;
  description?: string;
  due_date?: string;
  list_id: number;
  board_id: number;
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
  due_date?: string;
  status?: 'pending' | 'in_progress' | 'done';
  list_id?: number;
}

// TODO: Cambiar USE_MOCK a false cuando el backend esté listo
const USE_MOCK = true;

// Mock data para desarrollo
let mockCards: Card[] = [
  { id: 1, title: 'Diseñar mockups', description: 'Crear diseños en Figma', due_date: '2025-12-20', status: 'done', list_id: 1, board_id: 1 },
  { id: 2, title: 'Implementar login', description: 'Formulario de autenticación', due_date: '2025-12-18', status: 'in_progress', list_id: 2, board_id: 1 },
  { id: 3, title: 'Configurar base de datos', description: null, due_date: '2025-12-16', status: 'pending', list_id: 1, board_id: 1 },
  { id: 4, title: 'Testing E2E', description: 'Pruebas con Playwright', due_date: '2025-12-25', status: 'pending', list_id: 3, board_id: 1 },
];
let mockIdCounter = 5;

export const getCards = async (boardId: number): Promise<Card[]> => {
  if (USE_MOCK) {
    return Promise.resolve(mockCards.filter(c => c.board_id === boardId));
  }
  const response = await api.get<Card[]>(`/cards?board_id=${boardId}`);
  return response.data;
};

export const createCard = async (data: CreateCardRequest): Promise<Card> => {
  if (USE_MOCK) {
    const newCard: Card = {
      id: mockIdCounter++,
      title: data.title,
      description: data.description || null,
      due_date: data.due_date || null,
      status: 'pending',
      list_id: data.list_id,
      board_id: data.board_id,
    };
    mockCards.push(newCard);
    return Promise.resolve(newCard);
  }
  const response = await api.post<Card>('/cards/', data);
  return response.data;
};

export const updateCard = async (id: number, data: UpdateCardRequest): Promise<Card> => {
  if (USE_MOCK) {
    const index = mockCards.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Card not found');
    mockCards[index] = { ...mockCards[index], ...data };
    return Promise.resolve(mockCards[index]);
  }
  const response = await api.put<Card>(`/cards/${id}`, data);
  return response.data;
};

export const deleteCard = async (id: number): Promise<void> => {
  if (USE_MOCK) {
    mockCards = mockCards.filter(c => c.id !== id);
    return Promise.resolve();
  }
  await api.delete(`/cards/${id}`);
};
