import { useNavigate } from 'react-router-dom';
import { Wheat, Calendar, User } from 'lucide-react';
import StatusBadge, { StageBadge } from './StatusBadge';

const FieldCard = ({ field }) => {
  const navigate = useNavigate();
  const date = new Date(field.plantingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div
      onClick={() => navigate(`/fields/${field._id}`)}
      className="group relative bg-forest-800 border border-border-subtle rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:border-border-mid hover:-translate-y-0.5 hover:shadow-lg hover:shadow-forest-950/50 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-radial from-forest-400/6 to-transparent pointer-events-none rounded-2xl" />

      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="overflow-hidden">
          <h3 className="font-display font-bold text-base text-ink-primary truncate mb-1">{field.name}</h3>
          <div className="flex items-center gap-1.5 text-ink-muted text-xs">
            <Wheat size={11} />
            <span>{field.cropType}</span>
          </div>
        </div>
        <StatusBadge status={field.status} />
      </div>

      <div className="mb-4">
        <StageBadge stage={field.currentStage} />
      </div>

      <div className="flex flex-col gap-1.5 border-t border-border-subtle pt-3">
        <div className="flex items-center gap-1.5 text-ink-muted text-xs">
          <Calendar size={11} />
          <span>Planted {date}</span>
        </div>
        {field.assignedTo && (
          <div className="flex items-center gap-1.5 text-ink-muted text-xs">
            <User size={11} />
            <span>{field.assignedTo?.username || field.assignedTo}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldCard;
