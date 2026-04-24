import { useEffect } from 'react';
import { Wheat, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import useFieldStore from '../stores/useFieldStore';
import useAuthStore from '../stores/useAuthStore';
import FieldCard from '../components/FieldCard';

const StatCard = ({ icon, label, value, colorClass, glowClass }) => (
  <div className={`bg-forest-800 border border-border-subtle rounded-2xl p-5 flex items-center gap-4`}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${glowClass}`}>
      {icon}
    </div>
    <div>
      <p className="font-display font-bold text-2xl text-ink-primary leading-none">{value}</p>
      <p className="text-xs text-ink-muted mt-1">{label}</p>
    </div>
  </div>
);

const AgentDashboard = () => {
  const { fields, isLoading, getAssignedFields } = useFieldStore();
  const { user } = useAuthStore();

  useEffect(() => { getAssignedFields(); }, [getAssignedFields]);

  const active = fields.filter((f) => f.status === 'active').length;
  const atRisk = fields.filter((f) => f.status === 'at risk').length;
  const completed = fields.filter((f) => f.status === 'completed').length;

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl text-ink-primary mb-1">My Fields</h1>
        <p className="text-ink-muted text-sm">Welcome back, <span className="text-forest-300 font-medium">{user?.username}</span>. Here is your season overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-9">
        <StatCard icon={<Wheat size={19} className="text-forest-300" />} label="Total Assigned" value={fields.length} glowClass="bg-forest-300/10 border border-forest-300/20" />
        <StatCard icon={<TrendingUp size={19} className="text-forest-400" />} label="Active" value={active} glowClass="bg-forest-400/10 border border-forest-400/20" />
        <StatCard icon={<AlertTriangle size={19} className="text-amber-400" />} label="At Risk" value={atRisk} glowClass="bg-amber-400/10 border border-amber-400/20" />
        <StatCard icon={<CheckCircle2 size={19} className="text-sky-400" />} label="Completed" value={completed} glowClass="bg-sky-400/10 border border-sky-400/20" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-ink-muted text-sm">Loading fields...</div>
      ) : fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-forest-800 border border-border-subtle rounded-2xl text-center">
          <span className="text-4xl mb-3">🌾</span>
          <p className="text-ink-muted text-sm">No fields assigned yet. Check back later.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="font-display text-sm font-semibold text-ink-secondary">Assigned Fields</p>
            <p className="text-xs text-ink-muted">{fields.length} field{fields.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {fields.map((field) => <FieldCard key={field._id} field={field} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default AgentDashboard;
