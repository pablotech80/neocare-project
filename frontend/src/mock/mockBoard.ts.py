// src/mock/mockBoard.ts

// Datos mock muy simples, sin tipos exportados

export const mockLists = [
  { id: 1, title: 'Por hacer', board_id: 1 },
  { id: 2, title: 'En progreso', board_id: 1 },
  { id: 3, title: 'Completado', board_id: 1 },
];

export const mockCards = [
  {
    id: 1,
    title: 'Diseñar mockups',
    description: 'Crear diseños en Figma',
    status: 'done',
    list_id: 1,
    board_id: 1,
    tags: [
      { id: 'ux', name: 'UX', color: '#4F46E5' },
      { id: 'prioridad', name: 'Prioridad', color: '#DC2626' },
    ],
    due_date: '2025-12-20',
  },
  {
    id: 2,
    title: 'Configurar base de datos',
    status: 'pending',
    list_id: 1,
    board_id: 1,
    tags: [],
    due_date: '2025-12-18',
  },
  {
    id: 3,
    title: 'Implementar login',
    description: 'Formulario de autenticación',
    status: 'in_progress',
    list_id: 2,
    board_id: 1,
    tags: [{ id: 'backend', name: 'Backend', color: '#059669' }],
    due_date: '2025-12-19',
  },
  {
    id: 4,
    title: 'Testing E2E',
    description: 'Pruebas con Playwright',
    status: 'pending',
    list_id: 3,
    board_id: 1,
    tags: [{ id: 'qa', name: 'QA', color: '#F59E0B' }],
    due_date: '2025-12-17',
  },
];
