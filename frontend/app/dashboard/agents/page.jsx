'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { buildAgentPerformanceData, getAgentInsights, getRecentTicketRows } from '@/lib/mock-agents'
import { ArrowUpRight, ArrowDownRight, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react'

const AgentScoreRing = dynamic(
  () => import('@/components/agent-performance-charts').then((module) => module.AgentScoreRing),
  { ssr: false }
)
const AgentRadar = dynamic(
  () => import('@/components/agent-performance-charts').then((module) => module.AgentRadar),
  { ssr: false }
)
const WardBarChart = dynamic(
  () => import('@/components/agent-performance-charts').then((module) => module.WardBarChart),
  { ssr: false }
)

function initials(name) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function trendCell(delta) {
  if (delta >= 0) {
    return (
      <div className="inline-flex items-center gap-1 text-emerald-600">
        <ArrowUpRight className="h-3.5 w-3.5" />
        <span className="font-medium">+{delta.toFixed(1)}%</span>
      </div>
    )
  }
  return (
    <div className="inline-flex items-center gap-1 text-rose-600">
      <ArrowDownRight className="h-3.5 w-3.5" />
      <span className="font-medium">{delta.toFixed(1)}%</span>
    </div>
  )
}

function tierBadge(agent) {
  return (
    <Badge style={{ backgroundColor: `${agent.tier.color}20`, color: agent.tier.color, borderColor: `${agent.tier.color}50` }} variant="outline">
      {agent.tier.emoji} {agent.tier.name}
    </Badge>
  )
}

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState('leaderboard')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('score')

  const agents = useMemo(() => buildAgentPerformanceData(), [])
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || null)
  const selectedAgent = useMemo(() => agents.find((item) => item.id === selectedAgentId) || agents[0], [agents, selectedAgentId])
  const insights = useMemo(() => getAgentInsights(agents), [agents])

  const filteredAgents = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const searched = agents.filter((agent) => {
      if (!normalized) return true
      return agent.name.toLowerCase().includes(normalized) || agent.ward.toLowerCase().includes(normalized)
    })
    const sorted = [...searched]
    if (sortBy === 'score') sorted.sort((a, b) => b.sevaScore - a.sevaScore)
    if (sortBy === 'speed') sorted.sort((a, b) => b.speed - a.speed)
    if (sortBy === 'quality') sorted.sort((a, b) => b.quality - a.quality)
    if (sortBy === 'volume') sorted.sort((a, b) => b.volume - a.volume)
    return sorted
  }, [agents, query, sortBy])

  const topRowsAccent = ['#F59E0B', '#94A3B8', '#CD7F32']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Agent Performance — Seva Score</h1>
        <p className="text-sm text-slate-500">Performance intelligence for field officers across Delhi wards</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="grid w-full max-w-xl grid-cols-3">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="profile">Individual Profile</TabsTrigger>
          <TabsTrigger value="insights">Admin Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Seva Leaderboard</CardTitle>
                  <CardDescription>Ranked by composite Seva Score</CardDescription>
                </div>
                <div className="flex w-full gap-2 sm:w-auto">
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search name or ward"
                    className="w-full sm:w-[220px]"
                  />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score">Score</SelectItem>
                      <SelectItem value="speed">Speed</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Seva Score</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Tickets (MTD)</TableHead>
                    <TableHead>Avg Resolution</TableHead>
                    <TableHead>Streak</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent, index) => (
                    <TableRow
                      key={agent.id}
                      onClick={() => {
                        setSelectedAgentId(agent.id)
                        setActiveTab('profile')
                      }}
                      className="cursor-pointer hover:bg-slate-50"
                      style={index < 3 ? { boxShadow: `inset 4px 0 0 ${topRowsAccent[index]}` } : undefined}
                    >
                      <TableCell className="font-semibold">#{agent.rank}</TableCell>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell className="text-slate-600">{agent.ward}</TableCell>
                      <TableCell className="text-lg font-bold" style={{ color: agent.tier.color }}>{agent.sevaScore}</TableCell>
                      <TableCell>{tierBadge(agent)}</TableCell>
                      <TableCell>{agent.ticketsMTD}</TableCell>
                      <TableCell>{agent.avgResolutionTime}h</TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-1.5">
                          <span className="font-medium">{agent.streakDays}d</span>
                          {agent.streakBadge ? <span>{agent.streakBadge}</span> : null}
                        </div>
                      </TableCell>
                      <TableCell>{trendCell(agent.trendDelta)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          {selectedAgent ? (
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-slate-100 text-slate-700">{initials(selectedAgent.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{selectedAgent.name}</h2>
                        <p className="text-sm text-slate-500">{selectedAgent.designation}</p>
                        <p className="text-sm text-slate-500">{selectedAgent.ward}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {tierBadge(selectedAgent)}
                      {selectedAgent.isChampion ? (
                        <Badge className="bg-amber-500 text-white hover:bg-amber-500">🏆 Seva Champion</Badge>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Seva Score</CardTitle>
                    <CardDescription>Composite score across speed, quality, and volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AgentScoreRing score={selectedAgent.sevaScore} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dimension Radar</CardTitle>
                    <CardDescription>Three-dimensional performance signature</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AgentRadar
                      speed={selectedAgent.speed}
                      quality={selectedAgent.quality}
                      volume={selectedAgent.volume}
                    />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Sub-scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-orange-600">Speed</span>
                      <span>{selectedAgent.speed}</span>
                    </div>
                    <Progress value={selectedAgent.speed} className="[&>div]:bg-orange-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-emerald-600">Quality</span>
                      <span>{selectedAgent.quality}</span>
                    </div>
                    <Progress value={selectedAgent.quality} className="[&>div]:bg-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-sky-600">Volume</span>
                      <span>{selectedAgent.volume}</span>
                    </div>
                    <Progress value={selectedAgent.volume} className="[&>div]:bg-sky-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Last 10 Tickets Handled</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Resolution Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getRecentTicketRows(selectedAgent).map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                          <TableCell>
                            <Badge variant={ticket.status === 'Resolved' ? 'default' : 'destructive'}>{ticket.status}</Badge>
                          </TableCell>
                          <TableCell>{ticket.resolutionHours == null ? 'Pending' : `${ticket.resolutionHours}h`}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="insights">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Weakest Ward</CardDescription>
                  <CardTitle className="text-base">
                    {insights.weakestWard ? insights.weakestWard.ward : 'N/A'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Average score: <span className="font-semibold">{insights.weakestWard?.avgScore ?? '—'}</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>SLA Risk</CardDescription>
                  <CardTitle className="text-base">{insights.slaRiskAgents.length} agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">Agents with more than 3 SLA breaches this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Rising Stars</CardDescription>
                  <CardTitle className="text-base">{insights.risingStars.length} agents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {insights.risingStars.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{agent.name}</span>
                      <span className="text-emerald-600">+{agent.trendDelta.toFixed(1)}%</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-slate-500" />
                  Ward-wise Average Seva Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WardBarChart data={insights.wardAverages} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                  SLA Breach Review Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Ward</TableHead>
                      <TableHead>SLA Breaches</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insights.reviewList.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>{agent.ward}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{agent.slaBreaches}</Badge>
                        </TableCell>
                        <TableCell>{trendCell(agent.trendDelta)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            <Sparkles className="mr-1 h-3.5 w-3.5" />
                            Flag for Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
