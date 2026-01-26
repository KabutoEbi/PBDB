import { useMemo } from 'react'
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
} from 'recharts'


function Graph({ books, period, setPeriod, status, setStatus, year, setYear, yearList, month, setMonth, monthList }) {
    // データ生成
    const data = useMemo(() => {
        if (period === 'year') {
            // 年間: 横軸は月（1〜12）、各月の選択ステータス冊数
            const monthCount = books.filter(b => (status === 'all' ? true : b.status === status) && b.date && b.date.startsWith(year.toString())).reduce((acc, b) => {
                const m = b.date?.slice(5, 7)
                if (m) acc[m] = (acc[m] || 0) + 1
                return acc
            }, {})
            return Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, '0')
                return { month: String(i + 1), count: monthCount[m] || 0 }
            })
        } else {
            // 月間: 横軸は日（1〜31）、選択年月の各日の選択ステータス冊数
            const ym = `${year}-${String(month).padStart(2, '0')}`
            const lastDay = new Date(year, month, 0).getDate();
            const dayCount = books.filter(b => (status === 'all' ? true : b.status === status) && b.date && b.date.startsWith(ym)).reduce((acc, b) => {
                const d = b.date?.slice(8, 10)
                if (d) acc[d] = (acc[d] || 0) + 1
                return acc
            }, {})
            return Array.from({ length: lastDay }, (_, i) => {
                const d = String(i + 1).padStart(2, '0')
                return { day: String(i + 1), count: dayCount[d] || 0 }
            })
        }
    }, [books, period, status, year, month])

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-4 items-center">
                {period === 'month' && (
                    <select className="border rounded px-2 py-1 text-sm" value={month} onChange={e => setMonth(Number(e.target.value))}>
                        {[...Array(12)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1}月</option>
                        ))}
                    </select>
                )}
            </div>
            {period === 'year' ? (
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px #0001' }} cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" minTickGap={0} tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px #0001' }} cursor={{ fill: 'transparent' }} />
                        <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

export default Graph
