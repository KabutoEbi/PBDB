import React from "react";


function BookDetail({ book, onClose, onEdit }) {
  if (!book || typeof book !== 'object' || !book.title) return null;
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-transparent flex justify-center items-center z-[1000] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl border border-gray-300 p-7 w-full max-w-[420px] box-border relative shadow-lg" onClick={e => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose} aria-label="閉じる">✕</button>
        <button className="absolute top-3 left-3 py-1 px-4 rounded text-sm font-medium cursor-pointer border-none bg-blue-500 text-white hover:bg-blue-600 shadow-sm" onClick={onEdit}>編集</button>
        <div className="flex flex-col items-center gap-5">
          {book.cover ? (
            <img src={book.cover} alt={book.title} className="w-28 h-40 object-cover rounded border border-gray-200 shadow-sm" />
          ) : (
            <div className="w-28 h-40 flex items-center justify-center bg-gray-100 text-gray-400 rounded border border-gray-200 text-sm">No Image</div>
          )}
          <div className="w-full flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-900 mb-1 text-center break-words">{book.title}</h2>
            <div className="text-gray-600 text-base mb-2 text-center break-words">{book.author}</div>
            <div className="flex gap-2 mb-2">
              <span className={`inline-block py-0.5 px-2 rounded text-xs font-medium ${
                book.status === 'read' ? 'bg-blue-100 text-blue-800' :
                book.status === 'reading' ? 'bg-green-100 text-green-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {book.status === 'read' ? '読んだ' : book.status === 'reading' ? '読書中' : '読みたい'}
              </span>
            </div>
            <div className="w-full border-t border-gray-200 my-3"></div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">金額</span>
                <span className="text-base text-gray-900 font-medium">¥{book.price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">ページ数</span>
                <span className="text-base text-gray-900 font-medium">{book.pages}p</span>
              </div>
              {book.status === 'read' && book.date && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">読了日</span>
                  <span className="text-base text-gray-900 font-medium">{book.date}</span>
                </div>
              )}
              {book.rating && (book.status === 'reading' || book.status === 'read') && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">評価</span>
                  <span className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className={Number(book.rating) >= star ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>★</span>
                    ))}
                    <span className="ml-1 text-xs text-gray-500">{book.rating}</span>
                  </span>
                </div>
              )}
              {book.comment && (book.status === 'reading' || book.status === 'read') && (
                <div className="flex flex-col mt-2">
                  <span className="text-xs text-gray-500 mb-1">感想</span>
                  <span className="text-gray-800 text-sm whitespace-pre-line break-words bg-gray-50 rounded p-2 border border-gray-100">{book.comment}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 編集ボタンは左上に移動済み */}
      </div>
    </div>
  );
}

export default BookDetail;
