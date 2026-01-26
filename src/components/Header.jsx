import { Plus } from 'lucide-react'

function Header({ onAddBookClick }) {
  return (
    <header className="bg-blue-500 py-4 px-8 mb-6 ml-60 border-b border-blue-600 flex justify-between items-center max-md:ml-0 max-md:py-3 max-md:px-6 max-md:flex-col max-md:gap-3">
      <h1 className="m-0 text-white text-2xl md:text-4xl font-extrabold tracking-tight select-none">PBDB</h1>
      <button 
        className="bg-white text-blue-500 border border-blue-500 py-2 px-5 rounded text-sm font-medium cursor-pointer hover:bg-blue-50 flex items-center gap-2 max-md:w-full" 
        onClick={onAddBookClick}
      >
        <Plus size={18} className="inline-block" />
        本を追加
      </button>
    </header>
  )
}

export default Header
