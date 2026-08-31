type HighlightTextProps = {
  text: string;
  query?: string;
}

export function HighlightText({
  text,
  query = "",
}: HighlightTextProps) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return <>{text}</>;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = normalizedQuery.toLowerCase();

  const parts: React.ReactNode[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    const matchIndex = lowerText.indexOf(
      lowerQuery,
      currentIndex,
    );

    if (matchIndex === -1) {
      break;
    }

    if (matchIndex > currentIndex) {
      parts.push(
        text.slice(currentIndex, matchIndex),
      );
    }

    parts.push(
      <mark
        key={matchIndex}
        className="rounded-xs bg-amber-100 px-1 text-inherit"
      >
        {text.slice(
          matchIndex,
          matchIndex + normalizedQuery.length,
        )}
      </mark>,
    );

    currentIndex =
      matchIndex + normalizedQuery.length;
  }

  if (currentIndex === 0) {
    return <>{text}</>;
  }

  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }

  return <>{parts}</>;
}