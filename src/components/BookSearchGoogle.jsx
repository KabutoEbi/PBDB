import React, { useState } from 'react'

function BookSearchGoogle({ onSelect, onClose, mode }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query) return
    setLoading(true)
    setError('')
    setResults([])
    let q = ''
    if (mode === 'title') q = `intitle:${query}`
    else if (mode === 'author') q = `inauthor:${query}`
    else if (mode === 'isbn') q = `isbn:${query}`
    else q = query
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (data.items) setResults(data.items)
      else setResults([])
    } catch (err) {
      setError('検索に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded border border-gray-300 p-6 max-w-[600px] w-full box-border overflow-x-hidden max-md:p-5">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-300">
        <h2 className="m-0 text-gray-800 text-lg font-semibold">Google Books検索</h2>
        {onClose && (
          <button className="bg-transparent border-none text-xl text-gray-500 cursor-pointer p-0.5 px-1.5 leading-none hover:text-gray-800" onClick={onClose}>✕</button>
        )}
      </div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          placeholder={mode === 'title' ? 'タイトルで検索' : mode === 'author' ? '著者名で検索' : 'ISBNで検索'}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="py-2 px-5 rounded text-sm font-medium cursor-pointer border-none bg-blue-500 text-white hover:bg-blue-600">検索</button>
      </form>
      {loading && <div className="text-center text-gray-500 py-4">検索中...</div>}
      {error && <div className="text-center text-red-500 py-2">{error}</div>}
      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
        {results.map(item => {
          const info = item.volumeInfo
          return (
            <div key={item.id} className="flex gap-4 items-center border-b border-gray-200 pb-2">
              {info.imageLinks?.thumbnail && (
                <img src={info.imageLinks.thumbnail} alt="cover" className="w-14 h-20 object-cover rounded border border-gray-200" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-base truncate">{info.title}</div>
                <div className="text-gray-600 text-sm truncate">{info.authors?.join(', ')}</div>
                <div className="text-gray-400 text-xs">{info.publishedDate}</div>
                <div className="text-gray-400 text-xs">{info.industryIdentifiers?.map(id => id.identifier).join(', ')}</div>
              </div>
              <button className="ml-2 py-1 px-3 rounded text-xs font-medium cursor-pointer border border-blue-500 bg-white text-blue-700 hover:bg-blue-50" onClick={() => {
                onSelect && onSelect({
                  title: info.title || '',
                  author: info.authors?.join(', ') || '',
                  cover: info.imageLinks?.thumbnail || '',
                  price: '',
                  pages: info.pageCount || '',
                  status: 'want',
                  date: '',
                  rating: '3',
                  comment: '',
                  isbn: info.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || ''
                })
              }}>この本を追加</button>
            </div>
          )
        })}
        {results.length === 0 && !loading && <div className="text-center text-gray-400 py-6">検索結果がありません</div>}
      </div>
    </div>
  )
}

export default BookSearchGoogle
