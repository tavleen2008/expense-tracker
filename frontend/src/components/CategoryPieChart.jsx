import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import Card from './Card'

const CATEGORY_COLORS = {
  bills: '#F2CC8F',
  food: '#E07A5F',
  health: '#A8DADC',
  other: '#B5B5B5',
  shopping: '#81B29A',
  travel: '#3D405B',
}

const FALLBACK_COLORS = [
  '#E07A5F',
  '#81B29A',
  '#F2CC8F',
  '#3D405B',
  '#A8DADC',
  '#B5B5B5',
]

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-US', {
    currency: 'USD',
    style: 'currency',
  })
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const { name, value } = payload[0]
    return (
      <div className="rounded-2xl border border-white/60 bg-white/95 px-4 py-3 shadow-xl shadow-[#3D405B]/10 backdrop-blur-sm">
        <p className="text-sm font-bold capitalize text-[#3D405B]">{name}</p>
        <p className="mt-1 text-lg font-black text-[#E07A5F]">
          {formatCurrency(value)}
        </p>
      </div>
    )
  }
  return null
}

function CategoryPieChart({ data = [] }) {
  const isEmpty = !data || data.length === 0

  const chartData = data.map((item) => ({
    name: item.category,
    value: item.total,
  }))

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-black text-[#3D405B]">
          Spending by Category
        </h2>
        <span className="rounded-full bg-[#E07A5F]/15 px-3 py-1 text-xs font-bold text-[#E07A5F]">
          All time
        </span>
      </div>

      {isEmpty ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3">
          <div className="h-20 w-20 rounded-full bg-[#F4F1DE]" />
          <p className="text-sm text-[#3D405B]/50">No data yet</p>
        </div>
      ) : (
        <div className="mt-4">
          <ResponsiveContainer height={260} width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={chartData}
                dataKey="value"
                innerRadius={60}
                nameKey="name"
                outerRadius={100}
                paddingAngle={3}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    fill={
                      CATEGORY_COLORS[entry.name] ||
                      FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                    }
                    key={entry.name}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-xs font-semibold capitalize text-[#3D405B]">
                    {value}
                  </span>
                )}
                iconSize={10}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

export default CategoryPieChart
