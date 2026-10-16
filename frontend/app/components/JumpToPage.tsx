"use client";

import { useState } from "react";

type Props = { max: number | null; onJump: (page: number) => void };

export default function JumpToPage({ max, onJump }: Props) {
  const [value, setValue] = useState("");
  return (
    <form
      className="jump"
      onSubmit={(e) => {
        e.preventDefault();
        const n = Math.floor(Number(value));
        if (n >= 1 && (max === null || n <= max)) onJump(n);
        setValue("");
      }}
    >
      <input
        type="number"
        min={1}
        max={max ?? undefined}
        placeholder="Go to page"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Go</button>
    </form>
  );
}
