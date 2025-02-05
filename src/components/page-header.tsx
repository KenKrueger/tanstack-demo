import * as React from "react";

export function PageHeader({ title }: { title: string }) {
  return (
    <header className="p-4">
      <h1 className="text-4xl font-semibold text-zinc-800">{title}</h1>
    </header>
  );
}
