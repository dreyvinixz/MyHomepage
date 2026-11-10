export function CoffeeIcon({ className }: { className?: string }) {
  return <svg className={['coffee-icon', className].filter(Boolean).join(' ')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 9h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9Z" />
    <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M7 4c0 1 .8 1.2.8 2.2M12 3c0 1 .8 1.2.8 2.2M17 4c0 1 .8 1.2.8 2.2" />
  </svg>;
}
