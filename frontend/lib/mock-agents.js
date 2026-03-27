const DAY_MS = 24 * 60 * 60 * 1000

const RAW_AGENTS = [
  {
    id: 'agt-001',
    name: 'Aditi Sharma',
    designation: 'Senior Field Officer',
    ward: 'Ward 12 - Karol Bagh',
    ticketsMTD: 58,
    streakDays: 31,
    recentTickets: [
      { id: 'JS-A10K21', status: 'Resolved', resolutionHours: 5, slaHours: 8, reopened: 0, csat: 5 },
      { id: 'JS-A10K22', status: 'Resolved', resolutionHours: 4, slaHours: 8, reopened: 0, csat: 5 },
      { id: 'JS-A10K23', status: 'Resolved', resolutionHours: 7, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-A10K24', status: 'Resolved', resolutionHours: 8, slaHours: 12, reopened: 0, csat: 5 },
      { id: 'JS-A10K25', status: 'Resolved', resolutionHours: 9, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-A10K26', status: 'Resolved', resolutionHours: 6, slaHours: 8, reopened: 0, csat: 5 },
      { id: 'JS-A10K27', status: 'Resolved', resolutionHours: 11, slaHours: 12, reopened: 0, csat: 5 },
      { id: 'JS-A10K28', status: 'Resolved', resolutionHours: 6, slaHours: 12, reopened: 0, csat: 5 },
      { id: 'JS-A10K29', status: 'Resolved', resolutionHours: 10, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-A10K30', status: 'Resolved', resolutionHours: 5, slaHours: 8, reopened: 0, csat: 5 }
    ],
    trendDelta: 4.3
  },
  {
    id: 'agt-002',
    name: 'Rohit Verma',
    designation: 'Ward Operations Officer',
    ward: 'Ward 07 - Lajpat Nagar',
    ticketsMTD: 52,
    streakDays: 16,
    recentTickets: [
      { id: 'JS-B20K31', status: 'Resolved', resolutionHours: 9, slaHours: 8, reopened: 1, csat: 4 },
      { id: 'JS-B20K32', status: 'Resolved', resolutionHours: 10, slaHours: 12, reopened: 0, csat: 5 },
      { id: 'JS-B20K33', status: 'Resolved', resolutionHours: 13, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-B20K34', status: 'Resolved', resolutionHours: 7, slaHours: 8, reopened: 0, csat: 4 },
      { id: 'JS-B20K35', status: 'Resolved', resolutionHours: 6, slaHours: 8, reopened: 0, csat: 5 },
      { id: 'JS-B20K36', status: 'Resolved', resolutionHours: 15, slaHours: 8, reopened: 0, csat: 4 },
      { id: 'JS-B20K37', status: 'Resolved', resolutionHours: 8, slaHours: 12, reopened: 0, csat: 5 },
      { id: 'JS-B20K38', status: 'Resolved', resolutionHours: 12, slaHours: 12, reopened: 0, csat: 5 },
      { id: 'JS-B20K39', status: 'Resolved', resolutionHours: 11, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-B20K40', status: 'Resolved', resolutionHours: 7, slaHours: 8, reopened: 0, csat: 5 }
    ],
    trendDelta: 2.1
  },
  {
    id: 'agt-003',
    name: 'Meena Khanna',
    designation: 'Citizen Services Officer',
    ward: 'Ward 18 - Dwarka',
    ticketsMTD: 46,
    streakDays: 8,
    recentTickets: [
      { id: 'JS-C30K41', status: 'Resolved', resolutionHours: 11, slaHours: 8, reopened: 0, csat: 4 },
      { id: 'JS-C30K42', status: 'Resolved', resolutionHours: 14, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-C30K43', status: 'Resolved', resolutionHours: 9, slaHours: 12, reopened: 0, csat: 5 },
      { id: 'JS-C30K44', status: 'Resolved', resolutionHours: 8, slaHours: 8, reopened: 0, csat: 4 },
      { id: 'JS-C30K45', status: 'Resolved', resolutionHours: 11, slaHours: 8, reopened: 0, csat: 4 },
      { id: 'JS-C30K46', status: 'Resolved', resolutionHours: 18, slaHours: 8, reopened: 1, csat: 3 },
      { id: 'JS-C30K47', status: 'Resolved', resolutionHours: 10, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-C30K48', status: 'Resolved', resolutionHours: 12, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-C30K49', status: 'Resolved', resolutionHours: 13, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-C30K50', status: 'Resolved', resolutionHours: 7, slaHours: 8, reopened: 0, csat: 5 }
    ],
    trendDelta: 0.9
  },
  {
    id: 'agt-004',
    name: 'Ankit Rana',
    designation: 'Field Response Lead',
    ward: 'Ward 03 - Shahdara',
    ticketsMTD: 44,
    streakDays: 6,
    recentTickets: [
      { id: 'JS-D40K51', status: 'Resolved', resolutionHours: 16, slaHours: 8, reopened: 1, csat: 3 },
      { id: 'JS-D40K52', status: 'Resolved', resolutionHours: 19, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-D40K53', status: 'Resolved', resolutionHours: 9, slaHours: 8, reopened: 0, csat: 4 },
      { id: 'JS-D40K54', status: 'Resolved', resolutionHours: 22, slaHours: 12, reopened: 1, csat: 3 },
      { id: 'JS-D40K55', status: 'Resolved', resolutionHours: 7, slaHours: 8, reopened: 0, csat: 4 },
      { id: 'JS-D40K56', status: 'Open', resolutionHours: null, slaHours: 8, reopened: 0, csat: null },
      { id: 'JS-D40K57', status: 'Resolved', resolutionHours: 11, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-D40K58', status: 'Resolved', resolutionHours: 25, slaHours: 8, reopened: 0, csat: 3 },
      { id: 'JS-D40K59', status: 'Resolved', resolutionHours: 17, slaHours: 12, reopened: 0, csat: 3 },
      { id: 'JS-D40K60', status: 'Resolved', resolutionHours: 9, slaHours: 8, reopened: 0, csat: 4 }
    ],
    trendDelta: -1.2
  },
  {
    id: 'agt-005',
    name: 'Farhan Ali',
    designation: 'Ward Duty Officer',
    ward: 'Ward 09 - Saket',
    ticketsMTD: 39,
    streakDays: 3,
    recentTickets: [
      { id: 'JS-E50K61', status: 'Resolved', resolutionHours: 26, slaHours: 12, reopened: 1, csat: 3 },
      { id: 'JS-E50K62', status: 'Resolved', resolutionHours: 13, slaHours: 8, reopened: 1, csat: 3 },
      { id: 'JS-E50K63', status: 'Resolved', resolutionHours: 10, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-E50K64', status: 'Resolved', resolutionHours: 8, slaHours: 8, reopened: 0, csat: 4 },
      { id: 'JS-E50K65', status: 'Resolved', resolutionHours: 15, slaHours: 8, reopened: 0, csat: 3 },
      { id: 'JS-E50K66', status: 'Open', resolutionHours: null, slaHours: 8, reopened: 0, csat: null },
      { id: 'JS-E50K67', status: 'Resolved', resolutionHours: 18, slaHours: 12, reopened: 0, csat: 3 },
      { id: 'JS-E50K68', status: 'Resolved', resolutionHours: 31, slaHours: 12, reopened: 1, csat: 2 },
      { id: 'JS-E50K69', status: 'Resolved', resolutionHours: 14, slaHours: 12, reopened: 0, csat: 3 },
      { id: 'JS-E50K70', status: 'Resolved', resolutionHours: 9, slaHours: 8, reopened: 0, csat: 4 }
    ],
    trendDelta: -2.4
  },
  {
    id: 'agt-006',
    name: 'Priyanka Das',
    designation: 'Senior Resolution Officer',
    ward: 'Ward 14 - Rohini',
    ticketsMTD: 48,
    streakDays: 12,
    recentTickets: [
      { id: 'JS-F60K71', status: 'Resolved', resolutionHours: 8, slaHours: 8, reopened: 0, csat: 5 },
      { id: 'JS-F60K72', status: 'Resolved', resolutionHours: 12, slaHours: 12, reopened: 0, csat: 5 },
      { id: 'JS-F60K73', status: 'Resolved', resolutionHours: 9, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-F60K74', status: 'Resolved', resolutionHours: 7, slaHours: 8, reopened: 0, csat: 5 },
      { id: 'JS-F60K75', status: 'Resolved', resolutionHours: 10, slaHours: 12, reopened: 0, csat: 5 },
      { id: 'JS-F60K76', status: 'Resolved', resolutionHours: 11, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-F60K77', status: 'Resolved', resolutionHours: 13, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-F60K78', status: 'Resolved', resolutionHours: 15, slaHours: 8, reopened: 1, csat: 4 },
      { id: 'JS-F60K79', status: 'Resolved', resolutionHours: 8, slaHours: 8, reopened: 0, csat: 5 },
      { id: 'JS-F60K80', status: 'Resolved', resolutionHours: 6, slaHours: 8, reopened: 0, csat: 5 }
    ],
    trendDelta: 2.9
  },
  {
    id: 'agt-007',
    name: 'Deepak Nair',
    designation: 'Operations Associate',
    ward: 'Ward 04 - Mayur Vihar',
    ticketsMTD: 33,
    streakDays: 2,
    recentTickets: [
      { id: 'JS-G70K81', status: 'Resolved', resolutionHours: 23, slaHours: 8, reopened: 1, csat: 3 },
      { id: 'JS-G70K82', status: 'Resolved', resolutionHours: 19, slaHours: 12, reopened: 0, csat: 3 },
      { id: 'JS-G70K83', status: 'Open', resolutionHours: null, slaHours: 8, reopened: 0, csat: null },
      { id: 'JS-G70K84', status: 'Resolved', resolutionHours: 13, slaHours: 12, reopened: 0, csat: 3 },
      { id: 'JS-G70K85', status: 'Resolved', resolutionHours: 20, slaHours: 8, reopened: 0, csat: 2 },
      { id: 'JS-G70K86', status: 'Resolved', resolutionHours: 16, slaHours: 12, reopened: 0, csat: 3 },
      { id: 'JS-G70K87', status: 'Resolved', resolutionHours: 10, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-G70K88', status: 'Resolved', resolutionHours: 14, slaHours: 8, reopened: 1, csat: 3 },
      { id: 'JS-G70K89', status: 'Resolved', resolutionHours: 12, slaHours: 12, reopened: 0, csat: 3 },
      { id: 'JS-G70K90', status: 'Resolved', resolutionHours: 17, slaHours: 8, reopened: 0, csat: 3 }
    ],
    trendDelta: -3.2
  },
  {
    id: 'agt-008',
    name: 'Sonal Kapoor',
    designation: 'Field Coordination Officer',
    ward: 'Ward 16 - Janakpuri',
    ticketsMTD: 41,
    streakDays: 9,
    recentTickets: [
      { id: 'JS-H80K91', status: 'Resolved', resolutionHours: 10, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-H80K92', status: 'Resolved', resolutionHours: 9, slaHours: 8, reopened: 0, csat: 4 },
      { id: 'JS-H80K93', status: 'Resolved', resolutionHours: 11, slaHours: 12, reopened: 0, csat: 5 },
      { id: 'JS-H80K94', status: 'Resolved', resolutionHours: 13, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-H80K95', status: 'Resolved', resolutionHours: 8, slaHours: 8, reopened: 0, csat: 5 },
      { id: 'JS-H80K96', status: 'Resolved', resolutionHours: 18, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-H80K97', status: 'Resolved', resolutionHours: 12, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-H80K98', status: 'Resolved', resolutionHours: 9, slaHours: 8, reopened: 0, csat: 5 },
      { id: 'JS-H80K99', status: 'Resolved', resolutionHours: 14, slaHours: 12, reopened: 0, csat: 4 },
      { id: 'JS-H80K100', status: 'Resolved', resolutionHours: 7, slaHours: 8, reopened: 0, csat: 5 }
    ],
    trendDelta: 1.7
  }
]

function calculateSpeedScore(recentTickets) {
  if (!recentTickets.length) return 0
  const total = recentTickets.reduce((sum, ticket) => {
    if (ticket.status !== 'Resolved' || ticket.resolutionHours == null) return sum
    if (ticket.resolutionHours <= ticket.slaHours) return sum + 100
    if (ticket.resolutionHours <= ticket.slaHours * 2) return sum + 70
    if (ticket.resolutionHours <= ticket.slaHours * 3) return sum + 40
    return sum + 0
  }, 0)
  return Math.round(total / recentTickets.length)
}

function calculateQualityScore(recentTickets) {
  const reopens = recentTickets.reduce((sum, ticket) => sum + (ticket.reopened || 0), 0)
  const csatValues = recentTickets.filter((ticket) => typeof ticket.csat === 'number').map((ticket) => ticket.csat)
  const avgCsat = csatValues.length ? csatValues.reduce((a, b) => a + b, 0) / csatValues.length : 0
  const scoreWithPenalty = 100 - reopens * 30
  const scoreWithBonus = avgCsat > 4 ? scoreWithPenalty + 10 : scoreWithPenalty
  return Math.max(0, Math.min(100, Math.round(scoreWithBonus)))
}

function calculateVolumeScores(agents) {
  const maxCount = Math.max(...agents.map((agent) => agent.ticketsMTD), 1)
  return agents.map((agent) => Math.round((agent.ticketsMTD / maxCount) * 100))
}

function getTier(score) {
  if (score >= 85) return { name: 'Gold', emoji: '🥇', color: '#F59E0B' }
  if (score >= 65) return { name: 'Silver', emoji: '🥈', color: '#94A3B8' }
  if (score >= 45) return { name: 'Bronze', emoji: '🥉', color: '#CD7F32' }
  return { name: 'Needs Improvement', emoji: '⚠️', color: '#EF4444' }
}

function getStreakBadge(streakDays) {
  if (streakDays >= 30) return '⭐'
  if (streakDays >= 7) return '🔥'
  return ''
}

export function buildAgentPerformanceData() {
  const volumeScores = calculateVolumeScores(RAW_AGENTS)
  const scored = RAW_AGENTS.map((agent, index) => {
    const speed = calculateSpeedScore(agent.recentTickets)
    const quality = calculateQualityScore(agent.recentTickets)
    const volume = volumeScores[index]
    const sevaScore = Math.round(speed * 0.3 + quality * 0.4 + volume * 0.3)
    const tier = getTier(sevaScore)
    const streakBadge = getStreakBadge(agent.streakDays)
    const slaBreaches = agent.recentTickets.filter((ticket) => {
      if (ticket.status !== 'Resolved' || ticket.resolutionHours == null) return true
      return ticket.resolutionHours > ticket.slaHours
    }).length
    return {
      ...agent,
      speed,
      quality,
      volume,
      sevaScore,
      tier,
      streakBadge,
      avgResolutionTime: Number(
        (
          agent.recentTickets
            .filter((ticket) => ticket.resolutionHours != null)
            .reduce((sum, ticket) => sum + ticket.resolutionHours, 0) /
          Math.max(agent.recentTickets.filter((ticket) => ticket.resolutionHours != null).length, 1)
        ).toFixed(1)
      ),
      slaBreaches
    }
  }).sort((a, b) => b.sevaScore - a.sevaScore)

  return scored.map((agent, index) => ({
    ...agent,
    rank: index + 1,
    isChampion: index === 0
  }))
}

export function getAgentInsights(agents) {
  const byWard = agents.reduce((acc, agent) => {
    if (!acc[agent.ward]) {
      acc[agent.ward] = { ward: agent.ward, totalScore: 0, count: 0 }
    }
    acc[agent.ward].totalScore += agent.sevaScore
    acc[agent.ward].count += 1
    return acc
  }, {})

  const wardAverages = Object.values(byWard)
    .map((item) => ({
      ward: item.ward,
      avgScore: Math.round(item.totalScore / item.count)
    }))
    .sort((a, b) => a.avgScore - b.avgScore)

  const weakestWard = wardAverages[0] || null
  const slaRiskAgents = agents.filter((agent) => agent.slaBreaches > 3)
  const risingStars = agents
    .filter((agent) => agent.tier.name === 'Gold' && agent.trendDelta > 0)
    .sort((a, b) => b.trendDelta - a.trendDelta)
    .slice(0, 3)

  const reviewList = agents
    .filter((agent) => agent.slaBreaches > 3)
    .sort((a, b) => b.slaBreaches - a.slaBreaches)

  return {
    weakestWard,
    slaRiskAgents,
    risingStars,
    wardAverages,
    reviewList
  }
}

export function getAgentTrendSeries(agent) {
  const now = Date.now()
  return [
    { name: 'W-5', value: Math.max(0, Math.round(agent.sevaScore - 8 + agent.trendDelta)) },
    { name: 'W-4', value: Math.max(0, Math.round(agent.sevaScore - 5 + agent.trendDelta)) },
    { name: 'W-3', value: Math.max(0, Math.round(agent.sevaScore - 3 + agent.trendDelta)) },
    { name: 'W-2', value: Math.max(0, Math.round(agent.sevaScore - 2)) },
    { name: 'W-1', value: Math.max(0, Math.round(agent.sevaScore - 1)) },
    { name: 'Now', value: agent.sevaScore, timestamp: new Date(now).toISOString() }
  ]
}

export function getRecentTicketRows(agent) {
  return agent.recentTickets.slice(0, 10).map((ticket, index) => ({
    ...ticket,
    handledAt: new Date(Date.now() - index * DAY_MS).toISOString()
  }))
}
