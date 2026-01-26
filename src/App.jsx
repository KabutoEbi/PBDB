import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db, storage } from './firebase.js'
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import Header from './components/Header'
import { signOut } from 'firebase/auth'
import BookList from './components/BookList'
import BookDetail from './components/BookDetail'
import EditBook from './components/EditBook'
import AddBook from './components/AddBook'
import ModeSelect from './components/ModeSelect'
import BookSearchGoogle from './components/BookSearchGoogle'

import LoginGoogle from './components/LoginGoogle'

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])
  const [currentPage, setCurrentPage] = useState('home')
  const [showAddBookModal, setShowAddBookModal] = useState(false)
  const [addBookMode, setAddBookMode] = useState(null) // 'title'|'author'|'isbn'|'manual'|null
  const [addBookPrefill, setAddBookPrefill] = useState(null) // Google検索からの本情報
  const [books, setBooks] = useState([])

  // Firestoreからログインユーザーの本データを取得
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'books'), where('uid', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setBooks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);
  const [selectedBook, setSelectedBook] = useState(null)
  const [editBook, setEditBook] = useState(null)
  const [bookFilter, setBookFilter] = useState('all')

  // フィルタに応じたbooks
  const filteredBooks = bookFilter === 'all' ? books : books.filter(b => b.status === bookFilter)
  // 統計値をフィルタ後booksから計算
  const stats = {
    totalAmount: filteredBooks.reduce((sum, b) => sum + (b.price ? Number(b.price) : 0), 0),
    totalPages: filteredBooks.reduce((sum, b) => sum + (b.pages ? Number(b.pages) : 0), 0),
    bookCount: filteredBooks.length
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginGoogle />
      </div>
    )
  }

  return (
    <>
      <Header 
        onAddBookClick={() => { setShowAddBookModal(true); setAddBookMode(null); setAddBookPrefill(null); }}
        onLogout={() => signOut(auth)}
      />
      <div className="flex w-full">
        <main className="flex-1 p-4 w-full max-w-full box-border">
          {currentPage === 'home' && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6 w-full box-border max-md:grid-cols-1">
                <div className="bg-white py-5 px-6 rounded border border-gray-300 w-full box-border">
                  <div className="text-gray-600 text-xs mb-2 font-medium">金額</div>
                  <div className="text-gray-900 text-2xl font-semibold">¥{stats.totalAmount.toLocaleString()}</div>
                </div>
                <div className="bg-white py-5 px-6 rounded border border-gray-300 w-full box-border">
                  <div className="text-gray-600 text-xs mb-2 font-medium">ページ数</div>
                  <div className="text-gray-900 text-2xl font-semibold">{stats.totalPages.toLocaleString()}</div>
                </div>
                <div className="bg-white py-5 px-6 rounded border border-gray-300 w-full box-border">
                  <div className="text-gray-600 text-xs mb-2 font-medium">冊数</div>
                  <div className="text-gray-900 text-2xl font-semibold">{stats.bookCount}</div>
                </div>
              </div>
            </>
          )}

          <div className="mt-8">
            <BookList
              books={books}
              setEditBook={setEditBook}
              setSelectedBook={setSelectedBook}
              onDelete={async id => {
                if (!user) return;
                // 対象bookを取得
                const book = books.find(b => b.id === id);
                console.log('onDelete呼び出し', id);
                console.log('bookデータ', book);
                // coverStoragePathがあればStorageからも削除
                if (book && typeof book.coverStoragePath === 'string') {
                  console.log('Storage削除開始', book.coverStoragePath);
                  try {
                    const imageRef = ref(storage, book.coverStoragePath);
                    await deleteObject(imageRef);
                    console.log('Storage削除成功', book.coverStoragePath);
                  } catch (e) {
                    console.error('Storage画像削除エラー', e, book.coverStoragePath);
                  }
                }
                await deleteDoc(doc(db, 'books', id));
              }}
              filter={bookFilter}
              onFilterChange={setBookFilter}
            />
          </div>
        </main>
      </div>


      {showAddBookModal && addBookMode === null && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-transparent flex justify-center items-center z-[1000] p-4" onClick={() => setShowAddBookModal(false)}>
          <div className="max-h-[90vh] overflow-y-auto overflow-x-hidden max-w-[90vw] box-border" onClick={(e) => e.stopPropagation()}>
            <ModeSelect
              onSelect={mode => setAddBookMode(mode)}
              onClose={() => setShowAddBookModal(false)}
            />
          </div>
        </div>
      )}
      {showAddBookModal && (addBookMode === 'title' || addBookMode === 'author' || addBookMode === 'isbn') && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-transparent flex justify-center items-center z-[1000] p-4" onClick={() => setShowAddBookModal(false)}>
          <div className="max-h-[90vh] overflow-y-auto overflow-x-hidden max-w-[90vw] box-border" onClick={(e) => e.stopPropagation()}>
            <BookSearchGoogle
              mode={addBookMode}
              onClose={() => setShowAddBookModal(false)}
              onSelect={bookInfo => {
                setAddBookPrefill(bookInfo)
                setAddBookMode('manual')
              }}
            />
          </div>
        </div>
      )}
      {showAddBookModal && addBookMode === 'manual' && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-transparent flex justify-center items-center z-[1000] p-4" onClick={() => setShowAddBookModal(false)}>
          <div className="max-h-[90vh] overflow-y-auto overflow-x-hidden max-w-[90vw] box-border" onClick={(e) => e.stopPropagation()}>
            <AddBook
              initialData={addBookPrefill}
              onClose={() => setShowAddBookModal(false)}
              onAdd={async (bookData) => {
                if (!user) return;
                try {
                  let bookToSave = { ...bookData };
                  let coverStoragePath = undefined;
                  if (bookData.cover && bookData.cover instanceof File) {
                    // File型ならStorageにアップロード
                    const storageRef = ref(storage, `covers/${user.uid}_${Date.now()}`);
                    await uploadBytes(storageRef, bookData.cover);
                    const coverUrl = await getDownloadURL(storageRef);
                    bookToSave.cover = coverUrl;
                    coverStoragePath = storageRef.fullPath; // ←これを追加
                  } else if (typeof bookData.cover === 'string' && bookData.cover.startsWith('http')) {
                    // 文字列かつURLならそのまま保存
                    bookToSave.cover = bookData.cover;
                  } else {
                    // coverが空や不正ならフィールド削除
                    delete bookToSave.cover;
                  }
                  await addDoc(collection(db, 'books'), {
                    ...bookToSave,
                    uid: user.uid,
                    createdAt: new Date(),
                    ...(coverStoragePath ? { coverStoragePath } : {}) // ←これを追加
                  });
                  setShowAddBookModal(false)
                } catch (e) {
                  alert('本の追加に失敗しました: ' + (e?.message || e));
                }
              }}
            />
          </div>
        </div>
      )}

      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onEdit={() => {
            setEditBook(selectedBook)
            setSelectedBook(null)
          }}
        />
      )}

      {editBook && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-transparent flex justify-center items-center z-[1000] p-4" onClick={() => setEditBook(null)}>
          <div className="max-h-[90vh] overflow-y-auto overflow-x-hidden max-w-[90vw] box-border" onClick={e => e.stopPropagation()}>
            <EditBook
              book={editBook}
              onClose={() => setEditBook(null)}
              onSave={async (updatedBook) => {
                if (!user) return;
                let coverUrl = updatedBook.cover;
                if (updatedBook.cover && updatedBook.cover instanceof File) {
                  const storageRef = ref(storage, `covers/${user.uid}_${Date.now()}`);
                  await uploadBytes(storageRef, updatedBook.cover);
                  coverUrl = await getDownloadURL(storageRef);
                }
                await updateDoc(doc(db, 'books', editBook.id), {
                  ...updatedBook,
                  cover: coverUrl
                });
                setEditBook(null)
              }}
              onDelete={async id => {
                if (!user) return;
                // 対象bookを取得
                const book = books.find(b => b.id === id);
                // coverStoragePathがあればStorageからも削除
                let storagePath = undefined;
                if (book) {
                  if (typeof book.coverStoragePath === 'string') {
                    storagePath = book.coverStoragePath;
                  } else if (typeof book.cover === 'string' && book.cover.includes('/o/')) {
                    // URLからStorageパスを抽出
                    try {
                      const match = decodeURIComponent(book.cover).match(/\/o\/(.+)\?/);
                      if (match && match[1]) {
                        storagePath = match[1];
                      }
                    } catch (e) {}
                  }
                  if (storagePath) {
                    try {
                      const imageRef = ref(storage, storagePath);
                      await deleteObject(imageRef);
                    } catch (e) {
                      console.error('Storage画像削除エラー(EditBook)', e, storagePath);
                    }
                  }
                }
                await deleteDoc(doc(db, 'books', id));
                setEditBook(null)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
export default App
