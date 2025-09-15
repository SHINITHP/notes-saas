"use client";

import MembersPage from "@/components/MembersPage";
import { PageWrapper } from "@/components/page-wrapper";

export default function Members() {
  return (
    <PageWrapper>
      <div className="w-full">
        <MembersPage />
      </div>
    </PageWrapper>
  );
}
