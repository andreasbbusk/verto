"use client";

import { SetsProvider } from "./sets-context";
import { SetsContent, SetsDialogs, SetsHeader } from "./sets-sections";

type SetsViewProps = {
  shouldOpenCreate?: boolean;
};

export function SetsView({ shouldOpenCreate }: SetsViewProps) {
  return (
    <SetsProvider shouldOpenCreate={shouldOpenCreate}>
      <div className="space-y-8">
        <SetsHeader />
        <SetsDialogs />
        <SetsContent />
      </div>
    </SetsProvider>
  );
}
