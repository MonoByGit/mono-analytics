'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Overview', icon: '○' },
  { href: '/campaigns', label: 'Campaigns', icon: '◻' },
  { href: '/website', label: 'Website', icon: '◈' },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col w-48 shrink-0 border-r border-border min-h-screen p-5 bg-surface">
      <div className="mb-8 flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" width={22} height={22} />
        <span className="text-text-primary font-mono font-bold text-sm tracking-tight">mono<span className="text-accent-amber">.</span>analytics</span>
      </div>
      <div className="space-y-px">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-mono transition-colors duration-150',
              pathname === item.href
                ? 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised border border-transparent'
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="mt-auto pt-4 border-t border-border">
        <p className="text-text-tertiary text-[10px] font-mono">mono analytics v0.1</p>
      </div>
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-mono transition-colors',
              pathname === item.href ? 'text-accent-amber' : 'text-text-secondary'
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label.toLowerCase()}
          </Link>
        ))}
      </div>
    </nav>
  );
}
