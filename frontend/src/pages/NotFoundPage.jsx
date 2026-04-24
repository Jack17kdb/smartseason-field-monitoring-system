import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';
import { Button } from '../components/FormField';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-forest-900 flex flex-col items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(58,150,70,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(29,61,34,0.3),transparent)]" />

      <div className="relative z-10 flex flex-col items-center text-center animate-fade-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-300 flex items-center justify-center mb-8 shadow-lg shadow-forest-950/50">
          <Sprout size={28} color="#0a1510" strokeWidth={2.5} />
        </div>

        <p className="font-display font-extrabold text-[96px] leading-none text-forest-800 select-none mb-2">404</p>

        <h1 className="font-display font-bold text-2xl text-ink-primary mb-3">Page not found</h1>
        <p className="text-ink-muted text-sm max-w-xs leading-relaxed mb-10">
          This field does not exist in our records. It may have been moved, harvested, or never planted.
        </p>

        <Button
          onClick={() => navigate(user ? (isAdmin ? '/admin' : '/dashboard') : '/login')}
          className="gap-2"
        >
          <ArrowLeft size={15} />
          {user ? 'Back to Dashboard' : 'Back to Login'}
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
