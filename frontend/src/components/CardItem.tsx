import type { Card } from '../api/cards';
import { Calendar, Clock, CheckCircle2, Circle, Loader } from 'lucide-react';

interface CardItemProps {
  card: Card;
  onClick: () => void;
}

const CardItem = ({ card, onClick }: CardItemProps) => {
  const getDueDateInfo = () => {
    if (!card.due_date) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(card.due_date);
    dueDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Vencida', className: 'bg-red-100 text-red-700' };
    } else if (diffDays === 0) {
      return { label: 'Hoy', className: 'bg-orange-100 text-orange-700' };
    } else if (diffDays === 1) {
      return { label: 'Mañana', className: 'bg-yellow-100 text-yellow-700' };
    } else if (diffDays <= 3) {
      return { label: `${diffDays} días`, className: 'bg-yellow-50 text-yellow-600' };
    }
    return { label: formatDate(card.due_date), className: 'bg-gray-100 text-gray-600' };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getStatusIcon = () => {
    switch (card.status) {
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Loader className="w-4 h-4 text-blue-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = () => {
    switch (card.status) {
      case 'done':
        return 'Completado';
      case 'in_progress':
        return 'En progreso';
      default:
        return 'Pendiente';
    }
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition cursor-pointer group"
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{getStatusIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition truncate">
            {card.title}
          </h4>
          {card.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {card.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {getStatusLabel()}
            </span>
            {dueDateInfo && (
              <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${dueDateInfo.className}`}>
                {dueDateInfo.label === 'Vencida' ? (
                  <Clock className="w-3 h-3" />
                ) : (
                  <Calendar className="w-3 h-3" />
                )}
                {dueDateInfo.label}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
