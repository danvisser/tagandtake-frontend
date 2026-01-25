"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import PaymentsPage from "../../payments/components/PaymentsPage";
import PinEntryPage from "./components/PinEntryPage";
import { validateStorePin } from "@src/api/storeApi";

export default function StorePayments() {
  const [isPinValidated, setIsPinValidated] = useState(false);
  const pathname = usePathname();

  // Reset PIN validation when navigating to this page
  useEffect(() => {
    setIsPinValidated(false);
  }, [pathname]);

  const handlePinValidate = async (pin: string): Promise<boolean> => {
    const result = await validateStorePin(pin);
    if (result.success) {
      setIsPinValidated(true);
      return true;
    }
    return false;
  };

  if (!isPinValidated) {
    return <PinEntryPage onValidate={handlePinValidate} />;
  }

  return <PaymentsPage />;
}
