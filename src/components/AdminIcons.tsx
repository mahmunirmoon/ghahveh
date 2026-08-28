import type { ReactNode } from "react";

function S({
  size = 19,
  className = "",
  children,
}: {
  size?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

type P = { size?: number; className?: string };

export const GridIcon = (p: P) => (
  <S {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
  </S>
);

export const UsersIcon = (p: P) => (
  <S {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
    <path d="M15.5 5.4a3.2 3.2 0 0 1 0 5.7" />
    <path d="M17.6 14.9c1.6.7 2.6 2.2 2.9 4.1" />
  </S>
);

export const BoxIcon = (p: P) => (
  <S {...p}>
    <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
    <path d="m4 7 8 4 8-4" />
    <path d="M12 11v9" />
  </S>
);

export const ReceiptIcon = (p: P) => (
  <S {...p}>
    <path d="M6 3h12v18l-2-1.4L14 21l-2-1.4L10 21l-2-1.4L6 21V3Z" />
    <path d="M9 8h6" />
    <path d="M9 12h6" />
    <path d="M9 16h4" />
  </S>
);

export const ChartIcon = (p: P) => (
  <S {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <path d="M8 16v-5" />
    <path d="M12.5 16V7" />
    <path d="M17 16v-3.5" />
  </S>
);

export const GearIcon = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19 12a7 7 0 0 0-.14-1.4l2-1.55-2-3.46-2.36.95a7 7 0 0 0-2.42-1.4L13.7 2.6h-3.4l-.38 2.54a7 7 0 0 0-2.42 1.4l-2.36-.95-2 3.46 2 1.55a7 7 0 0 1 0 2.8l-2 1.55 2 3.46 2.36-.95a7 7 0 0 0 2.42 1.4l.38 2.54h3.4l.38-2.54a7 7 0 0 0 2.42-1.4l2.36.95 2-3.46-2-1.55c.09-.45.14-.92.14-1.4Z" />
  </S>
);

export const PencilIcon = (p: P) => (
  <S {...p}>
    <path d="m14.5 5.5 4 4L8 20l-4.6.6L4 16 14.5 5.5Z" />
    <path d="m12.5 7.5 4 4" />
  </S>
);

export const DownloadIcon = (p: P) => (
  <S {...p}>
    <path d="M12 4v10" />
    <path d="m8 10.5 4 4 4-4" />
    <path d="M4.5 19.5h15" />
  </S>
);

export const WalletIcon = (p: P) => (
  <S {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2.5" />
    <path d="M3 10h18" />
    <path d="M16.5 14.5h1.5" />
  </S>
);

export const TrendUpIcon = (p: P) => (
  <S {...p}>
    <path d="m3.5 16.5 5-5 3.5 3.5 7-7.5" />
    <path d="M14.5 7.5H19V12" />
  </S>
);

export const AlertIcon = (p: P) => (
  <S {...p}>
    <path d="M12 3.5 2.8 19.5h18.4L12 3.5Z" />
    <path d="M12 10v4" />
    <path d="M12 17.2h.01" />
  </S>
);

export const PhoneIcon = (p: P) => (
  <S {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  </S>
);

export const MapPinIcon = (p: P) => (
  <S {...p}>
    <path d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10.3" r="2.3" />
  </S>
);

export const StoreIcon = (p: P) => (
  <S {...p}>
    <path d="M4 9.5 5.5 4h13L20 9.5" />
    <path d="M4 9.5a2.6 2.6 0 0 0 5.3 0 2.6 2.6 0 0 0 5.4 0 2.6 2.6 0 0 0 5.3 0" />
    <path d="M5 12v8h14v-8" />
    <path d="M9.5 20v-5h5v5" />
  </S>
);

export const CashIcon = (p: P) => (
  <S {...p}>
    <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6 10v.01" />
    <path d="M18 14v.01" />
  </S>
);

export const RefreshIcon = (p: P) => (
  <S {...p}>
    <path d="M20 12a8 8 0 1 1-2.3-5.6" />
    <path d="M20 3.5V8h-4.5" />
  </S>
);
