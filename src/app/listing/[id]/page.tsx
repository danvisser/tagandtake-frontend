"use client";

import AuthenticatedPage from "@src/components/AuthenticatedPage";
import ListingContainer from "./components/ListingContainer";

export default function ListingPage() {
  return (
    <AuthenticatedPage>
      <ListingContainer />
    </AuthenticatedPage>
  );
}
