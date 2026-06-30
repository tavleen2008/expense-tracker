import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from './Card'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-US', {
    currency: 'USD',
    style: 'currency',
  })
}

function formatYAxis(value) {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
  return `$${value}`
}

function CustomTooltip({ active, label, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-white/60 bg-white/95 px-4 py-3 shadow-xl shadow-[#3D405B]/10 backdrop-blur-sm">
        <p className="text-sm font-bold text-[#3D405B]">{label}</p>
        <p className="mt-1 text-lg font-black text-[#81B29A]">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

function MonthlyBarChart({ data = [] }) {
  const isEmpty = !data || data.length === 0

  // data from backend: [{ _id: monthNumber (1-12), total }]
  const chartData = data.map((item) => ({
    month: MONTH_NAMES[(item._id || 1) - 1],
    total: item.total,
  }))

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-black text-[#3D405B]">
          Monthly Spending
        </h2>
        <span className="rounded-full bg-[#81B29A]/20 px-3 py-1 text-xs font-bold text-[#3D405B]/65">
          This year
        </span>
      </div>

      {isEmpty ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3">
          <div className="flex items-end gap-2">
            {[40, 60, 30, 70, 50].map((h, i) => (
              <div
                className="w-6 rounded-t-lg bg-[#F4F1DE]"
                key={i}
                style={{ height: h }}
              />
            ))}
          </div>
          <p className="text-sm text-[#3D405B]/50">No data yet</p>
        </div>
      ) : (
        <div className="mt-4">
          <ResponsiveContainer height={260} width="100%">
            <BarChart
              barSize={32}
              data={chartData}
              margin={{ bottom: 0, left: 0, right: 8, top: 8 }}
            >
              <CartesianGrid
                stroke="#3D405B"
                strokeDasharray="3 3"
                strokeOpacity={0.07}
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="month"
                style={{
                  fill: '#3D405B',
                  fontSize: '11px',
                  fontWeight: 600,
                  opacity: 0.55,
                }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tickFormatter={formatYAxis}
                tickLine={false}
                style={{
                  fill: '#3D405B',
                  fontSize: '11px',
                  fontWeight: 600,
                  opacity: 0.55,
                }}
                width={48}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: '#81B29A', opacity: 0.08, radius: 8 }}
              />
              <Bar
                dataKey="total"
                fill="#81B29A"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

export default MonthlyBarChart
