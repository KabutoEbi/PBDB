import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import BookList from './components/BookList'
import BookDetail from './components/BookDetail'
import EditBook from './components/EditBook'
import AddBook from './components/AddBook'
import ModeSelect from './components/ModeSelect'
import BookSearchGoogle from './components/BookSearchGoogle'
import ReadingActivity from './components/ReadingActivity'
import Graph from './components/Graph'

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

  // 年・月選択用
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;
  const [year, setYear] = useState(thisYear);
  const [month, setMonth] = useState(thisMonth);
  const yearList = Array.from({ length: 5 }, (_, i) => thisYear - i);
  const monthList = Array.from({ length: 12 }, (_, i) => i + 1);

  // 統計値をbooksから計算
  const stats = {
    totalAmount: books.reduce((sum, b) => sum + (b.price ? Number(b.price) : 0), 0),
    totalPages: books.reduce((sum, b) => sum + (b.pages ? Number(b.pages) : 0), 0),
    bookCount: books.length
  }

  return (
    <>
      <Header onAddBookClick={() => { setShowAddBookModal(true); setAddBookMode(null); setAddBookPrefill(null); }} />
      <div className="flex w-full pl-60 overflow-x-hidden max-md:pl-0">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 p-6 px-8 w-full max-w-[calc(100vw-240px)] box-border overflow-x-hidden max-md:max-w-full max-md:p-4">
          {currentPage === 'home' && (
            <>
              <div className="flex gap-6 mb-6 flex-wrap w-full box-border max-md:gap-3">
                <div className="flex gap-1 bg-white border border-gray-300 rounded">
                  <button
                    className={`py-2 px-4 border-none cursor-pointer font-medium text-sm ${period === 'year'
                      ? 'bg-blue-500 text-white'
                      : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setPeriod('year');
                      setYear(thisYear);
                    }}
                  >
                    年間
                  </button>
                  <button
                    className={`py-2 px-4 border-none cursor-pointer font-medium text-sm ${period === 'month'
                      ? 'bg-blue-500 text-white'
                      : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setPeriod('month');
                      setYear(thisYear);
                      setMonth(thisMonth);
                    }}
                  >
                    月間
                  </button>
                </div>

                <div className="flex gap-1 bg-white border border-gray-300 rounded">
                  <button
                    className={`py-2 px-4 border-none cursor-pointer font-medium text-sm ${status === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setStatus('all')}
                  >
                    全部
                  </button>
                  <button
                    className={`py-2 px-4 border-none cursor-pointer font-medium text-sm ${status === 'read'
                      ? 'bg-blue-500 text-white'
                      : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setStatus('read')}
                  >
                    読んだ
                  </button>

                  <button
                    className={`py-2 px-4 border-none cursor-pointer font-medium text-sm ${status === 'want'
                      ? 'bg-blue-500 text-white'
                      : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setStatus('want')}
                  >
                    読みたい
                  </button>
                </div>
              </div>



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

              <div className="bg-white p-6 rounded border border-gray-300 w-full box-border overflow-x-hidden mb-6">
                <h2 className="mt-0 mb-4 text-gray-800 text-lg font-semibold">グラフ</h2>
                <Graph
                  books={books}
                  period={period} setPeriod={setPeriod}
                  status={status} setStatus={setStatus}
                  year={year} setYear={setYear} yearList={yearList}
                  month={month} setMonth={setMonth} monthList={monthList}
                />
              </div>

              <div className="bg-white p-6 rounded border border-gray-300 w-full box-border overflow-x-hidden">
                <ReadingActivity books={books} />
              </div>
            </>
          )}

          {currentPage === 'books' && (
            <BookList
              books={books}
              setBooks={setBooks}
              setEditBook={setEditBook}
              setSelectedBook={setSelectedBook}
            />
          )}
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
            />
          </div>
        </div>
      )}
    </>
  )
}
export default App
