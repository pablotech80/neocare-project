import { useState, useEffect, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { getLists, createList } from '../api/lists';
import type { List } from '../api/lists';

import { getCards, createCard, updateCard, deleteCard } from '../api/cards';
import type { Card, CreateCardRequest, UpdateCardRequest } from '../api/cards';
import { mockAssignees } from '../api/cards';

import CardItem from '../components/CardItem';
import CardModal from '../components/CardModal';

import {
  ArrowLeft, Plus, LayoutDashboard, LogOut,
  Trash2, AlertCircle, Clock, Search
} from 'lucide-react';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';

import { SortableContext } from '@dnd-kit/sortable';


// ============================
// DROPPABLE AREA
// ============================
const DroppableCardsArea = ({ id, children }: { id: string; children: ReactNode }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
      {children}
    </div>
  );
};


// ============================
// BOARD VIEW
// ============================
const BoardView = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedListId, setSelectedListId] = useState<number>(0);

  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const numericBoardId = parseInt(boardId || '0');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );


  // ============================
  // Cargar datos + asignar order
  // ============================
  useEffect(() => {
    if (numericBoardId) fetchData();
  }, [numericBoardId]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [listsData, cardsData] = await Promise.all([
        getLists(numericBoardId),
        getCards(numericBoardId),
      ]);

      const cardsWithOrder = cardsData.map((c, index) => ({
        ...c,
        order: c.order ?? index,
      }));

      setLists(listsData);
      setCards(cardsWithOrder);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar el tablero');
    } finally {
      setIsLoading(false);
    }
  };


  // ============================
  // Filtros
  // ============================
  const allLabels = Array.from(
    new Map(
      cards.flatMap(card => card.labels || []).map(label => [label.id, label])
    ).values()
  );

  const getCardsForList = (listId: number) => {
    return cards
      .filter(c => {
        if (c.list_id !== listId) return false;
        if (selectedLabel && !c.labels?.some(l => l.id === selectedLabel)) return false;
        if (selectedAssignee && c.assignee?.id !== selectedAssignee) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = c.title.toLowerCase().includes(q);
          const descMatch = c.description?.toLowerCase().includes(q);
          if (!titleMatch && !descMatch) return false;
        }

        return true;
      })
      .sort((a, b) => a.order - b.order);
  };


  // ============================
  // Crear / Editar / Eliminar
  // ============================
  const handleOpenNewCard = (listId: number) => {
    setSelectedCard(null);
    setSelectedListId(listId);
    setIsCardModalOpen(true);
  };

  const handleOpenEditCard = (card: Card) => {
    setSelectedCard(card);
    setSelectedListId(card.list_id);
    setIsCardModalOpen(true);
  };

  const handleSaveCard = async (data: CreateCardRequest | UpdateCardRequest) => {
    if (selectedCard) {
      const updated = await updateCard(selectedCard.id, data as UpdateCardRequest);
      setCards(prev =>
        prev.map(c => (c.id === updated.id ? { ...updated, order: c.order } : c))
      );
    } else {
      const created = await createCard(data as CreateCardRequest);
      setCards(prev => [...prev, { ...created, order: prev.length }]);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm('¿Eliminar esta tarjeta?')) return;
    try {
      await deleteCard(cardId);
      setCards(prev => prev.filter(c => c.id !== cardId));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al eliminar la tarjeta');
    }
  };


  const handleDragStart = (event: any) => {
    const cardId = Number(event.active.id);
    const card = cards.find(c => c.id === cardId);
    if (card) setActiveCard(card);
  };

