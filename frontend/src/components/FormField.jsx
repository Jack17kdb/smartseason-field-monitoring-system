const inputBase = "w-full bg-forest-750 border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-ink-primary placeholder-ink-muted outline-none transition-colors duration-150 focus:border-forest-400";

const FormField = ({ label, children }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-medium text-ink-secondary mb-1.5">{label}</label>}
    {children}
  </div>
);

export const Input = ({ className = '', ...props }) => (
  <input className={`${inputBase} ${className}`} {...props} />
);

export const Select = ({ className = '', children, ...props }) => (
  <select className={`${inputBase} appearance-none ${className}`} {...props}>
    {children}
  </select>
);

export const Textarea = ({ className = '', ...props }) => (
  <textarea className={`${inputBase} resize-none min-h-24 ${className}`} {...props} />
);

export const Button = ({ variant = 'primary', className = '', children, ...props }) => {
  const variants = {
    primary:   'bg-forest-400 hover:bg-forest-500 text-white',
    secondary: 'bg-forest-750 hover:bg-forest-700 text-ink-primary border border-border-subtle',
    ghost:     'bg-transparent hover:bg-forest-800 text-ink-secondary border border-transparent',
    danger:    'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25',
  };
  return (
    <button
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default FormField;
