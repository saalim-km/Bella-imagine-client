import { cn } from "@/lib/utils";
import Header from "@/components/common/Header";
import React from "react";

type PageLayoutProps = {
  children: React.ReactNode;
  containerClassName?: string;
};

export function PageLayout({
  children,
  containerClassName = "",
}: PageLayoutProps) {
  return (
    <>
      <Header />
      <div className="relative min-h-screen flex flex-col">
        <main className="flex-1">
          <div className={cn("container", containerClassName)}>{children}</div>
        </main>
      </div>
    </>
  );
}
