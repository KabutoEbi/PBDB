
import { useState, useEffect, useRef } from 'react'
import { CalendarDays } from 'lucide-react'

function ReadingActivity({ books }) {
  // 今年の1月1日から365日分の日付リストを作成
  const start = new Date(new Date().getFullYear(), 0, 1)
  const days = Array.from({ length: 365 }, (__, i) => {
    const d = new Date(start.getFullYear(), 0, 2 + i) //なんで2+かは謎
    return d.toISOString().slice(0, 10)
  })
  // booksから読了日ごとの冊数を集計
  const dateCount = books.filter(b => b.status === 'read' && b.date).reduce((acc, b) => {
    acc[b.date] = (acc[b.date] || 0) + 1
    return acc
  }, {})


  // 枠の幅いっぱいにセルを表示するためのカラム数・セルサイズ自動計算
  const [columns, setColumns] = useState(35)
  const [cellSize, setCellSize] = useState(18)
  const gridRef = useRef(null)

  useEffect(() => {
    function updateGrid() {
      const minCell = 14; // px
      const maxCell = 24; // px
      const minColumns = 7;
      const maxColumns = 60;
      const totalDays = days.length;
      let width = 600;
      if (gridRef.current && gridRef.current.parentElement) {
        width = gridRef.current.parentElement.offsetWidth;
      } else if (typeof window !== 'undefined') {
        width = window.innerWidth - 64;
      }
      // gapを正確に考慮してカラム数・セルサイズを決定
      const gap = 3;
      let bestColumns = Math.floor((width + gap) / (minCell + gap));
      bestColumns = Math.max(minColumns, Math.min(maxColumns, bestColumns, totalDays));
      let size = (width - (bestColumns - 1) * gap) / bestColumns;
      size = Math.floor(Math.max(minCell, Math.min(maxCell, size)));
      setColumns(bestColumns);
      setCellSize(size);
    }
    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
    // eslint-disable-next-line
  }, [days.length]);

  return (
    <div className="w-full">
      <div className="mb-2 text-gray-700 font-semibold text-base text-left">読書アクティビティ</div>
      <div className="flex justify-center w-full">
        <div
          ref={gridRef}
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
            gap: '3px',
            width: 'fit-content',
            minWidth: 0,
          }}
        >
          {days.map((day, i) => {
            const count = dateCount[day] || 0
            let color = '#e5e7eb' // 薄いグレー（Tailwind gray-200）
            if (count === 1) color = '#7dd3fc' // 水色
            if (count >= 2) color = '#2563eb' // 青色
            return (
              <div
                key={i}
                className="rounded-sm"
                style={{ width: `${cellSize}px`, height: `${cellSize}px`, backgroundColor: color }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ReadingActivity
