import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/**
 * "Save to read later" stub. Copies the current page URL to the clipboard.
 * A pragmatic v1 - no auth, no list, just a frictionless way to stash a piece
 * (email it to yourself, paste it into Notion, drop it in Slack).
 */
export const SaveLink = ({ className = "" }: { className?: string }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Older browsers / iOS Safari without clipboard permission - no-op,
      // the link is already in the address bar.
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center gap-2 text-xs font-sans uppercase opacity-70 hover:opacity-100 transition-opacity ${className}`}
      style={{ letterSpacing: "0.14em" }}
      aria-live="polite"
    >
      {copied ? <Check size={14} /> : <Link2 size={14} />}
      {copied ? "Link copied" : "Save to read later"}
    </button>
  );
};
