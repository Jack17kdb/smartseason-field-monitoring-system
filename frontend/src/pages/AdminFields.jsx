import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import useFieldStore from '../stores/useFieldStore';
import FieldCard from '../components/FieldCard';
import Modal from '../components/Modal';
import AgentSelect from '../components/AgentSelect';
import FormField, { Input, Select, Button } from '../components/FormField';

const FILTERS = ['all', 'active', 'at risk', 'completed'];

const EMPTY_FORM = { name: '', cropType: '', plantingDate: '', currentStage: 'planted', assigned: '' };

const AdminFields = () => {
  const { fields, agents, isLoading, getAllFields, getAgents, createField, assignField } = useFieldStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assignTargetId, setAssignTargetId] = useState(null);
  const [assignUsername, setAssignUsername] = useState('');
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    getAllFields();
    getAgents();
  }, [getAllFields, getAgents]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const ok = await createField(form);
    if (ok) { setShowCreate(false); setForm(EMPTY_FORM); }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    const ok = await assignField(assignTargetId, assignUsername);
    if (ok) { setShowAssign(false); setAssignUsername(''); setAssignTargetId(null); }
  };

  const openAssign = (e, fieldId) => {
    e.stopPropagation();
    setAssignTargetId(fieldId);
    setShowAssign(true);
  };

  const filtered = filter === 'all' ? fields : fields.filter((f) => f.status === filter);
  const countFor = (s) => s === 'all' ? fields.length : fields.filter((f) => f.status === s).length;

  return (
    <div className="animate-fade-up">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-ink-primary mb-1">Field Management</h1>
          <p className="text-ink-muted text-sm">Create, assign and track all fields across your operation.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="shrink-0">
          <Plus size={15} /> New Field
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border ${
              filter === s
                ? 'bg-forest-400/12 text-forest-300 border-forest-400/28'
                : 'bg-forest-800 text-ink-muted border-border-subtle hover:border-border-mid'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} ({countFor(s)})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-ink-muted text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-forest-800 border border-border-subtle rounded-2xl">
          <span className="text-4xl mb-3">🌾</span>
          <p className="text-ink-muted text-sm">No fields found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((field) => (
            <div key={field._id} className="relative group">
              <FieldCard field={field} />
              <button
                onClick={(e) => openAssign(e, field._id)}
                className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 px-2 py-1 text-[11px] text-ink-muted bg-forest-750 border border-border-subtle rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 hover:text-forest-300 hover:border-border-mid transition-all duration-150"
              >
                Reassign
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); setForm(EMPTY_FORM); }} title="Create New Field">
        <form onSubmit={handleCreate}>
          <FormField label="Field Name">
            <Input placeholder="e.g. North Paddock A" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </FormField>
          <FormField label="Crop Type">
            <Input placeholder="e.g. Maize, Wheat, Soybean" value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })} required />
          </FormField>
          <FormField label="Planting Date">
            <Input type="date" value={form.plantingDate} onChange={(e) => setForm({ ...form, plantingDate: e.target.value })} required />
          </FormField>
          <FormField label="Initial Stage">
            <Select value={form.currentStage} onChange={(e) => setForm({ ...form, currentStage: e.target.value })}>
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="ready">Ready</option>
              <option value="harvested">Harvested</option>
            </Select>
          </FormField>
          <FormField label="Assign to Agent">
            {agents.length === 0 ? (
              <p className="text-xs text-ink-muted py-2">No agents available. Register agents first.</p>
            ) : (
              <AgentSelect
                agents={agents}
                value={form.assigned}
                onChange={(username) => setForm({ ...form, assigned: username })}
              />
            )}
          </FormField>
          <div className="flex gap-2.5 justify-end mt-4">
            <Button variant="secondary" type="button" onClick={() => { setShowCreate(false); setForm(EMPTY_FORM); }}>Cancel</Button>
            <Button type="submit" disabled={!form.assigned}>Create Field</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showAssign} onClose={() => { setShowAssign(false); setAssignUsername(''); }} title="Reassign Field">
        <form onSubmit={handleAssign}>
          <FormField label="Select Agent">
            {agents.length === 0 ? (
              <p className="text-xs text-ink-muted py-2">No agents available.</p>
            ) : (
              <AgentSelect
                agents={agents}
                value={assignUsername}
                onChange={setAssignUsername}
              />
            )}
          </FormField>
          <div className="flex gap-2.5 justify-end mt-4">
            <Button variant="secondary" type="button" onClick={() => setShowAssign(false)}>Cancel</Button>
            <Button type="submit" disabled={!assignUsername}>Assign</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminFields;
