"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Camera, ShieldCheck, CheckCircle2, History, Loader2 } from "lucide-react";

export function QrSection() {
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">QR Verification</h2>
          <p className="text-muted-foreground mt-2">Scan grievance tokens or officer IDs for instant verification on the blockchain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <Card className="bg-card/50 backdrop-blur-xl border-dashed border-2 border-border flex flex-col items-center justify-center aspect-square relative overflow-hidden group">
             {scanning && (
               <div className="absolute inset-0 bg-accent/5 z-10 flex flex-col items-center justify-center gap-4">
                 <div className="w-48 h-1 bg-accent/50 absolute top-0 left-0 right-0 animate-scan-line shadow-[0_0_15px_rgba(var(--accent),0.5)]" />
                 <Loader2 className="w-10 h-10 text-accent animate-spin" />
                 <p className="text-accent font-mono text-sm font-bold uppercase tracking-widest">Scanning Network...</p>
               </div>
             )}

             {success ? (
               <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                 <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                   <CheckCircle2 className="w-12 h-12" />
                 </div>
                 <div className="text-center">
                    <p className="text-xl font-bold text-foreground">Verification Successful</p>
                    <p className="text-sm text-muted-foreground mt-1">Grievance JS-101 verified at Block #4192</p>
                 </div>
               </div>
             ) : (
               <>
                 <div className="w-32 h-32 rounded-3xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <QrCode className="w-16 h-16 text-muted-foreground" />
                 </div>
                 <Button 
                   onClick={handleScan}
                   disabled={scanning}
                   className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-12 rounded-xl text-lg font-bold shadow-xl active:scale-95 transition-all"
                 >
                   <Camera className="w-5 h-5 mr-3" />
                   Launch Scanner
                 </Button>
               </>
             )}
          </Card>

          <div className="space-y-4">
             <Card className="bg-card/50 border-border">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium flex items-center gap-2">
                     <ShieldCheck className="w-4 h-4 text-accent" />
                     Security Protocol
                   </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  All scans are cryptographically verified against the municipal ledger. Unauthorized access attempts are logged.
                </CardContent>
             </Card>

             <Card className="bg-card/50 border-border">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium flex items-center gap-2">
                     <History className="w-4 h-4 text-muted-foreground" />
                     Recent Scans
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   {[
                     { id: "JS-101", user: "Harsheet D.", time: "10:24 AM" },
                     { id: "JS-892", user: "Officer 412", time: "09:45 AM" },
                     { id: "JS-744", user: "Citizen V.", time: "Yesterday" }
                   ].map((scan, i) => (
                     <div key={i} className="flex justify-between items-center text-xs p-2 rounded bg-secondary/30">
                        <span className="font-mono text-accent">{scan.id}</span>
                        <span className="text-foreground">{scan.user}</span>
                        <span className="text-muted-foreground">{scan.time}</span>
                     </div>
                   ))}
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
