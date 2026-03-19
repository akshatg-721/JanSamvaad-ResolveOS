"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, ExternalLink, Hash, QrCode, X, Loader2, Plus } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { apiFetch } from "@/lib/api-client";

type Ticket = {
  id: number;
  ref: string;
  category: string;
  ward_id: number;
  severity: string;
  status: string;
  created_at: string;
  phone: string;
};

export function LedgerSection() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingQR, setGeneratingQR] = useState<number | null>(null);
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [qrToken, setQrToken] = useState<string | null>(null);
  
  // Manual Ticket State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTicket, setNewTicket] = useState({
    phone: "",
    category: "General",
    ward_id: "1",
    severity: "Medium"
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await apiFetch<Ticket[]>('/api/tickets');
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async (ticket: Ticket) => {
    setGeneratingQR(ticket.id);
    try {
      const data = await apiFetch<{token: string}>(`/api/tickets/${ticket.id}/generate-qr`, {
        method: 'POST'
      });
      setSelectedTicket(ticket);
      setQrToken(data.token);
    } catch (err) {
      console.error("Failed to generate QR token", err);
      alert("Failed to generate secure QR token. Error: " + (err as Error).message);
    } finally {
      setGeneratingQR(null);
    }
  };

  const closeQRModal = () => {
    setSelectedTicket(null);
    setQrToken(null);
    fetchTickets(); // Refresh tickets in case it was resolved
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await apiFetch('/api/tickets', {
        method: 'POST',
        body: JSON.stringify({
          phone: newTicket.phone,
          category: newTicket.category,
          ward_id: parseInt(newTicket.ward_id),
          severity: newTicket.severity
        })
      });
      setIsAddOpen(false);
      setNewTicket({ phone: "", category: "General", ward_id: "1", severity: "Medium" });
      fetchTickets();
    } catch (err) {
      console.error("Failed to create ticket", err);
      alert("Failed to create grievance. Error: " + (err as Error).message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Grievance Ledger</h2>
          <p className="text-muted-foreground mt-1">Live immutable record of citizen grievances and resolutions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-card border-border">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="bg-card border-border text-accent border-accent/30 hover:bg-accent/10">
            <Hash className="w-4 h-4 mr-2" />
            Verify Blockchain
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_0_15px_rgba(var(--accent),0.3)] transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Add Grievance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-border">
              <DialogHeader>
                <DialogTitle>Manual Grievance Entry</DialogTitle>
                <DialogDescription>
                  Record a grievance that was received manually (e.g. walk-in or offline).
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTicket} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Citizen Phone matching</Label>
                  <Input 
                    id="phone" 
                    placeholder="+919876543210" 
                    value={newTicket.phone}
                    onChange={(e) => setNewTicket({...newTicket, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newTicket.category} onValueChange={(val) => setNewTicket({...newTicket, category: val})}>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sanitation">Sanitation</SelectItem>
                      <SelectItem value="Water Supply">Water Supply</SelectItem>
                      <SelectItem value="Road Damage">Road Damage</SelectItem>
                      <SelectItem value="Electricity">Electricity</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ward">Ward</Label>
                    <Select value={newTicket.ward_id} onValueChange={(val) => setNewTicket({...newTicket, ward_id: val})}>
                      <SelectTrigger><SelectValue placeholder="Ward" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ward 1</SelectItem>
                        <SelectItem value="2">Ward 2</SelectItem>
                        <SelectItem value="3">Ward 3</SelectItem>
                        <SelectItem value="4">Ward 4</SelectItem>
                        <SelectItem value="5">Ward 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={newTicket.severity} onValueChange={(val) => setNewTicket({...newTicket, severity: val})}>
                      <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isAdding} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Submit Grievance
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search by ID, Category or Ward..."
                className="w-full bg-background/50 border border-border rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-accent transition-all"
              />
            </div>
            <Button variant="outline" className="bg-background/50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden relative min-h-[400px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : null}
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-bold">Ticket ID</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Ward</TableHead>
                  <TableHead className="font-bold text-center">Severity</TableHead>
                  <TableHead className="font-bold text-center">Status</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} className="border-border hover:bg-secondary/30 transition-colors group">
                    <TableCell className="font-mono text-xs font-bold text-accent">{ticket.ref}</TableCell>
                    <TableCell className="font-medium">{ticket.category}</TableCell>
                    <TableCell className="text-muted-foreground">{ticket.ward_id ? `Ward ${ticket.ward_id}` : 'Unassigned'}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={
                        ticket.severity === "Critical" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        ticket.severity === "High" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }>
                        {ticket.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <div className={
                          "w-1.5 h-1.5 rounded-full " + 
                          (ticket.status === "closed" || ticket.status === "resolved" ? "bg-green-500" : ticket.status === "open" ? "bg-red-500" : "bg-orange-500 animate-pulse")
                        } />
                        {ticket.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      {ticket.status === 'open' && (
                        <Button 
                          onClick={() => handleGenerateQR(ticket)}
                          size="sm" 
                          variant="outline"
                          disabled={generatingQR === ticket.id}
                          className="border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground gap-2"
                        >
                          {generatingQR === ticket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                          Resolve
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hidden md:inline-flex">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {tickets.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        No active tickets found.
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modern Glassmorphism QR Rating Modal */}
      {qrToken && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-background/95 border border-white/10 p-8 rounded-[2rem] shadow-2xl overflow-hidden">
            {/* Decorative glares */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/20 blur-[50px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />
            
            <button 
              onClick={closeQRModal}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <QrCode className="w-8 h-8 text-accent" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 text-center">Authenticate Resolution</h3>
              <p className="text-white/60 text-center mb-8 text-sm px-4">
                Ask the citizen who reported <strong className="text-white">{selectedTicket.ref}</strong> to scan this QR code to provide feedback and securely close this ticket.
              </p>

              <div className="bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-transform hover:scale-105 duration-300">
                <QRCodeSVG 
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/feedback/${selectedTicket.id}?token=${qrToken}`}
                  size={200}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-accent/80">
                 <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                 Waiting for citizen to scan...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
