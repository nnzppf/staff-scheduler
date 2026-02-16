"use client";

import { TIME_OPTIONS, END_TIME_OPTIONS } from "@/lib/constants";

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  /** If true, includes "Chiusura" as an option */
  includeChiusura?: boolean;
}

export default function TimeSelector({
  value,
  onChange,
  label,
  includeChiusura = false,
}: TimeSelectorProps) {
  const options = includeChiusura ? END_TIME_OPTIONS : TIME_OPTIONS;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 px-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
}
