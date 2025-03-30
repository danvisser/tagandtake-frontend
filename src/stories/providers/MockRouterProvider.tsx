"use client";

import { ReactNode } from "react";

export function MockRouterProvider({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

// Mock router functions
export const mockRouter = {
  push: () => {},
  replace: () => {},
  refresh: () => {},
  back: () => {},
  forward: () => {},
};

export const mockPathname = "";
export const mockSearchParams = new URLSearchParams();
