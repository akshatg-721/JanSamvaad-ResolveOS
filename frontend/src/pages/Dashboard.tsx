import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { OverviewSection } from "@/components/dashboard/sections/overview";
import { MobileClientDashboard } from "@/components/dashboard/mobile-client-dashboard";
import { SettingsSection } from "@/components/dashboard/sections/settings";
import { GisSection } from "@/components/dashboard/sections/gismap";
import { LedgerSection } from "@/components/dashboard/sections/ledger";
import { ActivitySection } from "@/components/dashboard/sections/activity";
import { AnalyticsSection } from "@/components/dashboard/sections/analytics";
import type { Section } from "@/lib/types";
import { requireFrontendAuth } from "@/lib/auth/client";

const VALID_SECTIONS: Section[] = [
  "overview",
  "gis",
  "ledger",
  "activity",
  "analytics",
  "settings",
];

function toSection(value: string | undefined): Section {
  return VALID_SECTIONS.includes(value as Section) ? (value as Section) : "overview";
}

export default function Dashboard() {
  const params = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState<Section>(toSection(params.section));
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const authorized = requireFrontendAuth();
    if (!authorized) {
      navigate("/login", { replace: true });
      return;
    }
    setIsAuthorized(true);
  }, [navigate]);

  useEffect(() => {
    setActiveSection(toSection(params.section));
  }, [params.section]);

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    const target = section === "overview" ? "/dashboard" : `/dashboard/${section}`;
    if (location.pathname !== target) {
      navigate(target);
    }
  };

  const renderedSection = useMemo(() => {
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
  }, [activeSection]);

  if (!isAuthorized) {
    return <div className="min-h-screen bg-[#060b1d]" />;
  }

  return (
    <>
      <div className="lg:hidden">
        <MobileClientDashboard />
      </div>
      <div className="hidden min-h-screen bg-[#060b1d] text-white lg:flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
        <div
          className={`flex flex-1 flex-col bg-[radial-gradient(circle_at_top_right,rgba(0,255,148,0.08),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(0,153,255,0.08),transparent_35%)] transition-all duration-300 ease-out ${
            sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
          }`}
        >
          <Header activeSection={activeSection} />
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div key={activeSection} className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
              {renderedSection}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
