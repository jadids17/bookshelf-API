const books = require('./books')
const { nanoid } = require('nanoid')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  // Tambahkan pengecekan apakah `name` dan `readPage` sudah dimasukkan
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const finished = readPage === pageCount

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const filteredBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks
    }
  })

  if (filteredBooks.length === 0) {
    response.code(404)
    response.data = { books: [] }
  }

  return response
}

const getAllBooksByIdHandler = (request, h) => {
  const { id } = request.params

  const book = books.filter((n) => n.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === id)

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const finished = readPage === pageCount

  if (index !== -1) {
    const existingBook = books[index]
    const updatedBook = {
      ...existingBook,
      name: name.trim(),
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt
    }

    if (name.toLowerCase() === existingBook.name.toLowerCase()) {
      updatedBook.name += ' revisi'
    }

    books[index] = updatedBook

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const getBooksByNameHandler = (request, h) => {
  const { name = 'Dicoding' } = request.query

  const filteredBooks = books.filter(item => {
    return item.name.toLowerCase().includes(name.toLowerCase())
  })

  if (filteredBooks.length === 0) {
    return h.response({
      status: 'success',
      data: {
        books: []
      }
    }).code(404)
  }

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks
    }
  })
}

module.exports = getBooksByNameHandler

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getAllBooksByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
  getBooksByNameHandler
}
