import { type ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-stone-100">
      <main className="w-full px-6 py-16 md:w-1/3 md:mx-auto md:px-0">
        {children}
      </main>
    </div>
  );
}
