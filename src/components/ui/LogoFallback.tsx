interface LogoFallbackProps {
  name: string;
}

export const LogoFallback = ({ name }: LogoFallbackProps) => (
  <span className="text-cream/40 text-[11px] font-sans uppercase tracking-[0.15em] whitespace-nowrap">
    {name}
  </span>
);
