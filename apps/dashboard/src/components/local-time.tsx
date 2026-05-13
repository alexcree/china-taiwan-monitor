"use client";

import { useEffect, useState } from "react";
import { formatArticleTime, formatArticleTimeLocal } from "@ctm/shared";

/**
 * Renders an ISO timestamp in the visitor's local timezone (with the short TZ
 * name, e.g., "PDT"). On the server and during initial hydration the UTC
 * formatter is used so the markup matches; after mount the client effect
 * swaps in the locale-resolved string.
 *
 * Use this anywhere an article publish time appears.
 */
export function LocalTime({
  iso,
  includeYear,
  className,
}: {
  iso: string | null | undefined;
  includeYear?: boolean;
  className?: string;
}) {
  const isoSafe = iso ?? undefined;
  const [text, setText] = useState(() =>
    formatArticleTime(isoSafe, { includeYear }),
  );

  useEffect(() => {
    setText(formatArticleTimeLocal(isoSafe, { includeYear }));
  }, [isoSafe, includeYear]);

  if (!isoSafe) return null;

  return (
    <time
      dateTime={isoSafe}
      title={formatArticleTime(isoSafe, { includeYear: true })}
      suppressHydrationWarning
      className={className}
    >
      {text}
    </time>
  );
}
