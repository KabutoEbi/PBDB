import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Header from './components/Header'
import BookList from './components/BookList'
import BookDetail from './components/BookDetail'
import EditBook from './components/EditBook'
import AddBook from './components/AddBook'
import ModeSelect from './components/ModeSelect'
import BookSearchGoogle from './components/BookSearchGoogle'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [period, setPeriod] = useState('year') // 'year' or 'month'
  const [status, setStatus] = useState('all') // 'all', 'read' or 'want'
  const [showAddBookModal, setShowAddBookModal] = useState(false)
  const [addBookMode, setAddBookMode] = useState(null) // 'title'|'author'|'isbn'|'manual'|null
  const [addBookPrefill, setAddBookPrefill] = useState(null) // Google検索からの本情報
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [editBook, setEditBook] = useState(null)
  const [bookFilter, setBookFilter] = useState('all')

  // 年・月選択用
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;
  const [year, setYear] = useState(thisYear);
  const [month, setMonth] = useState(thisMonth);
  const yearList = Array.from({ length: 5 }, (_, i) => thisYear - i);
  const monthList = Array.from({ length: 12 }, (_, i) => i + 1);

  // フィルタに応じたbooks
  const filteredBooks = bookFilter === 'all' ? books : books.filter(b => b.status === bookFilter)
  // 統計値をフィルタ後booksから計算
  const stats = {
    totalAmount: filteredBooks.reduce((sum, b) => sum + (b.price ? Number(b.price) : 0), 0),
    totalPages: filteredBooks.reduce((sum, b) => sum + (b.pages ? Number(b.pages) : 0), 0),
    bookCount: filteredBooks.length
  }

  return (
    <>
      <Header onAddBookClick={() => { setShowAddBookModal(true); setAddBookMode(null); setAddBookPrefill(null); }} />
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
              onDelete={id => {
                setBooks(prev => prev.filter(b => b.id !== id))
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
              onAdd={(bookData) => {
                setBooks(prev => [
                  ...prev,
                  { ...bookData, id: uuidv4() }
                ])
                setShowAddBookModal(false)
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
              onSave={(updatedBook) => {
                setBooks(prev => prev.map(b => b.id === editBook.id ? { ...b, ...updatedBook } : b))
                setEditBook(null)
              }}
              onDelete={id => {
                setBooks(prev => prev.filter(b => b.id !== id))
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
