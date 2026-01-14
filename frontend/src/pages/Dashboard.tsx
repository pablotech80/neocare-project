import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBoards, createBoard } from '../api/boards';
import { LayoutDashboard, Plus, LogOut, Loader2, FolderKanban, Clock } from 'lucide-react';

interface Board {
  id: number;
  title: string;
  user_id: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const data = await getBoards();
      setBoards(data);
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    setIsCreating(true);
    try {
      const newBoard = await createBoard(newBoardTitle);
      setBoards([...boards, newBoard]);
      setNewBoardTitle('');
      setShowModal(false);
    } catch (error) {
      console.error('Error creating board:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar estilo Jira */}
      <aside className="w-16 bg-gradient-to-b from-purple-700 to-purple-900 flex flex-col items-center py-6 gap-6 shadow-xl">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
          <LayoutDashboard className="w-6 h-6 text-purple-700" />
        </div>
        <button
          onClick={() => navigate('/my-hours')}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-purple-200 hover:bg-purple-600 hover:text-white transition"
          title="Mis Horas"
        >
          <Clock className="w-5 h-5" />
        </button>
        <button
          onClick={logout}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-purple-200 hover:bg-red-600 hover:text-white transition mt-auto"
          title="Salir"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar estilo Jira */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">Proyectos</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.username || user?.email}</span>
          </div>
        </header>

        {/* Content area estilo Jira */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header con botón */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Tableros</h2>
                <p className="text-sm text-gray-500 mt-1">Gestiona tus proyectos y tareas</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-md hover:bg-purple-700 transition shadow-sm font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Crear tablero
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              </div>
            ) : boards.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No hay tableros</h3>
                <p className="text-gray-500 mb-4">Crea tu primer tablero para comenzar</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  + Crear tablero
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {boards.map((board) => (
                  <div
                    key={board.id}
                    onClick={() => navigate(`/board/${board.id}`)}
                    className="bg-white rounded-md border border-gray-200 p-5 hover:border-purple-400 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                        <FolderKanban className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition truncate">
                          {board.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Proyecto #{board.id}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal estilo Jira */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Crear nuevo tablero
              </h3>
            </div>
            <form onSubmit={handleCreateBoard} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del tablero *
                </label>
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="Ej: Proyecto Marketing 2026"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-sm"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newBoardTitle.trim()}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
