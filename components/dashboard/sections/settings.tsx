"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Mail, Building, MapPin, KeyRound, Fingerprint, Lock, ShieldAlert } from "lucide-react";

export function SettingsSection() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Government Identity</h2>
        <p className="text-muted-foreground mt-1">Manage your secure verified official profile and access controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Identity Card */}
        <Card className="col-span-1 border-border bg-card/50 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-accent/20 to-transparent" />
          <CardHeader className="relative pt-6 pb-2 text-center">
            <div className="mx-auto w-24 h-24 bg-background border-4 border-accent/20 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
               <span className="text-4xl font-bold text-accent">OP</span>
            </div>
            <CardTitle className="text-xl">Operator Alpha</CardTitle>
            <div className="flex justify-center mt-2">
               <Badge className="bg-accent/10 border-accent/30 text-accent gap-1">
                 <ShieldCheck className="w-3 h-3" />
                 Verified Official
               </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-sm border-b border-border/50 pb-3">
              <KeyRound className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Operator ID</p>
                <p className="font-mono text-foreground">OP-77X9-DEL</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm border-b border-border/50 pb-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Official Email</p>
                <p className="text-foreground">alpha.op@resolveos.gov.in</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Building className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Department</p>
                <p className="text-foreground">Urban Infrastructure</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Controls & Security */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                Jurisdiction & Clearance
              </CardTitle>
              <CardDescription>Your current administrative assignments and access levels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-secondary/50 p-4 rounded-xl border border-white/5">
                   <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Clearance Level</p>
                   <div className="flex items-center gap-2">
                     <Lock className="w-4 h-4 text-orange-500" />
                     <span className="font-bold text-lg text-foreground">Level 4 (Regional)</span>
                   </div>
                 </div>
                 <div className="bg-secondary/50 p-4 rounded-xl border border-white/5">
                   <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Active Region</p>
                   <div className="flex items-center gap-2">
                     <span className="font-bold text-lg text-foreground">Delhi NCR</span>
                   </div>
                 </div>
               </div>

               <div>
                 <h4 className="text-sm font-semibold mb-3 text-foreground">Assigned Wards</h4>
                 <div className="flex flex-wrap gap-2">
                   {['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'].map(ward => (
                     <Badge key={ward} variant="outline" className="border-accent/20 bg-accent/5 py-1.5 px-3">
                       {ward}
                     </Badge>
                   ))}
                 </div>
               </div>
            </CardContent>
          </Card>

           <Card className="border-border bg-card/50 backdrop-blur-sm border-l-4 border-l-orange-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Fingerprint className="w-4 h-4" />
                Security Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Require biometrics / OTP for high-severity ticket closure.</p>
                </div>
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div>
                  <p className="text-sm font-medium text-foreground text-red-400">Emergency Protocol</p>
                  <p className="text-xs text-muted-foreground">Trigger national escalation for priority 1 crises.</p>
                </div>
                <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white">
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Initiate Lock
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
