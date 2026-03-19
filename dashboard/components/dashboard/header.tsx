"use client";

import { cn } from "@/lib/utils";
import type { Section } from "@/app/page";
import { Bell, Search, Calendar, User, LogOut, Settings as SettingsIcon, Moon, Sun } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { clearToken } from "@/lib/api-client";
import { useRouter } from "next/navigation";

interface HeaderProps {
  activeSection: Section;
}

const sectionTitles: Record<Section, string> = {
  overview: "Dashboard Overview",
  gis: "Geo-Intelligence Map",
  ledger: "Grievance Ledger",
  activity: "System Activity",
  analytics: "Data Intelligence",
  settings: "Settings & Profile",
};

export function Header({ activeSection, onSectionChange }: HeaderProps & { onSectionChange?: (s: Section) => void }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold text-foreground">
          {sectionTitles[activeSection]}
        </h1>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className={cn(
            "relative flex items-center transition-all duration-300",
            searchFocused ? "w-64" : "w-48"
          )}
        >
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
          />
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300 overflow-hidden"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </button>

        {/* User avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 rounded-lg overflow-hidden bg-secondary ring-2 ring-transparent hover:ring-accent/50 transition-all duration-200"
          >
            <div className="w-full h-full bg-gradient-to-br from-accent/80 to-chart-1 flex items-center justify-center text-xs font-semibold text-accent-foreground">
              OP
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-3 border-b border-border bg-secondary/30">
                <p className="text-sm font-medium leading-none text-foreground">Operator Alpha</p>
                <p className="text-xs text-muted-foreground mt-1.5 font-mono">ID: OP-77X9</p>
              </div>
              <div className="p-1">
                <button 
                  onClick={() => {
                     setProfileOpen(false);
                     if (onSectionChange) onSectionChange("settings");
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  Government Profile
                </button>
                <button 
                  onClick={() => {
                     setProfileOpen(false);
                     if (onSectionChange) onSectionChange("settings");
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-muted-foreground" />
                  System Preferences
                </button>
              </div>
              <div className="p-1 border-t border-border">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Secure Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
