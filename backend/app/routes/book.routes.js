const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook
} = require("../controllers/book.controller");
const {
  auth
} = require("../middlewares/auth.middleware");

module.exports = (app) => {

  var router = require("express").Router();

  router.route("/")
    /**
     * @swagger
     * /books:
     *   get:
     *     tags:
     *       - Book
     *     description: Returns all books
     *     security:
     *       - bearerAuth: -[]
     *     parameters:
     *       - name: page
     *         description: page number
     *         in: query
     *         type: string
     *       - name: limit
     *         description: elements per page
     *         in: query
     *         type: string
     *     responses:
     *       200:
     *         description: OK
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server Error
     */
    .get([auth, getAllBooks])
    /**
     * @swagger
     * /books:
     *   post:
     *     tags:
     *       - Book
     *     description: Create a book
     *     security:
     *       - bearerAuth: -[]
     *     parameters:
     *       - name: body
     *         description: Fields for a book
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/book'
     *     responses:
     *       200:
     *         description: OK
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server Error
     */
    .post([auth, createBook]);

  router.route("/:id")
    /**
     * @swagger
     * /books/{id}:
     *   put:
     *     tags:
     *       - Book
     *     description: Create a book
     *     security:
     *       - bearerAuth: -[]
     *     parameters:
     *       - name: id
     *         description: book id
     *         in: path
     *         type: string
     *         required: true
     *       - name: body
     *         description: Fields for a book
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/book'
     *     responses:
     *       200:
     *         description: OK
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server Error
     */
    .put([auth, updateBook])
    /**
     * @swagger
     * /books/{id}:
     *   delete:
     *     tags:
     *       - Book
     *     description: Delete book
     *     security:
     *       - bearerAuth: -[]
     *     parameters:
     *       - name: id
     *         description: book id
     *         in: path
     *         type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal Server Error
     */
    .delete([auth, deleteBook]);

  app.use("/api/books", router);
};