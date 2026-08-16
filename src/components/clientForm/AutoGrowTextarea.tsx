import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * A textarea that grows to fit its content and stays manually resizable.
 *
 * The two features fight each other: auto-grow writes an inline height, and so
 * does the browser's resize handle. We record the height we set, and the first
 * time we find a height we didn't write we hand control to the user and stop
 * auto-growing that box.
 */
const AutoGrowTextarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<typeof Textarea>
>(({ className, value, onChange, ...props }, forwardedRef) => {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current!, []);

  const lastAutoHeight = useRef<string | null>(null);
  const userResized = useRef(false);
  // Drives the overflow rule below, so it has to be state rather than a ref.
  const [manuallySized, setManuallySized] = useState(false);

  const fit = useCallback(() => {
    const el = innerRef.current;
    if (!el || userResized.current) return;

    if (
      lastAutoHeight.current !== null &&
      el.style.height !== lastAutoHeight.current
    ) {
      userResized.current = true;
      setManuallySized(true);
      return;
    }

    el.style.height = "auto";
    const next = `${el.scrollHeight}px`;
    el.style.height = next;
    lastAutoHeight.current = next;
  }, []);

  // Re-fit when the value changes from anywhere — typing, or a draft being
  // loaded in after the first render.
  useEffect(fit, [fit, value]);

  // Width changes re-wrap the text, which changes the height it needs.
  useEffect(() => {
    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fit]);

  return (
    <Textarea
      ref={innerRef}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        fit();
      }}
      className={cn(
        "resize-y border-slate/20 bg-white leading-relaxed focus:border-gold focus:ring-gold/20",
        // While auto-growing the box always fits its text, so a scrollbar would
        // only ever flicker. Once the client drags it shorter than the content,
        // hiding the overflow would strand the rest of their answer.
        manuallySized ? "overflow-y-auto" : "overflow-hidden",
        className,
      )}
      {...props}
    />
  );
});

AutoGrowTextarea.displayName = "AutoGrowTextarea";

export default AutoGrowTextarea;
