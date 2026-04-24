import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-forest-950/85 backdrop-blur-sm overflow-y-auto px-4 py-12"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-forest-800 border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-2xl animate-modal-in mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-lg text-ink-primary">{title}</h2>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-forest-750 border border-border-subtle text-ink-muted hover:text-ink-primary hover:border-border-mid transition-all cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
        
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
