import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';
import FormField, { Input, Button } from '../components/FormField';

const LoginPage = () => {
  const { login, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); login(form); };

  return (
    <div className="min-h-screen bg-forest-900 flex relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_20%_50%,rgba(45,110,56,0.3),transparent)]" />

      <div className="flex-1 flex items-center justify-center px-10 py-16 relative z-10">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="flex items-center gap-2.5 mb-9">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-forest-500 to-forest-300 flex items-center justify-center">
              <Sprout size={17} color="#0a1510" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-sm text-ink-primary tracking-widest uppercase">SmartSeason</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl text-ink-primary mb-2 leading-tight">Welcome back</h1>
          <p className="text-ink-muted text-sm mb-8">Sign in to your field monitoring dashboard</p>

          <form onSubmit={handleSubmit} className="bg-forest-800 border border-border-subtle rounded-2xl p-7 shadow-2xl shadow-forest-950/60">
            <FormField label="Email address">
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
                <Input
                  type="email" placeholder="you@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-10" required
                />
              </div>
            </FormField>
            <FormField label="Password">
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pl-10" required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-forest-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>
            <Button type="submit" disabled={isLoading} className="w-full justify-center mt-2 py-3 text-base">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center mt-5 text-ink-muted text-sm">
            No account?{' '}
            <Link to="/register" className="text-forest-300 font-medium hover:text-forest-200 transition-colors">Create one</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden border-l border-border-subtle">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-850 to-forest-750" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(58,150,70,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 p-12 max-w-md text-center">
          <div className="text-7xl mb-6">🌱</div>
          <h2 className="font-display font-bold text-2xl text-ink-primary mb-3">Field Intelligence Platform</h2>
          <p className="text-ink-muted text-sm leading-relaxed mb-8">Track crop progress, monitor field health, and coordinate your agents across the entire growing season.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Real-time updates', 'Risk detection', 'Stage tracking'].map((f) => (
              <span key={f} className="px-3.5 py-1.5 rounded-full text-xs text-forest-200 bg-forest-400/10 border border-forest-400/20">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
