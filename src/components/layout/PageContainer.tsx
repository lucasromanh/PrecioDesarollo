import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function PageContainer({ children, title, description }: PageContainerProps) {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-8 max-w-7xl">
      {title && (
        <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-2 text-base md:text-lg">{description}</p>
          )}
        </div>
      )}
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
        {children}
      </div>
    </div>
  );
}
