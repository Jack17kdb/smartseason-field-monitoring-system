import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wheat, Calendar, User, Clock, MessageSquarePlus, RefreshCw } from 'lucide-react';
import useFieldStore from '../stores/useFieldStore';
import useAuthStore from '../stores/useAuthStore';
import StatusBadge, { StageBadge } from '../components/StatusBadge';
import FormField, { Select, Textarea, Button } from '../components/FormField';

const STAGES = ['planted', 'growing', 'ready', 'harvested'];

const MetaItem = ({ icon, label, value }) => (
  <div className="bg-forest-750 rounded-xl px-4 py-3">
    <div className="flex items-center gap-1.5 text-ink-muted text-xs mb-1.5">{icon}{label}</div>
    <p className="text-ink-primary text-sm font-medium">{value}</p>
  </div>
);

const FieldDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedField, observations, isLoading, getFieldDetails, updateFieldStage, addObservation } = useFieldStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [note, setNote] = useState('');
  const [stage, setStage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { getFieldDetails(id); }, [id, getFieldDetails]);
  useEffect(() => { if (selectedField) setStage(selectedField.currentStage); }, [selectedField]);

  const handleStageUpdate = async () => {
    if (stage === selectedField?.currentStage) return;
    setSubmitting(true);
    await updateFieldStage(id, stage);
    setSubmitting(false);
  };

  const handleObservation = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSubmitting(true);
    const ok = await addObservation(id, note);
    if (ok) setNote('');
    setSubmitting(false);
  };

  if (isLoading && !selectedField) return (
    <div className="flex items-center justify-center py-24 text-ink-muted text-sm">Loading field...</div>
  );

  if (!selectedField) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <p className="text-ink-muted text-sm">Field not found.</p>
      <Button variant="secondary" onClick={() => navigate(-1)}>Go back</Button>
    </div>
  );

  const plantDate = new Date(selectedField.plantingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const currentIdx = STAGES.indexOf(selectedField.currentStage);

  return (
    <div className="animate-fade-up">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-ink-muted text-xs mb-6 hover:text-ink-primary transition-colors cursor-pointer bg-transparent border-none"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <div className="bg-forest-800 border border-border-subtle rounded-2xl p-6">
            <div className="flex justify-between items-start gap-3 flex-wrap mb-5">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-ink-primary mb-2">{selectedField.name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={selectedField.status} />
                  <StageBadge stage={selectedField.currentStage} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetaItem icon={<Wheat size={12} />} label="Crop Type" value={selectedField.cropType} />
              <MetaItem icon={<Calendar size={12} />} label="Planted" value={plantDate} />
              <MetaItem icon={<User size={12} />} label="Agent" value={selectedField.assignedTo?.username || '—'} />
              <MetaItem icon={<Clock size={12} />} label="Updated" value={new Date(selectedField.updatedAt).toLocaleDateString('en-GB')} />
            </div>
          </div>

          <div className="bg-forest-800 border border-border-subtle rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquarePlus size={15} className="text-forest-300" />
              <h2 className="font-display font-bold text-base text-ink-primary">Observations</h2>
              <span className="text-xs text-ink-muted ml-auto">{observations.length} total</span>
            </div>

            {!isAdmin && (
              <form onSubmit={handleObservation} className="mb-6 pb-6 border-b border-border-subtle">
                <FormField label="Add observation note">
                  <Textarea
                    placeholder="Describe field conditions, pest activity, growth progress, irrigation status..."
                    value={note} onChange={(e) => setNote(e.target.value)} required
                  />
                </FormField>
                <Button type="submit" disabled={submitting || !note.trim()}>
                  <MessageSquarePlus size={14} /> {submitting ? 'Adding...' : 'Add Observation'}
                </Button>
              </form>
            )}

            {observations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="text-3xl mb-2">📋</span>
                <p className="text-ink-muted text-sm">No observations recorded yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {observations.map((obs) => (
                  <div key={obs._id} className="bg-forest-750 border border-border-subtle rounded-xl px-4 py-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-forest-200">{obs.agent_id?.username || 'Agent'}</span>
                      <span className="text-[11px] text-ink-muted">
                        {new Date(obs.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-ink-secondary text-sm leading-relaxed">{obs.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {!isAdmin && (
            <div className="bg-forest-800 border border-border-subtle rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw size={14} className="text-forest-300" />
                <h3 className="font-display font-semibold text-sm text-ink-primary">Update Stage</h3>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                {STAGES.map((s) => {
                  const isActive = stage === s;
                  const isPast = STAGES.indexOf(s) < STAGES.indexOf(stage);
                  return (
                    <button
                      key={s}
                      onClick={() => setStage(s)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left cursor-pointer transition-all text-sm capitalize ${
                        isActive
                          ? 'bg-forest-400/12 border-forest-400/30 text-forest-200 font-semibold'
                          : isPast
                          ? 'bg-forest-750 border-border-subtle text-ink-muted'
                          : 'bg-forest-750 border-border-subtle text-ink-secondary hover:border-border-mid'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-forest-400' : isPast ? 'bg-forest-600' : 'bg-forest-750 border border-border-mid'}`} />
                      {s}
                    </button>
                  );
                })}
              </div>
              <Button
                onClick={handleStageUpdate}
                disabled={submitting || stage === selectedField.currentStage}
                className="w-full justify-center"
              >
                {submitting ? 'Updating...' : 'Save Stage'}
              </Button>
            </div>
          )}

          <div className="bg-forest-800 border border-border-subtle rounded-2xl p-5">
            <p className="font-display text-xs font-semibold text-ink-secondary uppercase tracking-wide mb-4">Stage Progress</p>
            <div className="flex flex-col">
              {STAGES.map((s, i) => {
                const done = i < currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={s} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mt-0.5 shrink-0 ${done || active ? 'bg-forest-400' : 'bg-forest-700 border border-border-mid'}`} />
                      {i < STAGES.length - 1 && <div className={`w-0.5 h-6 ${done ? 'bg-forest-600' : 'bg-forest-750'}`} />}
                    </div>
                    <p className={`text-sm capitalize pb-6 ${active ? 'text-forest-200 font-semibold' : done ? 'text-ink-muted' : 'text-forest-700'}`}>{s}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetail;
