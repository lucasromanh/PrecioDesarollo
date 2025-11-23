import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-card/80 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8 max-w-7xl">
        <Link to="/" className="flex items-center gap-2 font-bold text-base md:text-xl hover:text-primary transition-colors">
          <div className="p-2 rounded-xl bg-primary/10">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent hidden sm:inline">
            PreciosDesarrollo
          </span>
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent sm:hidden">
            Precios
          </span>
        </Link>
        <nav className="ml-auto flex gap-0.5 md:gap-1 items-center">
          <Link
            to="/"
            className="px-2 md:px-4 py-2 text-xs md:text-sm font-medium transition-all hover:text-primary hover:bg-accent rounded-lg"
          >
            Inicio
          </Link>
          <Link
            to="/calculators"
            className="px-2 md:px-4 py-2 text-xs md:text-sm font-medium transition-all hover:text-primary hover:bg-accent rounded-lg"
          >
            <span className="hidden sm:inline">Calculadoras</span>
            <span className="sm:hidden">Calc</span>
          </Link>
          <Link
            to="/market-references"
            className="px-2 md:px-4 py-2 text-xs md:text-sm font-medium transition-all hover:text-primary hover:bg-accent rounded-lg hidden sm:inline-block"
          >
            Mercado
          </Link>
          <Link
            to="/about"
            className="px-2 md:px-4 py-2 text-xs md:text-sm font-medium transition-all hover:text-primary hover:bg-accent rounded-lg hidden sm:inline-block"
          >
            Acerca de
          </Link>
        </nav>
      </div>
    </header>
  );
}
