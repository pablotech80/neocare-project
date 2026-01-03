import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLists, createList } from '../api/lists';
import type { List } from '../api/lists';
import { getCards, createCard, updateCard, deleteCard } from '../api/cards';
import type { Card, CreateCardRequest, UpdateCardRequest } from '../api/cards';
import CardItem from '../components/CardItem';
import CardModal from '../components/CardModal';
import {
  ArrowLeft, Plus, Loader2, LayoutDashboard, LogOut,
  Trash2, AlertCircle, Clock
} from 'lucide-react';

const BoardView = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedListId, setSelectedListId] = useState<number>(0);

  // New list form
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);

  const numericBoardId = parseInt(boardId || '0');

  useEffect(() => {
    if (numericBoardId) {
      fetchData();
    }
  }, [numericBoardId]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [listsData, cardsData] = await Promise.all([
        getLists(numericBoardId),
        getCards(numericBoardId),
      ]);
      setLists(listsData);
      setCards(cardsData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar el tablero');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    setIsCreatingList(true);
    try {
      const newList = await createList({ title: newListTitle, board_id: numericBoardId });
      setLists([...lists, newList]);
      setNewListTitle('');
      setShowNewListForm(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear la lista');
    } finally {
      setIsCreatingList(false);
    }
  };

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
      setCards(cards.map(c => c.id === updated.id ? updated : c));
    } else {
      const created = await createCard(data as CreateCardRequest);
      setCards([...cards, created]);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm('¿Eliminar esta tarjeta?')) return;
    try {
      await deleteCard(cardId);
      setCards(cards.filter(c => c.id !== cardId));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al eliminar la tarjeta');
    }
  };

  const getCardsForList = (listId: number) => {
    return cards.filter(c => c.list_id === listId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
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
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
            ✕
          </button>
        </div>
      )}

      {/* Board content */}
      <main className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full">
          {/* Lists/Columns */}
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-gray-200 rounded-xl w-80 flex-shrink-0 flex flex-col max-h-[calc(100vh-180px)]"
            >
              {/* List header */}
              <div className="p-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{list.title}</h3>
                <span className="text-xs text-gray-500 bg-gray-300 px-2 py-0.5 rounded-full">
                  {getCardsForList(list.id).length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
                {getCardsForList(list.id).map((card) => (
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
              </div>

              {/* Add card button */}
              <div className="p-3 pt-0">
                <button
                  onClick={() => handleOpenNewCard(list.id)}
                  className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-300 rounded-lg py-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Añadir tarjeta</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add new list */}
          <div className="w-80 flex-shrink-0">
            {showNewListForm ? (
              <form onSubmit={handleCreateList} className="bg-gray-200 rounded-xl p-3">
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
                className="w-full bg-gray-200/50 hover:bg-gray-200 rounded-xl p-3 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Añadir lista</span>
              </button>
            )}
          </div>
        </div>
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
