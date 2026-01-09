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
        bg-white rounded-lg border border-gray-200 p-3 cursor-pointer dnd-transition
        ${isDragging || isSorting ? 'shadow-xl scale-[1.03] z-50' : 'shadow-sm hover:shadow-md hover:-translate-y-1'}
      `}
    >
      <h4 className="font-medium text-gray-800 mb-2">{card.title}</h4>

      {card.assignee && (
        <div className="mb-2">
          <span className="inline-flex flex-col bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg border border-indigo-200 text-xs">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                {assigneeInitials}
              </span>
              {card.assignee.name}
            </span>

            {card.assignee.role && (
              <span className="text-[10px] text-indigo-500 ml-7">
                {card.assignee.role}
              </span>
            )}
          </span>
        </div>
      )}

      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map(label => (
            <span
              key={label.id}
              className="text-xs px-2 py-0.5 rounded-full text-white transition-opacity duration-200 hover:opacity-90"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {total > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{completed}/{total} ✓</span>
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

      {card.due_date && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
          <Calendar className="w-4 h-4" />
          <span>{card.due_date}</span>
        </div>
      )}
    </div>
  );
};

export default CardItem;


