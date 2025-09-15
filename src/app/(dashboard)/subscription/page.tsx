"use client";

import { PageWrapper } from "@/components/page-wrapper";
import Pricing from "@/components/pricing";

export default function Subscription() {
  return (
    <PageWrapper>
      <div className="flex w-full justify-center items-center">
        <Pricing />
      </div>
    </PageWrapper>
  );
}
