import api from './axios';

export interface List {
  id: number;
  title: string;
  board_id: number;
}

export interface CreateListRequest {
  title: string;
  board_id: number;
}

// TODO: Cambiar USE_MOCK a false cuando el backend esté listo
const USE_MOCK = false;

// Mock data para desarrollo
let mockLists: List[] = [
  { id: 1, title: 'Por hacer', board_id: 1 },
  { id: 2, title: 'En progreso', board_id: 1 },
  { id: 3, title: 'Completado', board_id: 1 },
];
let mockIdCounter = 4;

export const getLists = async (boardId: number): Promise<List[]> => {
  if (USE_MOCK) {
    return Promise.resolve(mockLists.filter(l => l.board_id === boardId));
  }
  const response = await api.get<List[]>(`/lists?board_id=${boardId}`);
  return response.data;
};

export const createList = async (data: CreateListRequest): Promise<List> => {
  if (USE_MOCK) {
    const newList: List = {
      id: mockIdCounter++,
      title: data.title,
      board_id: data.board_id,
    };
    mockLists.push(newList);
    return Promise.resolve(newList);
  }
  const response = await api.post<List>('/lists/', data);
  return response.data;
};

export const deleteList = async (id: number): Promise<void> => {
  if (USE_MOCK) {
    mockLists = mockLists.filter(l => l.id !== id);
    return Promise.resolve();
  }
  await api.delete(`/lists/${id}`);
};
