import { Suspense } from "react";
import VerifyRequestClient from "./VerifyRequestClient";

export default function Page() {
  return (
    <Suspense>
      <VerifyRequestClient />
    </Suspense>
  );
}
