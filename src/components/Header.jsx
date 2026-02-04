import { Plus, LogOut, LogIn } from 'lucide-react'
import LoginGoogle from './LoginGoogle'
import { useState } from 'react'

function Header({ user, isAdmin, onAddBookClick, onLogout }) {
  const [showLogin, setShowLogin] = useState(false)
  
  return (
    <>
      <header className="bg-blue-500 border-b px-6 py-3 mb-6 w-full">
        <div className="w-full flex items-center">
          <h1 className="text-white text-2xl font-extrabold tracking-tight select-none m-0 flex-1 text-left">PBDB</h1>
          {user && (
            <div className="text-white text-sm mr-3">{user.email}</div>
          )}
          {isAdmin && (
            <button 
              className="bg-white text-blue-500 border border-blue-500 py-2 px-5 rounded text-sm font-medium cursor-pointer hover:bg-blue-50 flex items-center gap-2 ml-auto" 
              onClick={onAddBookClick}
            >
              <Plus size={18} className="inline-block" />
              本を追加
            </button>
          )}
          {user ? (
            <button
              className="bg-white text-red-500 border border-red-400 py-2 px-4 rounded text-sm font-medium cursor-pointer hover:bg-red-50 flex items-center gap-2 ml-2"
              onClick={onLogout}
            >
              <LogOut size={16} className="inline-block" />
              ログアウト
            </button>
          ) : (
            <button
              className="bg-white text-blue-500 border border-blue-500 py-2 px-4 rounded text-sm font-medium cursor-pointer hover:bg-blue-50 flex items-center gap-2 ml-2"
              onClick={() => setShowLogin(true)}
            >
              <LogIn size={16} className="inline-block" />
              ログイン
            </button>
          )}
        </div>
      </header>
      {showLogin && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-[2000]" onClick={() => setShowLogin(false)}>
          <div className="bg-white rounded-lg p-8" onClick={e => e.stopPropagation()}>
            <LoginGoogle />
            <button className="mt-4 text-gray-500 text-sm underline" onClick={() => setShowLogin(false)}>閉じる</button>
          </div>
        </div>
      )}
    </>
  )
}

export default Header