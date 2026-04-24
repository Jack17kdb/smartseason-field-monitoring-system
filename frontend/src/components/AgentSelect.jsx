import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, User } from 'lucide-react';

const AgentSelect = ({ agents, value, onChange, placeholder = 'Select an agent...' }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selected = agents.find((a) => a.username === value);

  const filtered = agents.filter(
    (a) =>
      a.username.toLowerCase().includes(query.toLowerCase()) ||
      a.email.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      
      const scrollParent = ref.current.closest('.overflow-y-auto');
      if (scrollParent) {
        setTimeout(() => {
          const rect = ref.current.getBoundingClientRect();
          const parentRect = scrollParent.getBoundingClientRect();
          const dropdownHeight = 250; 
          
          if (rect.bottom + dropdownHeight > parentRect.bottom) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [open]);

  const handleSelect = (agent) => {
    onChange(agent.username);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-forest-750 border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm transition-colors duration-150 focus:outline-none hover:border-border-mid cursor-pointer"
        style={{ borderColor: open ? 'var(--color-forest-400)' : undefined }}
      >
        {selected ? (
          <span className="flex items-center gap-2 text-ink-primary min-w-0">
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-forest-600 to-forest-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {selected.username[0].toUpperCase()}
            </span>
            <span className="truncate">{selected.username}</span>
            <span className="text-ink-muted text-xs truncate hidden sm:inline">— {selected.email}</span>
          </span>
        ) : (
          <span className="text-ink-muted">{placeholder}</span>
        )}
        <ChevronDown
          size={14}
          className={`text-ink-muted shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-forest-800 border border-border-mid rounded-xl shadow-2xl shadow-forest-950/60 overflow-hidden animate-modal-in">
          <div className="p-2 border-b border-border-subtle">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-forest-750 border border-border-subtle rounded-lg pl-8 pr-3 py-2 text-sm text-ink-primary placeholder-ink-muted outline-none focus:border-forest-400 transition-colors"
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-ink-muted text-xs gap-1.5">
                <User size={16} />
                <span>No agents found</span>
              </div>
            ) : (
              filtered.map((agent) => (
                <button
                  key={agent._id}
                  type="button"
                  onClick={() => handleSelect(agent)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors cursor-pointer hover:bg-forest-750 ${
                    agent.username === value ? 'bg-forest-400/10 text-forest-300' : 'text-ink-primary'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-forest-600 to-forest-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {agent.username[0].toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium truncate">{agent.username}</span>
                    <span className="block text-xs text-ink-muted truncate">{agent.email}</span>
                  </span>
                  {agent.username === value && (
                    <span className="ml-auto text-forest-300 text-xs shrink-0">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSelect;
