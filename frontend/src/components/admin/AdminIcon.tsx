type AdminIconName =
  | "add"
  | "bell"
  | "calendar"
  | "dashboard"
  | "edit"
  | "eco"
  | "eye"
  | "help"
  | "location"
  | "members"
  | "menu"
  | "personAdd"
  | "report"
  | "search"
  | "settings"
  | "shield"
  | "tag"
  | "warning";

const paths: Record<AdminIconName, string[]> = {
  add: ["M12 5v14M5 12h14"],
  bell: ["M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9", "M10 21h4"],
  calendar: ["M7 3v4M17 3v4M4 8h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z", "M8 12h3M14 12h3M8 16h3"],
  dashboard: ["M4 4h7v7H4V4ZM13 4h7v5h-7V4ZM13 11h7v9h-7v-9ZM4 13h7v7H4v-7Z"],
  edit: ["M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z", "M14 7l3 3"],
  eco: ["M20 4c-7.2.3-11.5 3.8-12 10.5C5.8 13.2 4 11 4 8.5 4 6.7 4.8 5 6 4c-2.6 1.4-4 4-4 7 0 5 4 9 9 9 6.2 0 9.5-6.2 9-16Z", "M7 17c2.8-4.6 6.4-7.5 11-9"],
  eye: ["M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"],
  help: ["M9.1 9a3 3 0 1 1 5.8 1c-.7 1.1-1.9 1.4-2.5 2.3-.3.4-.4.9-.4 1.7", "M12 18h.01", "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"],
  location: ["M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z", "M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"],
  members: ["M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20c.5-3.4 2.5-5 5-5s4.5 1.6 5 5M11 20c.5-3.4 2.5-5 5-5s4.5 1.6 5 5"],
  menu: ["M4 7h16M4 12h16M4 17h16"],
  personAdd: ["M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3 20c.7-4 3-6 7-6", "M18 8v8M14 12h8"],
  report: ["M12 9v4M12 17h.01", "M10.3 4.5h3.4L21 17.5 19.3 20H4.7L3 17.5 10.3 4.5Z"],
  search: ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "M21 21l-4.3-4.3"],
  settings: ["M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z", "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-1.9.3l-.4.2a1.7 1.7 0 0 0-1 1.5V22h-4v-.3a1.7 1.7 0 0 0-1-1.5l-.4-.2a1.7 1.7 0 0 0-1.9-.3l-.2.1-2-3.4.1-.1A1.7 1.7 0 0 0 4.6 15l-.2-.4A1.7 1.7 0 0 0 3 13.5H2v-4h1a1.7 1.7 0 0 0 1.4-1.1l.2-.4A1.7 1.7 0 0 0 4.3 6l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 1.9-.3l.4-.2A1.7 1.7 0 0 0 9.7.6V.3h4v.3a1.7 1.7 0 0 0 1 1.5l.4.2a1.7 1.7 0 0 0 1.9.3l.2-.1 2 3.4-.1.1a1.7 1.7 0 0 0-.3 1.9l.2.4a1.7 1.7 0 0 0 1.4 1.1h.6v4h-.6a1.7 1.7 0 0 0-1.4 1.1l-.2.4Z"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z", "M9 12l2 2 4-5"],
  tag: ["M7 7h.01", "M7 3h5c.5 0 1 .2 1.4.6l7 7a2 2 0 0 1 0 2.8l-7 7a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 3 12V7a4 4 0 0 1 4-4Z"],
  warning: ["M12 9v4M12 17h.01", "M10.3 4.5h3.4L21 17.5 19.3 20H4.7L3 17.5 10.3 4.5Z"],
};

export function AdminIcon({ name, className = "" }: { name: AdminIconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
