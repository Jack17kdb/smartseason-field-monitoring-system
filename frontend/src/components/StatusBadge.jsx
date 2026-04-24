const stageMap = {
  planted:   { dot: 'bg-forest-200',  text: 'text-forest-200',  bg: 'bg-forest-200/10',  border: 'border-forest-200/20'  },
  growing:   { dot: 'bg-forest-300',  text: 'text-forest-300',  bg: 'bg-forest-300/10',  border: 'border-forest-300/25'  },
  ready:     { dot: 'bg-amber-400',   text: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/25'   },
  harvested: { dot: 'bg-sky-400',     text: 'text-sky-400',     bg: 'bg-sky-400/10',     border: 'border-sky-400/25'     },
};

const statusMap = {
  active:     { label: 'Active',     dot: 'bg-forest-300', text: 'text-forest-300', bg: 'bg-forest-300/10', border: 'border-forest-300/25' },
  'at risk':  { label: 'At Risk',    dot: 'bg-amber-400',  text: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/25'  },
  completed:  { label: 'Completed',  dot: 'bg-sky-400',    text: 'text-sky-400',    bg: 'bg-sky-400/10',    border: 'border-sky-400/25'    },
};

export const StageBadge = ({ stage }) => {
  const c = stageMap[stage] ?? stageMap.planted;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${c.text} ${c.bg} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {stage}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const c = statusMap[status] ?? statusMap.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.text} ${c.bg} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

export default StatusBadge;
