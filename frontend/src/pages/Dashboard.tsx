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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 relative overflow-hidden">
      {/* Efectos de niebla */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-purple-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">NeoCare</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hola, {user?.username || user?.email}</span>
            <button
              onClick={() => navigate('/my-hours')}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition"
            >
              <Clock className="w-5 h-5" />
              <span className="hidden sm:inline">Mis Horas</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Mis Tableros</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nuevo Tablero
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-12">
            <FolderKanban className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <p className="text-gray-500">No tienes tableros aún</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-purple-600 hover:underline font-medium"
            >
              Crear tu primer tablero
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards.map((board) => (
              <div
                key={board.id}
                onClick={() => navigate(`/board/${board.id}`)}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-lg hover:border-purple-300 transition cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">
                      {board.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Tablero #{board.id}
                    </p>
                  </div>
                  <FolderKanban className="w-6 h-6 text-gray-400 group-hover:text-purple-500 transition" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-md p-6 border border-purple-200">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-4">
              Crear Nuevo Tablero
            </h3>
            <form onSubmit={handleCreateBoard}>
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="Nombre del tablero"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition mb-4"
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newBoardTitle.trim()}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
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
