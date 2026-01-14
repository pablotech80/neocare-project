import { Calendar } from 'lucide-react';
import type { Card } from '../api/cards';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardItemProps {
  card: Card;
  onClick: () => void;
  isDragging?: boolean;
}

const CardItem = ({ card, onClick, isDragging = false }: CardItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting
  } = useSortable({ id: String(card.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const completed = card.subtasks?.filter(s => s.completed).length || 0;
  const total = card.subtasks?.length || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const assigneeInitials = card.assignee
    ? card.assignee.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`
        bg-white rounded-md border border-gray-200 p-3 cursor-pointer dnd-transition
        ${isDragging || isSorting ? 'shadow-lg rotate-2 z-50' : 'hover:bg-gray-50'}
      `}
    >
      <h4 className="font-normal text-sm text-gray-800 mb-2 leading-snug">{card.title}</h4>

      {card.assignee && (
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-600 text-white text-xs font-medium">
              {assigneeInitials}
            </span>
            <span className="text-xs text-gray-600">{card.assignee.name}</span>
          </div>
        </div>
      )}

      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {card.labels.map(label => (
            <span
              key={label.id}
              className="text-xs px-2 py-0.5 rounded text-white font-medium"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {total > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium">{completed}/{total} tareas</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {card.due_date && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{card.due_date}</span>
        </div>
      )}
    </div>
  );
};

export default CardItem;


