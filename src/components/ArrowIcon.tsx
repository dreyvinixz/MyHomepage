export function ArrowIcon({ direction = 'external', className = '' }: { direction?: 'external' | 'up' | 'left'; className?: string }) {
  const path = direction === 'external' ? 'M7 17 17 7M8 7h9v9' : direction === 'up' ? 'M12 19V5M5 12l7-7 7 7' : 'M19 12H5M12 5l-7 7 7 7';
  return <svg className={`ui-arrow ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path}/></svg>;
}
