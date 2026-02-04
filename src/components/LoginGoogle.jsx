import { useState } from 'react'
import { auth, googleProvider } from '../firebase.js'
import { signInWithPopup, signOut } from 'firebase/auth'

function LoginGoogle() {
  const [error, setError] = useState('')
  const ADMIN_EMAIL = 'narenohatehe@gmail.com'

  const handleLogin = async () => {
    setError('')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const userEmail = result.user.email
      
      // 管理者のメールアドレス以外の場合はログアウトしてエラー表示
      if (userEmail !== ADMIN_EMAIL) {
        await signOut(auth)
        setError('そのアカウントではログインできません')
        return
      }
    } catch (err) {
      setError('ログインに失敗しました')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <button
        className="bg-white border border-gray-300 rounded px-6 py-2 text-gray-700 font-medium shadow hover:bg-gray-50 flex items-center gap-2"
        onClick={handleLogin}
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
        Googleでログイン
      </button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  )
}

export default LoginGoogle
