import { Plus, LogOut } from 'lucide-react'

function Header({ onAddBookClick, onLogout }) {
  return (
    <header className="bg-blue-500 border-b px-6 py-3 mb-6 w-full">
      <div className="w-full flex items-center">
        <h1 className="text-white text-2xl font-extrabold tracking-tight select-none m-0 flex-1 text-left">PBDB</h1>
        <button 
          className="bg-white text-blue-500 border border-blue-500 py-2 px-5 rounded text-sm font-medium cursor-pointer hover:bg-blue-50 flex items-center gap-2 ml-auto" 
          onClick={onAddBookClick}
        >
          <Plus size={18} className="inline-block" />
          本を追加
        </button>
        <button
          className="bg-white text-red-500 border border-red-400 py-2 px-4 rounded text-sm font-medium cursor-pointer hover:bg-red-50 flex items-center gap-2 ml-2"
          onClick={onLogout}
        >
          <LogOut size={16} className="inline-block" />
          ログアウト
        </button>
      </div>
    </header>
  )
}

export default Header