import api from './axios';

// =========================
// TIPOS
// =========================

export interface Card {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  status: 'pending' | 'in_progress' | 'done';
  list_id: number;
  board_id: number;

  // Campo necesario para orden estable en frontend
  order: number;

  labels?: {
    id: string;
    name: string;
    color: string;
  }[];

  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];

  // Actualizado con role
  assignee?: {
    id: string;
    name: string;
    role?: string;
  } | null;
}

export interface CreateCardRequest {
  title: string;
  description?: string;
  due_date?: string;
  list_id: number;
  board_id: number;

  labels?: {
    id: string;
    name: string;
    color: string;
  }[];

  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];

  // Actualizado con role
  assignee?: {
    id: string;
    name: string;
    role?: string;
  } | null;
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
  due_date?: string;
  status?: 'pending' | 'in_progress' | 'done';
  list_id?: number;

  labels?: {
    id: string;
    name: string;
    color: string;
  }[];

  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];

  // Actualizado con role
  assignee?: {
    id: string;
    name: string;
    role?: string;
  } | null;
}

// =========================
// MOCKS
// =========================

const USE_MOCK = false;

// RESPONSABLES FIJOS
export const mockAssignees = [
  { id: 'u1', name: 'Pablo', role: 'Coordinación' },
  { id: 'u2', name: 'Melina', role: 'Backend' },
  { id: 'u3', name: 'Vicente', role: 'Frontend' },
  { id: 'u4', name: 'Karen', role: 'Testing' },
  { id: 'u5', name: 'José Ángel', role: 'Documentación' }
];

// TARJETAS MOCK (limpias)
let mockCards: Card[] = [
  { 
    id: 1,
    title: 'Diseñar mockups',
    description: 'Crear diseños en Figma',
    due_date: '2025-12-20',
    status: 'done',
    list_id: 1,
    board_id: 1,
    order: 0,
    labels: [
      { id: 'ux', name: 'UX', color: '#64B5F6' },
      { id: 'figma', name: 'Figma', color: '#BA68C8' }
    ],
    subtasks: [
      { id: 's1', title: 'Bocetos iniciales', completed: true },
      { id: 's2', title: 'Diseño final', completed: true },
      { id: 's3', title: 'Revisión con equipo', completed: false }
    ],
    assignee: mockAssignees[0]
  },
  { 
    id: 2,
    title: 'Implementar login',
    description: 'Formulario de autenticación',
    due_date: '2025-12-18',
    status: 'in_progress',
    list_id: 2,
    board_id: 1,
    order: 1,
    labels: [
      { id: 'backend', name: 'Backend', color: '#81C784' }
    ],
    subtasks: [
      { id: 's4', title: 'Diseñar formulario', completed: true },
      { id: 's5', title: 'Validaciones', completed: false },
      { id: 's6', title: 'Integración API', completed: false }
    ],
    assignee: mockAssignees[1]
  },
  { 
    id: 3,
    title: 'Configurar base de datos',
    description: null,
    due_date: '2025-12-16',
    status: 'pending',
    list_id: 1,
    board_id: 1,
    order: 2,
    subtasks: [],
    assignee: mockAssignees[2]
  },
  { 
    id: 4,
    title: 'Testing E2E',
    description: 'Pruebas con Playwright',
    due_date: '2025-12-25',
    status: 'pending',
    list_id: 3,
    board_id: 1,
    order: 3,
    subtasks: [],
    assignee: mockAssignees[3]
  }
];

let mockIdCounter = 5;

// =========================
// API MOCK / REAL
// =========================

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
      order: mockCards.length, // nuevo card al final
      labels: data.labels || [],
      subtasks: data.subtasks || [],
      assignee: data.assignee || null
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

    mockCards[index] = {
      ...mockCards[index],
      ...data,
      labels: data.labels !== undefined ? data.labels : mockCards[index].labels,
      subtasks: data.subtasks !== undefined ? data.subtasks : mockCards[index].subtasks,
      assignee: data.assignee !== undefined ? data.assignee : mockCards[index].assignee
    };

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


