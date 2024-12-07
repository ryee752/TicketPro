"use client";

import { Suspense } from "react";
import PaymentWrapper from "./payment_wrapper";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <PaymentWrapper />
    </Suspense>
  );
}
