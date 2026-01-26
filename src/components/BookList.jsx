import { useState } from 'react'

// import BookDetail from './BookDetail'
import EditBook from './EditBook'



function BookList({ books, setBooks, setEditBook, setSelectedBook }) {
    const [filter, setFilter] = useState('all')
    const [sortBy, setSortBy] = useState('title')

    // フィルター処理
    const filteredBooks = filter === 'all'
        ? books
        : books.filter(book => book.status === filter)

    // ソート処理
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title, 'ja')
            case 'price':
                return b.price - a.price // 高い順
            case 'pages':
                return b.pages - a.pages // 多い順
            case 'date':
                // 日付があるものを優先、新しい順
                if (!a.date && !b.date) return 0
                if (!a.date) return 1
                if (!b.date) return -1
                return new Date(b.date) - new Date(a.date)
            case 'rating':
                // 評価が高い順（未評価は一番下）
                if (b.rating == null && a.rating == null) return 0
                if (b.rating == null) return -1
                if (a.rating == null) return 1
                return b.rating - a.rating
            default:
                return 0
        }
    })

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4 gap-3 max-md:flex-col max-md:items-stretch">
                <div className="flex gap-1 bg-white border border-gray-300 rounded">
                    <button
                        className={`py-2 px-4 border-none cursor-pointer font-medium text-sm ${
                            filter === 'all' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-transparent text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setFilter('all')}
                    >
                        全部
                    </button>
                    <button
                        className={`py-2 px-4 border-none cursor-pointer font-medium text-sm ${
                            filter === 'read' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-transparent text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setFilter('read')}
                    >
                        読んだ
                    </button>
                    <button
                        className={`py-2 px-4 border-none cursor-pointer font-medium text-sm ${
                            filter === 'reading' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-transparent text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setFilter('reading')}
                    >
                        読書中
                    </button>
                    <button
                        className={`py-2 px-4 border-none cursor-pointer font-medium text-sm ${
                            filter === 'want' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-transparent text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setFilter('want')}
                    >
                        読みたい
                    </button>
                </div>

                <select
                    className="py-2 px-3 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white cursor-pointer focus:outline-none focus:border-blue-500 max-md:w-full"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    {filter === 'read' && <option value="date">日付順</option>}
                    {(filter === 'read' || filter === 'reading') && <option value="rating">評価順</option>}
                    <option value="title">タイトル順</option>
                    <option value="price">価格順</option>
                    <option value="pages">ページ数順</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                {sortedBooks.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">本がありません</div>
                ) : sortedBooks.map(book => (
                    <div
                        key={book.id || Math.random()}
                        className="bg-white p-4 rounded border border-gray-300 cursor-pointer flex items-center gap-4 hover:bg-gray-50 max-md:flex-col max-md:items-start max-md:gap-3"
                        onClick={() => {
                            if (book) setSelectedBook(book)
                        }}
                    >
                        {/* 表紙は一覧では表示しない */}
                        <div className="flex-1 min-w-0">
                            <div className="mb-2">
                                <span className={`inline-block py-1 px-2.5 rounded text-xs font-medium ${
                                    book.status === 'read' ? 'bg-blue-100 text-blue-800' :
                                    book.status === 'reading' ? 'bg-green-100 text-green-800' :
                                    'bg-amber-100 text-amber-800'
                                }`}>
                                    {book.status === 'read' ? '読んだ' :
                                        book.status === 'reading' ? '読書中' : '読みたい'}
                                </span>
                            </div>
                            <h3 className="m-0 mb-1 text-gray-800 text-base font-semibold leading-[1.4] overflow-hidden text-ellipsis whitespace-nowrap">{book.title}</h3>
                            <p className="m-0 text-gray-600 text-sm overflow-hidden text-ellipsis whitespace-nowrap">{book.author}</p>
                        </div>
                        <div className="flex gap-6 items-center max-md:w-full max-md:justify-between">
                            <div className="flex flex-col gap-0.5 min-w-[80px]">
                                <span className="text-gray-500 text-xs">金額</span>
                                <span className="text-gray-900 text-base font-medium">¥{book.price.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-[80px]">
                                <span className="text-gray-500 text-xs">ページ数</span>
                                <span className="text-gray-900 text-base font-medium">{book.pages}p</span>
                            </div>
                            {(sortBy === 'date' && book.date) && (
                                <div className="flex flex-col gap-0.5 min-w-[80px]">
                                    <span className="text-gray-500 text-xs">読了日</span>
                                    <span className="text-gray-900 text-base font-medium">{book.date}</span>
                                </div>
                            )}
                            {(sortBy === 'rating' && (book.rating != null)) && (
                                <div className="flex flex-col gap-0.5 min-w-[80px]">
                                    <span className="text-gray-500 text-xs">評価</span>
                                    <span className="text-gray-900 text-base font-medium">{book.rating} ★</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BookList
