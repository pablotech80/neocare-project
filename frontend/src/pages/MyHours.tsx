import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWeeklyWorklogs } from '../api/worklogs';
import type { WeeklyWorklogsResponse } from '../types/worklog';
import { Clock, ArrowLeft, LogOut, Loader2, Calendar, AlertCircle } from 'lucide-react';

const MyHours = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [weeklyData, setWeeklyData] = useState<WeeklyWorklogsResponse | null>(null);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Calcular la semana actual en formato ISO (YYYY-WW)
  const getCurrentWeek = (): string => {
    const now = new Date();
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-${String(weekNo).padStart(2, '0')}`;
  };

  // Calcular semanas disponibles (últimas 8 semanas)
  const getAvailableWeeks = (): string[] => {
    const weeks: string[] = [];
    const now = new Date();

    for (let i = 0; i < 8; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - (i * 7));
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      const yearStart = new Date(d.getFullYear(), 0, 1);
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      const weekStr = `${d.getFullYear()}-${String(weekNo).padStart(2, '0')}`;
      weeks.push(weekStr);
    }

    return weeks;
  };

  useEffect(() => {
    const currentWeek = getCurrentWeek();
    setSelectedWeek(currentWeek);
  }, []);

  useEffect(() => {
    if (selectedWeek) {
      loadWeeklyData();
    }
  }, [selectedWeek]);

  const loadWeeklyData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getWeeklyWorklogs(selectedWeek);
      setWeeklyData(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las horas');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getWeekLabel = (weekStr: string) => {
    const [year, week] = weekStr.split('-');
    return `Semana ${week}, ${year}`;
  };

  const availableWeeks = getAvailableWeeks();
  const currentWeek = getCurrentWeek();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">Mis Horas</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">Hola, {user?.username || user?.email}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Week selector */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Seleccionar semana:</label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
            >
              {availableWeeks.map((week) => (
                <option key={week} value={week}>
                  {getWeekLabel(week)} {week === currentWeek ? '(actual)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : weeklyData ? (
          <>
            {/* Weekly summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen Semanal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-sm text-indigo-600 font-medium mb-1">Total de horas</p>
                  <p className="text-3xl font-bold text-indigo-900">
                    {weeklyData.total_week_hours.toFixed(2)}h
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">Días trabajados</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Object.keys(weeklyData.daily_totals).length}
                  </p>
                </div>
              </div>

              {/* Daily totals */}
              {Object.keys(weeklyData.daily_totals).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Horas por día</h3>
                  <div className="space-y-2">
                    {Object.entries(weeklyData.daily_totals)
                      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                      .map(([date, hours]) => (
                        <div key={date} className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-700">{formatShortDate(date)}</span>
                          <span className="text-sm font-semibold text-gray-900">{hours.toFixed(2)}h</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Worklog list */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Registros de tiempo
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({weeklyData.worklogs.length} registros)
                  </span>
                </h2>
              </div>

              {weeklyData.worklogs.length === 0 ? (
                <div className="p-12 text-center">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay horas registradas esta semana</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Las horas se registran desde las tarjetas en los tableros
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {weeklyData.worklogs.map((worklog) => (
                    <div key={worklog.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg font-semibold text-indigo-600">
                              {worklog.hours}h
                            </span>
                            <span className="text-sm text-gray-600">
                              {formatDate(worklog.date)}
                            </span>
                          </div>
                          {worklog.note && (
                            <p className="text-sm text-gray-700 mt-2">{worklog.note}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            Tarjeta #{worklog.card_id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default MyHours;
