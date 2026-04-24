const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-forest-900 gap-5">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-2 border-forest-800 border-t-forest-400 animate-spin-slow" />
    </div>
    <span className="text-ink-muted text-xs tracking-widest font-display font-semibold uppercase">SmartSeason</span>
  </div>
);

export default LoadingScreen;
