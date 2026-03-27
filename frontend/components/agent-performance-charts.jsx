'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell
} from 'recharts'

export function AgentScoreRing({ score }) {
  const ringData = [{ name: 'Seva Score', value: score }]
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="95%"
          data={ringData}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={12}
            fill="#F59E0B"
            background={{ fill: 'rgba(148,163,184,0.15)' }}
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#0f172a" className="font-bold text-3xl">
            {score}
          </text>
          <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="#64748b" className="text-xs">
            Seva Score
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AgentRadar({ speed, quality, volume }) {
  const radarData = [
    { dimension: 'Speed', value: speed },
    { dimension: 'Quality', value: quality },
    { dimension: 'Volume', value: volume }
  ]
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData}>
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: '#334155', fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Radar dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function WardBarChart({ data }) {
  const colorByScore = (score) => {
    if (score >= 85) return '#F59E0B'
    if (score >= 65) return '#94A3B8'
    if (score >= 45) return '#CD7F32'
    return '#EF4444'
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 20, left: 20, bottom: 8 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
          <YAxis type="category" dataKey="ward" width={170} tick={{ fill: '#334155', fontSize: 11 }} />
          <Tooltip
            cursor={{ fill: 'rgba(148,163,184,0.08)' }}
            contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px' }}
          />
          <Bar dataKey="avgScore" radius={[0, 6, 6, 0]}>
            {data.map((entry) => (
              <Cell key={entry.ward} fill={colorByScore(entry.avgScore)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
