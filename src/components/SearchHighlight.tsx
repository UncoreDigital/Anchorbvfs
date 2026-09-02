import { Fragment } from "react";

interface SearchHighlightProps {
  text: string;
  tokens: string[];
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Renders `text` with every matched token wrapped in a highlight. */
const SearchHighlight = ({ text, tokens }: SearchHighlightProps) => {
  const usable = tokens.filter(Boolean);
  if (!text || usable.length === 0) return <>{text}</>;

  // One capture group means split() puts the matched text at every odd index.
  const parts = text.split(new RegExp(`(${usable.map(escapeRegExp).join("|")})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="bg-gold/30 text-inherit rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
};

export default SearchHighlight;
