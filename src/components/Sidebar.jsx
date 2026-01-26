function Sidebar({ currentPage, onPageChange }) {
  return (
    <aside className="fixed left-0 top-0 w-60 bg-gray-50 border-r border-gray-300 py-4 h-screen overflow-y-auto z-[100] max-md:relative max-md:w-full max-md:h-auto max-md:border-r-0 max-md:border-b max-md:py-3">
      <nav className="flex flex-col gap-1 px-3 max-md:flex-row max-md:overflow-x-auto">
        <button 
          className={`flex items-center gap-2 py-2.5 px-3 border-none rounded cursor-pointer text-sm font-medium text-left w-full max-md:flex-col max-md:gap-1 max-md:py-2 max-md:min-w-[70px] max-md:text-center ${
            currentPage === 'home' 
              ? 'bg-blue-500 text-white' 
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onPageChange('home')}
        >
          <span className="flex-1">ホーム</span>
        </button>
        <button 
          className={`flex items-center gap-2 py-2.5 px-3 border-none rounded cursor-pointer text-sm font-medium text-left w-full max-md:flex-col max-md:gap-1 max-md:py-2 max-md:min-w-[70px] max-md:text-center ${
            currentPage === 'books' 
              ? 'bg-blue-500 text-white' 
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onPageChange('books')}
        >
          <span className="flex-1">本一覧</span>
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
