export function Footer() {
  return (
    <footer className="border-t border-border/30 mt-auto bg-card/50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 py-6 md:py-8 px-4 md:px-8 max-w-7xl">
        <div className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
          <p>© 2025 PreciosDesarrollo. Estimaciones orientativas.</p>
          <p className="mt-1 text-[10px] md:text-xs">No constituye asesoramiento legal ni financiero.</p>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground text-center">
          <p>Herramienta para desarrolladores freelance</p>
        </div>
      </div>
    </footer>
  );
}
