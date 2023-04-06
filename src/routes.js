/* eslint-disable no-unused-vars */
const {
  addBookHandler,
  getAllBooksHandler,
  getAllBooksByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
  getBooksByNameHandler
} = require('./handler')

const books = require('./books')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getAllBooksByIdHandler
  },
  {
    method: 'GET',
    path: '/books/search',
    handler: getBooksByNameHandler
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler
  }
]

module.exports = routes
