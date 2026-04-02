'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Overview', icon: '⬡' },
  { href: '/campaigns', label: 'Campaigns', icon: '✉' },
  { href: '/website', label: 'Website', icon: '◈' },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col w-56 shrink-0 bg-surface border-r border-border min-h-screen p-6">
      <div className="mb-10">
        <span className="text-white font-bold text-lg tracking-tight">Mono</span>
        <span className="text-accent-blue font-bold text-lg">.</span>
      </div>
      <div className="space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
              pathname === item.href
                ? 'bg-accent-blue/15 text-accent-blue font-medium'
                : 'text-text-secondary hover:text-white hover:bg-[#1a1a1a]'
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-border z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors',
              pathname === item.href ? 'text-accent-blue' : 'text-text-secondary'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
