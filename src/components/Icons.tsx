import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...rest }: P) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
}

export const BeanIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M18.5 5.5c2.6 2.6 2 7.6-1.4 11.1s-8.5 4-11.1 1.4-2-7.6 1.4-11.1 8.5-4 11.1-1.4Z" />
    <path d="M17.8 6.2c-2.1.5-3.4 1.6-4.3 3.1-.9 1.6-1.2 3.4-2.6 4.8-1.3 1.3-3 1.9-4.7 2.1" />
  </svg>
);

export const FlameIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3c3.6 2.7 6 6 6 9a6 6 0 0 1-12 0c0-1.3.4-2.7 1.2-4.1.4 1 1 1.8 1.9 2.3C9.2 7.9 10.4 5.3 12 3Z" />
    <path d="M12 12.5c1 .8 1.7 1.7 1.7 2.7A1.7 1.7 0 0 1 12 17a1.7 1.7 0 0 1-1.7-1.8c0-1 .7-1.9 1.7-2.7Z" />
  </svg>
);

export const CartIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 5h2l1.6 10.4a1.5 1.5 0 0 0 1.5 1.3h7.9a1.5 1.5 0 0 0 1.5-1.2L20 8H7" />
    <circle cx="10" cy="20" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15.2 15.2 5 5" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const TrashIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 7h15M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7M7 7l.8 11.2A2 2 0 0 0 9.8 20h4.4a2 2 0 0 0 2-1.8L17 7" />
    <path d="M10.2 11v5M13.8 11v5" />
  </svg>
);

export const ArrowRightIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h15M13.5 5.5 20 12l-6.5 6.5" />
  </svg>
);

export const StarIcon = ({ size = 14, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8L12 2.8Z" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const LeafIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M19.5 4.5C11 5 5.5 9 5 15.5c-.2 2 .5 3.6.5 3.6s1.6.7 3.6.5c6.5-.5 10.5-6 10.4-15.1Z" />
    <path d="M5.8 19.2C9 15 13 11.5 17.5 8.5" />
  </svg>
);

export const DropIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5c3.4 4 5.5 7 5.5 9.7a5.5 5.5 0 0 1-11 0c0-2.7 2.1-5.7 5.5-9.7Z" />
    <path d="M9.5 13.5a2.6 2.6 0 0 0 2 2.5" />
  </svg>
);

export const TruckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 6.5h11v10H3zM14 10h4l2.5 3v3.5H14" />
    <circle cx="7" cy="17.5" r="1.6" />
    <circle cx="17" cy="17.5" r="1.6" />
  </svg>
);

export const GlobeIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.6 2.3 3.9 5.1 3.9 8.5s-1.3 6.2-3.9 8.5c-2.6-2.3-3.9-5.1-3.9-8.5s1.3-6.2 3.9-8.5Z" />
  </svg>
);

export const CalendarIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </svg>
);

export const KettleIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 9.5h8.5a3.5 3.5 0 0 1 3.5 3.5v3a2 2 0 0 1-2 2H8A3.5 3.5 0 0 1 4.5 14.5v-1.5A3.5 3.5 0 0 1 8 9.5Z" />
    <path d="M8 9.5 5.5 5.5H3.8M20 13.5h1.5M9.5 18v1.8M15 18v1.8" />
  </svg>
);

export const CupIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 10h11v5.5A4.5 4.5 0 0 1 11.5 20h-2A4.5 4.5 0 0 1 5 15.5V10Z" />
    <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5c-.8 1 .8 1.6 0 2.7M11.5 3.5c-.8 1 .8 1.6 0 2.7" />
  </svg>
);

export const LockIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="5.5" y="10.5" width="13" height="9.5" rx="2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    <circle cx="12" cy="15.2" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const SlidersIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h9M17 17h3" />
    <circle cx="15" cy="7" r="1.8" />
    <circle cx="9" cy="12" r="1.8" />
    <circle cx="15" cy="17" r="1.8" />
  </svg>
);

/** Roast-level indicator: filled beans out of five. */
export function RoastMeter({ level, className = "" }: { level: number; className?: string }) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-label={`Roast level ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="11" height="14" viewBox="0 0 11 14" aria-hidden="true">
          <ellipse
            cx="5.5"
            cy="7"
            rx="4.4"
            ry="6"
            fill={i <= level ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.1"
            opacity={i <= level ? 1 : 0.35}
          />
          <path
            d="M5.5 1.4c-1.8 2-2.6 3.6-2.6 5.6s.8 3.6 2.6 5.6"
            stroke={i <= level ? "var(--color-roast-950)" : "currentColor"}
            strokeWidth="1.1"
            fill="none"
            opacity={i <= level ? 0.85 : 0.35}
          />
        </svg>
      ))}
    </div>
  );
}
