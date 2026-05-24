type IconName =
  | "eco"
  | "groups"
  | "payments"
  | "location"
  | "add"
  | "public"
  | "camera"
  | "mail"
  | "arrow"
  | "calendar"
  | "hanger"
  | "heart"
  | "leaf"
  | "user";

const paths: Record<IconName, string[]> = {
  eco: ["M20 4c-7.5.3-12.5 4.7-12.8 11.1C5.2 13.8 4 11.6 4 9c0-1.8.7-3.4 1.8-4.6C3.5 5.8 2 8.3 2 11.2 2 16 5.8 20 10.5 20 16.8 20 20.5 14 20 4Z", "M7 17c2.7-4.5 6.3-7.5 11-9"],
  groups: ["M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20c.5-3.4 2.5-5 5-5s4.5 1.6 5 5M11 20c.5-3.4 2.5-5 5-5s4.5 1.6 5 5"],
  payments: ["M3 7h18v10H3V7ZM6 10h4M15 14h3"],
  location: ["M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z", "M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"],
  add: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 8v8M8 12h8"],
  public: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.5 12h17M12 3c2.3 2.4 3.5 5.4 3.5 9s-1.2 6.6-3.5 9M12 3c-2.3 2.4-3.5 5.4-3.5 9s1.2 6.6 3.5 9"],
  camera: ["M4 8h3l1.5-2h7L17 8h3v10H4V8ZM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"],
  mail: ["M4 6h16v12H4V6ZM4 7l8 6 8-6"],
  arrow: ["M5 12h14M13 6l6 6-6 6"],
  calendar: ["M5 4v3M19 4v3M4 8h16M5 6h14a1 1 0 0 1 1 1v13H4V7a1 1 0 0 1 1-1ZM8 12h3M14 12h3M8 16h3M14 16h3"],
  hanger: ["M12 8.5c1.2-.5 2-1.3 2-2.5a2 2 0 0 0-4 0M12 8.5v1.3L4 15v2h16v-2l-8-5.2"],
  heart: ["M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"],
  leaf: ["M20 4c-7.2.3-11.5 3.8-12 10.5C5.8 13.2 4 11 4 8.5 4 6.7 4.8 5 6 4c-2.6 1.4-4 4-4 7 0 5 4 9 9 9 6.2 0 9.5-6.2 9-16Z", "M7 17c2.8-4.6 6.4-7.5 11-9"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20c.8-4 3.4-6 7.5-6s6.7 2 7.5 6"],
};

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
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
