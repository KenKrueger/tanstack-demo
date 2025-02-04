import { memo } from "react";
import { formatDate } from "../utils";

export const DateFormatter = memo(({ date }: { date: string | Date }) => {
  return <>{formatDate(date)}</>;
});

DateFormatter.displayName = "DateFormatter";
