
import { cn } from "@/lib/utils";

type SocialIconProps = {
  name: string;
  className?: string;
};

const ICONS: Record<string, JSX.Element> = {
  Twitter: (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 fill-current"
    >
      <title>Twitter</title>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Instagram: (
     <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 fill-current"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Instagram</title>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" fill="none"></line>
    </svg>
  ),
  WhatsApp: (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 fill-current"
    >
      <title>WhatsApp</title>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.77.46 3.45 1.28 4.95L2 22l5.25-1.38c1.45.77 3.06 1.18 4.79 1.18h.01c5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.9-9.91-9.9zM12.04 20.15c-1.5 0-2.93-.39-4.18-1.09l-.3-.18-3.12.82.83-3.04-.2-.32a8.04 8.04 0 0 1-1.23-4.38c0-4.42 3.6-8.02 8.02-8.02s8.02 3.6 8.02 8.02c0 4.42-3.6 8.02-8.02 8.02zm4.52-6.13c-.25-.12-1.47-.72-1.7-.85-.23-.12-.39-.18-.56.12-.17.3-.64.85-.79 1.02-.15.17-.3.19-.55.06-.25-.12-1.06-.39-2-1.23-.73-.66-1.22-1.47-1.36-1.72-.14-.25-.02-.38.1-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.4-.42-.55-.42h-.48c-.17 0-.43.06-.66.3.23.24-.87 1.02-.87 2.48s.9 2.88 1.02 3.08c.12.21 1.74 2.65 4.22 3.72.59.25 1.05.4 1.41.52.59.18 1.13.15 1.55.09.47-.06 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.17-.16-.42-.28z"/>
    </svg>
  ),
};

export default function SocialIcon({ name, className }: SocialIconProps) {
  const icon = ICONS[name];
  if (!icon) return null;

  return (
    <div
      className={cn(
        "text-muted-foreground transition-colors hover:text-primary",
        className
      )}
    >
      {icon}
    </div>
  );
}
