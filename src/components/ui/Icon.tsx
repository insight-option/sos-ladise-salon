import type { CategorySlug } from '@/lib/data/types';

type IconName =
  | CategorySlug
  | 'user'
  | 'menu'
  | 'close'
  | 'arrow'
  | 'pin'
  | 'clock'
  | 'play'
  | 'pause'
  | 'check'
  | 'info'
  | 'home'
  | 'salon'
  | 'phone'
  | 'whatsapp';

const PATHS: Record<IconName, React.ReactNode> = {
  facial: (
    <>
      <ellipse cx="12" cy="11" rx="7" ry="8.5" />
      <path d="M9 10h.01M15 10h.01M9.5 14.5c1.5 1 3.5 1 5 0" />
    </>
  ),
  'permanent-makeup': (
    <>
      <path d="M4 20l7-7" />
      <path d="M11 13l2-6 4-3 3 3-3 4-6 2z" />
    </>
  ),
  hair: (
    <>
      <circle cx="6" cy="7" r="3" />
      <circle cx="6" cy="17" r="3" />
      <path d="M8.5 8.5L20 18M8.5 15.5L20 6" />
    </>
  ),
  nails: (
    <>
      <path d="M8 21V9a4 4 0 0 1 8 0v12" />
      <path d="M10 9.5a2 2 0 0 1 4 0V13h-4z" />
    </>
  ),
  henna: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 9.5C10 6 10 4 12 2c2 2 2 4 0 7.5zM12 14.5c2 3.5 2 5.5 0 7.5-2-2-2-4 0-7.5zM9.5 12C6 14 4 14 2 12c2-2 4-2 7.5 0zM14.5 12c3.5-2 5.5-2 7.5 0-2 2-4 2-7.5 0z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  pin: (
    <>
      <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  check: <path d="M4 12.5l5 5L20 6.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v5h1" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />
  ),
  // Generic chat bubble (not the WhatsApp trademark); the button label names the app.
  whatsapp: (
    <>
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
      <path d="M9 10h.01M12 10h.01M15 10h.01" />
    </>
  ),
  home: <path d="M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-5h4v5" />,
  salon: (
    <>
      <path d="M4 20V9l8-5 8 5v11" />
      <path d="M9 20v-6h6v6M4 20h16" />
    </>
  ),
};

/** Stroke icon. `directional` icons are mirrored in RTL via the .icon-directional class. */
export function Icon({
  name,
  size = 24,
  directional = false,
  className,
}: {
  name: IconName;
  size?: number;
  directional?: boolean;
  className?: string;
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
      aria-hidden="true"
      focusable="false"
      className={
        [directional && 'icon-directional', className].filter(Boolean).join(' ') || undefined
      }
    >
      {PATHS[name]}
    </svg>
  );
}
