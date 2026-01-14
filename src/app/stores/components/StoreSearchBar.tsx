"use client";

import { useState, FormEvent } from "react";
import { Input } from "@src/components/ui/input";
import { Button } from "@src/components/ui/button";
import { Search, Loader2 } from "lucide-react";

export interface StoreSearchBarProps {
  onSearch: (address: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  initialValue?: string;
}

export default function StoreSearchBar({
  onSearch,
  isLoading = false,
  placeholder = "Enter an address or postcode to find stores near you",
  initialValue = "",
}: StoreSearchBarProps) {
  const [searchValue, setSearchValue] = useState(initialValue);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim() && !isLoading) {
      onSearch(searchValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading || !searchValue.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="sr-only">Searching...</span>
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </form>
  );
}

