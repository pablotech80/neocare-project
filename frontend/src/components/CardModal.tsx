import { useState, useEffect } from 'react';
import { X, Loader2, Calendar, AlertCircle } from 'lucide-react';
import type { Card, CreateCardRequest, UpdateCardRequest } from '../api/cards';
import WorklogSection from './WorklogSection';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCardRequest | UpdateCardRequest) => Promise<void>;
  card?: Card | null;
  listId: number;
  boardId: number;
}

interface FormErrors {
  title?: string;
  due_date?: string;
}

const CardModal = ({ isOpen, onClose, onSave, card, listId, boardId }: CardModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'done'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');

  const isEditing = !!card;

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setDueDate(card.due_date || '');
      setStatus(card.status);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('pending');
    }
    setErrors({});
    setApiError('');
  }, [card, isOpen]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (title.length > 80) {
      newErrors.title = 'El título no puede exceder 80 caracteres';
    }

    if (dueDate) {
      const date = new Date(dueDate);
      if (isNaN(date.getTime())) {
        newErrors.due_date = 'Fecha inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      if (isEditing) {
        await onSave({
          title,
          description: description || undefined,
          due_date: dueDate || undefined,
          status,
        });
      } else {
        await onSave({
          title,
          description: description || undefined,
          due_date: dueDate || undefined,
          list_id: listId,
          board_id: boardId,
        });
      }
      onClose();
    } catch (err: any) {
      setApiError(err.response?.data?.detail || 'Error al guardar la tarjeta');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {apiError && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {apiError}
          </div>
        )}

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg outline-none transition ${
                errors.title
                  ? 'border-red-300 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
              }`}
              placeholder="Título de la tarjeta"
              maxLength={80}
            />
            <div className="flex justify-between mt-1">
              {errors.title && (
                <span className="text-red-500 text-xs">{errors.title}</span>
              )}
              <span className="text-gray-400 text-xs ml-auto">{title.length}/80</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition resize-none"
              placeholder="Descripción opcional..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha límite
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg outline-none transition ${
                errors.due_date
                  ? 'border-red-300 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
              }`}
            />
            {errors.due_date && (
              <span className="text-red-500 text-xs mt-1">{errors.due_date}</span>
            )}
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'done')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En progreso</option>
                <option value="done">Completado</option>
              </select>
            </div>
          )}

          {/* Sección de horas trabajadas - solo en edición */}
          {isEditing && card && (
            <WorklogSection cardId={card.id} />
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : isEditing ? (
                'Guardar cambios'
              ) : (
                'Crear tarjeta'
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
