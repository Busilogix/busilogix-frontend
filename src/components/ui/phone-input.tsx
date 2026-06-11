"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Country = {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
};

const countries: Country[] = [
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { name: "Qatar", code: "QA", dialCode: "+974", flag: "🇶🇦" },
  { name: "Oman", code: "OM", dialCode: "+968", flag: "🇴🇲" },
  { name: "Kuwait", code: "KW", dialCode: "+965", flag: "🇰🇼" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Malaysia", code: "MY", dialCode: "+60", flag: "🇲🇾" },
  { name: "Bangladesh", code: "BD", dialCode: "+880", flag: "🇧🇩" },
  { name: "Nepal", code: "NP", dialCode: "+977", flag: "🇳🇵" },
  { name: "Sri Lanka", code: "LK", dialCode: "+94", flag: "🇱🇰" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", flag: "🇳🇿" },
  { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { name: "Ireland", code: "IE", dialCode: "+353", flag: "🇮🇪" },
  { name: "Switzerland", code: "CH", dialCode: "+41", flag: "🇨🇭" },
];

type PhoneInputProps = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
};

export function PhoneInput({
  value = "",
  onChange,
  disabled = false,
  placeholder = "Enter phone number",
  id,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Default to India (+91)
  const [nationalNumber, setNationalNumber] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse value on mount or change
  useEffect(() => {
    if (!value) {
      setNationalNumber("");
      return;
    }

    // Check if value matches current combined value to avoid updating state during typing
    const cleanedVal = value.replace(/[\s()-]+/g, "");
    const currentCombined = `${selectedCountry.dialCode}${nationalNumber.replace(/[\s()-]+/g, "")}`;
    if (cleanedVal === currentCombined.replace(/[\s()-]+/g, "")) {
      return;
    }

    // Try to find matching dial code from our list
    const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
    const matchedCountry = sortedCountries.find((c) => value.startsWith(c.dialCode));

    if (matchedCountry) {
      setSelectedCountry(matchedCountry);
      setNationalNumber(value.slice(matchedCountry.dialCode.length));
    } else if (value.startsWith("+")) {
      // If starts with + but no match, split by first spaces/digits
      setNationalNumber(value);
    } else {
      setNationalNumber(value);
    }
  }, [value, selectedCountry.dialCode, nationalNumber]);

  // Handle click outside & keyboard closing
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Reset search query when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    const combined = `${country.dialCode}${nationalNumber.replace(/[\s()-]+/g, "")}`;
    onChange(combined);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^\d\s()-]/g, ""); // strip non-numeric/spacers
    setNationalNumber(cleaned);
    const combined = `${selectedCountry.dialCode}${cleaned.replace(/[\s()-]+/g, "")}`;
    onChange(combined);
  };

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dialCode.includes(searchQuery) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={cn(
        "relative flex items-center w-full h-10 rounded-xl border border-input bg-background/80 shadow-inner shadow-slate-950/5 transition-[border-color,box-shadow,background-color] duration-200 ease-in-out outline-none focus-within:border-ring focus-within:bg-background focus-within:ring-3 focus-within:ring-ring/50",
        disabled && "pointer-events-none cursor-not-allowed bg-input/50 opacity-50 dark:disabled:bg-input/80"
      )}
      ref={dropdownRef}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-full shrink-0 items-center gap-1.5 rounded-l-xl border-r border-input/30 bg-slate-50/50 hover:bg-slate-100/70 px-3 text-sm transition-colors duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-input/10 dark:border-input/20"
      >
        <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
        <span className="font-mono text-xs text-muted-foreground">{selectedCountry.dialCode}</span>
        <ChevronDown
          className={cn(
            "size-3 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180 text-foreground"
          )}
        />
      </button>

      <input
        id={id}
        type="tel"
        disabled={disabled}
        placeholder={placeholder}
        value={nationalNumber}
        onChange={handlePhoneChange}
        className="h-full w-full min-w-0 bg-transparent px-3 py-2 text-base outline-none placeholder:text-muted-foreground/35 disabled:cursor-not-allowed md:text-sm"
      />

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1.5 flex flex-col max-h-72 w-[280px] overflow-hidden rounded-xl border border-slate-200/80 bg-background shadow-lg ring-1 ring-black/5 outline-none dark:border-slate-800">
          {/* Search box */}
          <div className="relative flex items-center px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30">
            <Search className="absolute left-4 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search country or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-7 pr-2.5 text-xs rounded-lg border border-input bg-background outline-none focus:border-ring focus:ring-1 focus:ring-ring"
              autoFocus
            />
          </div>

          {/* Countries list */}
          <div className="overflow-y-auto py-1 flex-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-muted/80 transition-colors",
                      isSelected ? "bg-primary/5 text-primary font-medium" : "text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none select-none">{c.flag}</span>
                      <span>{c.name}</span>
                      <span className="font-mono text-muted-foreground">({c.dialCode})</span>
                    </div>
                    {isSelected && <Check className="size-3.5 text-primary" />}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                No country found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
