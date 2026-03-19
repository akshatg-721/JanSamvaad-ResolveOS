"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { OverviewSection } from "@/components/dashboard/sections/overview";

import { SettingsSection } from "../components/dashboard/sections/settings";
import { GisSection } from "../components/dashboard/sections/gismap";
import { LedgerSection } from "../components/dashboard/sections/ledger";
import { ActivitySection } from "../components/dashboard/sections/activity";
import { QrSection } from "../components/dashboard/sections/qr-scanner";
import { AnalyticsSection } from "../components/dashboard/sections/analytics";

import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api-client";

export type Section = "overview" | "gis" | "ledger" | "activity" | "analytics" | "settings";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>("gis");
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuth(true);
    }
  }, [router]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuth) return null;

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
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-out ${
          sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
        }`}
      >
        <Header activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-6 overflow-auto">
          <div
            key={activeSection}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
