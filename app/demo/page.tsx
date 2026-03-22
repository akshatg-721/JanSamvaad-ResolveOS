"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { OverviewSection } from "@/components/dashboard/sections/overview";
import { MobileClientDashboard } from "@/components/dashboard/mobile-client-dashboard";

import { SettingsSection } from "@/components/dashboard/sections/settings";
import { GisSection } from "@/components/dashboard/sections/gismap";
import { LedgerSection } from "@/components/dashboard/sections/ledger";
import { ActivitySection } from "@/components/dashboard/sections/activity";
import { AnalyticsSection } from "@/components/dashboard/sections/analytics";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Section } from "@/lib/types";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (status === "loading" || status === "unauthenticated") return <div className="min-h-screen bg-[#060b1d]" />;

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "gis":
        return <GisSection />;
      case "ledger":
        return <LedgerSection />;
      case "activity":
        return <ActivitySection />;
      case "analytics":
        return <AnalyticsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <>
      <div className="lg:hidden">
        <MobileClientDashboard />
      </div>
      <div className="hidden lg:flex min-h-screen bg-[#060b1d] text-white">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-out bg-[radial-gradient(circle_at_top_right,rgba(0,255,148,0.08),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(0,153,255,0.08),transparent_35%)] ${
            sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
          }`}
        >
          <Header activeSection={activeSection} />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div
              key={activeSection}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
