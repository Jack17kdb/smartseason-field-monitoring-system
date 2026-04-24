import { useEffect } from 'react';
import { Wheat, TrendingUp, AlertTriangle, CheckCircle2, Leaf } from 'lucide-react';
import useFieldStore from '../stores/useFieldStore';
import useAuthStore from '../stores/useAuthStore';
import FieldCard from '../components/FieldCard';

const StatCard = ({ icon, label, value, glowClass, sub, subColor }) => (
  <div className="relative bg-forest-800 border border-border-subtle rounded-2xl p-5 overflow-hidden">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${glowClass}`}>{icon}</div>
    <p className="font-display font-extrabold text-3xl text-ink-primary leading-none">{value}</p>
    <p className="text-xs text-ink-muted mt-1.5">{label}</p>
    {sub && <p className={`text-xs mt-1 font-medium ${subColor}`}>{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const { fields, dashboardStats, isLoading, getAllFields, getDashboardStats } = useFieldStore();
  const { user } = useAuthStore();

  useEffect(() => { getAllFields(); getDashboardStats(); }, [getAllFields, getDashboardStats]);

  const atRiskFields = fields.filter((f) => f.status === 'at risk');

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl text-ink-primary mb-1">Overview</h1>
        <p className="text-ink-muted text-sm">Season dashboard for all active fields. Hello, <span className="text-forest-300 font-medium">{user?.username}</span>.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        <StatCard icon={<Wheat size={18} className="text-forest-300" />} label="Total Fields" value={dashboardStats?.totalFields ?? 0} glowClass="bg-forest-300/10 border border-forest-300/20" />
        <StatCard icon={<TrendingUp size={18} className="text-forest-400" />} label="Active" value={dashboardStats?.breakdown?.active ?? 0} glowClass="bg-forest-400/10 border border-forest-400/20" />
        <StatCard
          icon={<AlertTriangle size={18} className="text-amber-400" />} label="At Risk" value={dashboardStats?.breakdown?.atRisk ?? 0}
          glowClass="bg-amber-400/10 border border-amber-400/20"
          sub={dashboardStats?.breakdown?.atRisk > 0 ? 'Needs attention' : null} subColor="text-amber-400"
        />
        <StatCard icon={<CheckCircle2 size={18} className="text-sky-400" />} label="Completed" value={dashboardStats?.breakdown?.completed ?? 0} glowClass="bg-sky-400/10 border border-sky-400/20" />
      </div>

      {dashboardStats?.cropDistribution?.length > 0 && (
        <div className="bg-forest-800 border border-border-subtle rounded-2xl px-5 py-4 mb-7">
          <div className="flex items-center gap-2 mb-3">
            <Leaf size={13} className="text-forest-300" />
            <p className="font-display text-xs font-semibold text-ink-secondary uppercase tracking-wide">Crop Distribution</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {dashboardStats.cropDistribution.map((crop) => (
              <span key={crop} className="px-3 py-1 rounded-full text-xs text-forest-200 bg-forest-400/10 border border-forest-400/20">{crop}</span>
            ))}
          </div>
        </div>
      )}

      {atRiskFields.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} className="text-amber-400" />
            <p className="font-display text-sm font-semibold text-amber-400">At Risk Fields</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {atRiskFields.map((f) => <FieldCard key={f._id} field={f} />)}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-ink-muted text-sm">Loading fields...</div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-display text-sm font-semibold text-ink-secondary">All Fields</p>
            <p className="text-xs text-ink-muted">{fields.length} total</p>
          </div>
          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-forest-800 border border-border-subtle rounded-2xl text-center">
              <span className="text-4xl mb-3">🌾</span>
              <p className="text-ink-muted text-sm">No fields created yet. Head to Field Management to add one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {fields.map((f) => <FieldCard key={f._id} field={f} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
