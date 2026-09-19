import type { MouseEvent } from "react";
import { Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareOnLinkedInProps {
  /** Path (e.g. "/blog/123") or absolute URL of the page to share. */
  url: string;
  className?: string;
  /** Show only the icon (compact, for list cards). */
  iconOnly?: boolean;
}

const POPUP_WIDTH = 600;
const POPUP_HEIGHT = 640;

const ShareOnLinkedIn = ({ url, className, iconOnly = false }: ShareOnLinkedInProps) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Cards are wrapped in links; don't let the click navigate to the post.
    e.preventDefault();
    e.stopPropagation();

    const absoluteUrl = new URL(url, window.location.origin).toString();
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl)}`;

    const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2;
    const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2;
    const popup = window.open(
      shareUrl,
      "linkedin-share",
      `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top}`
    );
    if (popup) {
      popup.opener = null;
    } else {
      // Popup blocked — fall back to a new tab.
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Share on LinkedIn"
      title="Share on LinkedIn"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-background text-sm font-inter font-medium text-primary transition-colors hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2",
        iconOnly ? "p-2" : "px-4 py-2",
        className
      )}
    >
      <Linkedin className="w-4 h-4" />
      {!iconOnly && <span>Share</span>}
    </button>
  );
};

export default ShareOnLinkedIn;