const handleDragEnd = (event: any) => {
  const { active, over } = event;
  setActiveCard(null);

  if (!over) return;

  const activeId = Number(active.id);
  const overId = Number(over.id);

  const activeCardObj = cards.find(c => c.id === activeId);
  const overCardObj = cards.find(c => c.id === overId);

  const overIsList = lists.some(l => l.id === overId);

  if (!activeCardObj) return;

  // ============================
  // 1. MOVER ENTRE COLUMNAS (soltar en columna vacía)
  // ============================
  if (overIsList) {
    const newListId = overId;

    setCards(prev => {
      const updated = prev.map(c =>
        c.id === activeId
          ? { ...c, list_id: newListId, order: -1 }
          : c
      );

      const reordered = updated
        .filter(c => c.list_id === newListId)
        .sort((a, b) => a.order - b.order)
        .map((c, i) => ({ ...c, order: i }));

      return updated.map(c => reordered.find(r => r.id === c.id) || c);
    });

    return;
  }

  // ============================
  // 2. REORDENAR DENTRO DE LA MISMA COLUMNA
  // ============================
  if (overCardObj && activeCardObj.list_id === overCardObj.list_id) {
    const listId = activeCardObj.list_id;

    setCards(prev => {
      const columnCards = prev
        .filter(c => c.list_id === listId)
        .sort((a, b) => a.order - b.order);

      const oldIndex = columnCards.findIndex(c => c.id === activeId);
      const newIndex = columnCards.findIndex(c => c.id === overId);

      const [moved] = columnCards.splice(oldIndex, 1);
      columnCards.splice(newIndex, 0, moved);

      const reordered = columnCards.map((c, i) => ({ ...c, order: i }));

      return prev.map(c => reordered.find(r => r.id === c.id) || c);
    });

    return;
  }

  // ============================
  // 3. MOVER ENTRE COLUMNAS (soltar sobre tarjeta)
  // ============================
  if (overCardObj && activeCardObj.list_id !== overCardObj.list_id) {
    const newListId = overCardObj.list_id;

    setCards(prev => {
      const updated = prev.map(c =>
        c.id === activeId
          ? { ...c, list_id: newListId, order: -1 }
          : c
      );

      const reordered = updated
        .filter(c => c.list_id === newListId)
        .sort((a, b) => a.order - b.order)
        .map((c, i) => ({ ...c, order: i }));

      return updated.map(c => reordered.find(r => r.id === c.id) || c);
    });
  }
};


  // ============================
  // LOADING STATE
  // ============================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Cargando tablero...</span>
        </div>
      </div>
    );
  }
  // ============================
  // RENDER
  // ============================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-indigo-600" />
              <h1 className="text-lg font-bold text-gray-900">Tablero #{boardId}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">Hola, {user?.username || user?.email}</span>
            <button
              onClick={() => navigate('/my-hours')}
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition text-sm"
            >
              <Clock className="w-5 h-5" />
              <span className="hidden sm:inline">Mis Horas</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
            ✕
          </button>
        </div>
      )}

      {/* Búsqueda */}
      <div className="px-6 pt-4 flex items-center gap-2">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar tarjetas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="px-6 pt-4 flex items-center gap-4 flex-wrap">

        {/* Filtro etiquetas */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedLabel(null)}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedLabel === null
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Todas
          </button>

          {allLabels.map(label => (
            <button
              key={label.id}
              onClick={() => setSelectedLabel(label.id)}
              className="px-3 py-1 rounded-full text-sm border flex items-center gap-2"
              style={{
                backgroundColor: selectedLabel === label.id ? label.color : 'white',
                color: selectedLabel === label.id ? 'white' : label.color,
                borderColor: label.color,
              }}
            >
              {label.name}
            </button>
          ))}
        </div>

        {/* Filtro por responsable */}
        <div>
          <select
            value={selectedAssignee || ''}
            onChange={(e) => setSelectedAssignee(e.target.value || null)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="">Todos los responsables</option>
            {mockAssignees.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Board content */}
      <main className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full">

            {lists.map((list, index) => {
              const allCardsInList = cards.filter(c => c.list_id === list.id);
              const itemIds = allCardsInList.map(c => String(c.id));
              const visibleCards = getCardsForList(list.id);

              return (
                <div
                  key={list.id}
                  className="
                    bg-white shadow-md border border-gray-200 rounded-xl w-80 flex-shrink-0 flex flex-col 
                    max-h-[calc(100vh-180px)]
                    transform transition-all duration-300
                    hover:shadow-lg hover:-translate-y-1
                    animate-fade-slide
                  "
                  style={{ animationDelay: `${index * 80}ms` }}
                >

                  {/* List header */}
                  <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{list.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        {visibleCards.length}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenNewCard(list.id)}
                      className="p-1.5 rounded-full hover:bg-indigo-100 text-indigo-600 transition"
                      title="Añadir tarjeta"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cards area */}
                  <DroppableCardsArea id={String(list.id)}>
                    <SortableContext id={String(list.id)} items={itemIds}>
                      {visibleCards.map((card) => (
                        <div key={card.id} className="relative group">
                          <CardItem card={card} onClick={() => handleOpenEditCard(card)} />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCard(card.id);
                            }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-white rounded shadow hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </SortableContext>
                  </DroppableCardsArea>

                </div>
              );
            })}
            {/* Add new list */}
            <div className="w-80 flex-shrink-0">
              {showNewListForm ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newListTitle.trim()) return;

                    try {
                      setIsCreatingList(true);
                      const newList = await createList({
                        title: newListTitle,
                        board_id: numericBoardId
                      });

                      setLists(prev => [...prev, newList]);
                      setNewListTitle('');
                      setShowNewListForm(false);
                    } catch (err: any) {
                      setError(err.response?.data?.detail || 'Error al crear la lista');
                    } finally {
                      setIsCreatingList(false);
                    }
                  }}
                  className="bg-white shadow-md border border-gray-200 rounded-xl p-4"
                >
                  <input
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Nombre de la lista"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition mb-2"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isCreatingList || !newListTitle.trim()}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
                    >
                      {isCreatingList ? 'Creando...' : 'Crear lista'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewListForm(false);
                        setNewListTitle('');
                      }}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 transition"
                    >
                      ✕
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowNewListForm(true)}
                  className="w-full bg-white shadow-md border border-gray-200 rounded-xl p-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
                >
                  <Plus className="w-5 h-5" />
                  <span>Añadir lista</span>
                </button>
              )}
            </div>

          </div>

          {/* Overlay animado */}
          <DragOverlay>
            {activeCard ? (
              <CardItem
                card={activeCard}
                onClick={() => {}}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Card Modal */}
      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setSelectedCard(null);
        }}
        onSave={handleSaveCard}
        card={selectedCard}
        listId={selectedListId}
        boardId={numericBoardId}
      />
    </div>
  );
};

export default BoardView;

