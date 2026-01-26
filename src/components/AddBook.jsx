import { useState, useEffect } from 'react'

function AddBook({ onClose, onAdd, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '', // base64 or empty
    price: '',
    pages: '',
    status: 'want',
    date: '',
    rating: '3',
    comment: ''
  })
  const [coverPreview, setCoverPreview] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
      if (initialData.cover) setCoverPreview(initialData.cover)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (name === 'cover' && type === 'file' && files && files[0]) {
      const file = files[0]
      setFormData(prev => ({ ...prev, cover: file }))
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result)
      reader.readAsDataURL(file)
    } else if (name === 'status') {
      // ステータス変更時、「読んだ」ならdateを当日にセット
      if (value === 'read') {
        setFormData(prev => ({
          ...prev,
          status: value,
          date: prev.date || new Date().toISOString().slice(0, 10)
        }))
      } else {
        setFormData(prev => ({ ...prev, status: value }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // バリデーション
    if (!formData.title || !formData.author) {
      alert('タイトルと著者は必須です')
      return
    }

    // データを親コンポーネントに渡す

    // coverはFileのまま親に渡す
    const bookData = {
      ...formData,
      price: formData.price ? parseInt(formData.price) : 0,
      pages: formData.pages ? parseInt(formData.pages) : 0,
      date: formData.status === 'read' && formData.date ? formData.date : null
    }
    if (onAdd) {
      onAdd(bookData)
    }

    // フォームをリセット
    setFormData({
      title: '',
      author: '',
      cover: '',
      price: '',
      pages: '',
      status: 'want',
      date: '',
      rating: '3',
      comment: ''
    })
    setCoverPreview('')

    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="bg-white rounded border border-gray-300 p-6 max-w-[600px] w-full box-border overflow-x-hidden max-md:p-5">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-300">
        <h2 className="m-0 text-gray-800 text-lg font-semibold">本を追加</h2>
        {onClose && (
          <button className="bg-transparent border-none text-xl text-gray-500 cursor-pointer p-0.5 px-1.5 leading-none hover:text-gray-800" onClick={onClose}>✕</button>
        )}
      </div>


      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="cover" className="text-gray-700 text-sm font-medium">表紙画像</label>
          <input
            type="file"
            id="cover"
            name="cover"
            accept="image/*"
            onChange={handleChange}
            className="py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          {coverPreview && (
            <img src={coverPreview} alt="表紙プレビュー" className="mt-2 w-24 h-36 object-cover rounded border border-gray-200" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-gray-700 text-sm font-medium">タイトル <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="本のタイトルを入力"
            className="py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="author" className="text-gray-700 text-sm font-medium">著者 <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="著者名を入力"
            className="py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
          <div className="flex flex-col gap-1">
            <label htmlFor="price" className="text-gray-700 text-sm font-medium">金額（円）</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="pages" className="text-gray-700 text-sm font-medium">ページ数</label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-gray-700 text-sm font-medium">ステータス</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="want">読みたい</option>
            <option value="reading">読書中</option>
            <option value="read">読んだ</option>
          </select>
        </div>


        {(formData.status === 'reading' || formData.status === 'read') && (
          <>
            {formData.status === 'read' && (
              <div className="flex flex-col gap-1">
                <label htmlFor="date" className="text-gray-700 text-sm font-medium">読了日</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 text-sm font-medium mb-1">評価（1〜5）</label>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="text-2xl focus:outline-none"
                    onClick={() => setFormData(prev => ({ ...prev, rating: String(star) }))}
                    aria-label={`評価${star}点`}
                  >
                    <span className={
                      Number(formData.rating) >= star
                        ? 'text-yellow-400' : 'text-gray-300'
                    }>
                      ★
                    </span>
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">{formData.rating ? formData.rating : ''}</span>
              </div>
              {formData.status === 'read' && !formData.rating && (
                <span className="text-xs text-red-500 mt-1">評価は必須です</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="comment" className="text-gray-700 text-sm font-medium">感想</label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="感想を入力"
                className="py-2 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 min-h-[60px]"
              />
            </div>
          </>
        )}

        <div className="flex gap-3 mt-3 justify-end max-md:flex-col-reverse">
          {onClose && (
            <button type="button" className="py-2 px-5 rounded text-sm font-medium cursor-pointer border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 max-md:w-full" onClick={onClose}>
              キャンセル
            </button>
          )}
          <button type="submit" className="py-2 px-5 rounded text-sm font-medium cursor-pointer border-none bg-blue-500 text-white hover:bg-blue-600 max-md:w-full">
            追加
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddBook
