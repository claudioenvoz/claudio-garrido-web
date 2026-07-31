import { Suspense } from "react";
import ReservaWizard from "./ReservaWizard";

export default function ReservaPage() {
  return (
    <Suspense fallback={null}>
      <ReservaWizard />
    </Suspense>
  );
}