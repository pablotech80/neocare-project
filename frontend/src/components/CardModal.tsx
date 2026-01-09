import { useState, useEffect } from 'react';
import {
  X, Loader2, Calendar, AlertCircle,
  CheckSquare, Square, Plus, Trash2
} from 'lucide-react';

import type { Card, CreateCardRequest, UpdateCardRequest } from '../api/cards';
import { mockAssignees } from '../api/cards';
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

  // ETIQUETAS
  const [labels, setLabels] = useState<{ id: string; name: string; color: string }[]>([]);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#64B5F6');

  // SUBTAREAS
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  // RESPONSABLE
  const [assignee, setAssignee] = useState<{ id: string; name: string; role?: string } | null>(null);

  const isEditing = !!card;

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setDueDate(card.due_date || '');
      setStatus(card.status);
      setLabels(card.labels || []);
      setSubtasks(card.subtasks || []);
      setAssignee(card.assignee || null);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('pending');
      setLabels([]);
      setSubtasks([]);
      setAssignee(null);
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
          labels,
          subtasks,
          assignee,
        });
      } else {
        await onSave({
          title,
          description: description || undefined,
          due_date: dueDate || undefined,
          list_id: listId,
          board_id: boardId,
          labels,
          subtasks,
          assignee,
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

  const completedCount = subtasks.filter(s => s.completed).length;
  const totalCount = subtasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-modal-fade">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-modal-scale">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ERROR API */}
        {apiError && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {apiError}
          </div>
        )}

        {/* BODY */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-4 space-y-6">

            {/* TÍTULO */}
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

            {/* DESCRIPCIÓN */}
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

            {/* FECHA */}
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

            {/* ESTADO (solo edición) */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En progreso</option>
                  <option value="done">Completado</option>
                </select>
              </div>
            )}

            {/* RESPONSABLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsable
              </label>
              <select
                value={assignee?.id || ''}
                onChange={(e) => {
                  const selected = mockAssignees.find(a => a.id === e.target.value) || null;
                  setAssignee(selected);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
              >
                <option value="">Sin responsable</option>
                {mockAssignees.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBTAREAS */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Subtareas
              </label>

              {/* Progreso */}
              {subtasks.length > 0 && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{completedCount}/{totalCount} completadas</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Lista subtareas */}
              <div className="space-y-2">
                {subtasks.map(sub => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSubtasks(subtasks.map(s =>
                          s.id === sub.id ? { ...s, completed: !s.completed } : s
                        ))
                      }
                      className="text-gray-600 hover:text-indigo-600 transition"
                    >
                      {sub.completed ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <span
                      className={`flex-1 ml-3 text-sm ${
                        sub.completed ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {sub.title}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSubtasks(subtasks.filter(s => s.id !== sub.id))}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {subtasks.length === 0 && (
                  <p className="text-gray-400 text-sm">No hay subtareas</p>
                )}
              </div>

              {/* Añadir subtarea */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Nueva subtarea"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newSubtask.trim()) return;
                    setSubtasks([
                      ...subtasks,
                      {
                        id: crypto.randomUUID(),
                        title: newSubtask.trim(),
                        completed: false,
                      },
                    ]);
                    setNewSubtask('');
                  }}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Añadir
                </button>
              </div>
            </div>

            {/* ETIQUETAS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etiquetas
              </label>

              {/* Etiquetas actuales */}
              <div className="flex flex-wrap gap-2 mb-3">
                {labels.map(label => (
                  <span
                    key={label.id}
                    className="text-xs px-2 py-1 rounded-full text-white flex items-center gap-2"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                    <button
                      type="button"
                      onClick={() => setLabels(labels.filter(l => l.id !== label.id))}
                      className="text-white/80 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {labels.length === 0 && (
                  <span className="text-gray-400 text-sm">No hay etiquetas</span>
                )}
              </div>

              {/* Crear nueva etiqueta */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Nueva etiqueta"
                  className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                />

                <input
                  type="color"
                  value={newLabelColor}
                  onChange={(e) => setNewLabelColor(e.target.value)}
                  className="w-10 h-10 p-1 border rounded cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (!newLabelName.trim()) return;
                    setLabels([
                      ...labels,
                      {
                        id: crypto.randomUUID(),
                        name: newLabelName.trim(),
                        color: newLabelColor,
                      },
                    ]);
                    setNewLabelName('');
                  }}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                >
                  Añadir
                </button>
              </div>
            </div>

            {/* WORKLOG (solo edición) */}
            {isEditing && card && (
              <WorklogSection cardId={card.id} />
            )}

            {/* BOTONES */}
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
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
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


