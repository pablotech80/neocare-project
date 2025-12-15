import api from './axios';

// TODO: Cambiar USE_MOCK a false cuando el backend esté listo
const USE_MOCK = true;

interface Board {
  id: number;
  title: string;
  user_id: number;
}

// Mock data
let mockBoards: Board[] = [
  { id: 1, title: 'Proyecto NeoCare', user_id: 1 },
  { id: 2, title: 'Sprint Semana 2', user_id: 1 },
];
let mockIdCounter = 3;

export const getBoards = async (): Promise<Board[]> => {
  if (USE_MOCK) {
    return Promise.resolve(mockBoards);
  }
  const response = await api.get<Board[]>('/boards/');
  return response.data;
};

export const createBoard = async (title: string): Promise<Board> => {
  if (USE_MOCK) {
    const newBoard: Board = { id: mockIdCounter++, title, user_id: 1 };
    mockBoards.push(newBoard);
    return Promise.resolve(newBoard);
  }
  const response = await api.post<Board>('/boards/', { title });
  return response.data;
};
