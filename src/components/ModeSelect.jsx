import React from 'react'

function ModeSelect({ onSelect, onClose }) {
  return (
    <div className="bg-white rounded border border-gray-300 p-6 max-w-[400px] w-full box-border overflow-x-hidden max-md:p-5">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-300">
        <h2 className="m-0 text-gray-800 text-lg font-semibold">本の追加方法を選択</h2>
        {onClose && (
          <button className="bg-transparent border-none text-xl text-gray-500 cursor-pointer p-0.5 px-1.5 leading-none hover:text-gray-800" onClick={onClose}>✕</button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <button className="py-3 px-5 rounded text-base font-medium cursor-pointer border border-gray-300 bg-white text-gray-700 hover:bg-blue-50" onClick={() => onSelect('title')}>タイトル検索</button>
        <button className="py-3 px-5 rounded text-base font-medium cursor-pointer border border-gray-300 bg-white text-gray-700 hover:bg-blue-50" onClick={() => onSelect('author')}>著者検索</button>
        <button className="py-3 px-5 rounded text-base font-medium cursor-pointer border border-gray-300 bg-white text-gray-700 hover:bg-blue-50" onClick={() => onSelect('isbn')}>ISBN検索</button>
        <button className="py-3 px-5 rounded text-base font-medium cursor-pointer border border-gray-300 bg-white text-gray-700 hover:bg-blue-50" onClick={() => onSelect('manual')}>手動入力</button>
      </div>
    </div>
  )
}

export default ModeSelect
