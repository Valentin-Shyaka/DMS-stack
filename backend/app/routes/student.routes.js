const {
  createStudent,
  updateStudent,
  deleteStudent,
  studentLogin,
  getCurrentStudent
} = require("../controllers/student.controller");
const {
  auth
} = require("../middlewares/auth.middleware");

module.exports = (app) => {

  var router = require("express").Router();

  router.route("/")
    /**
     * @swagger
     * /students:
     *   post:
     *     tags:
     *       - Student
     *     description: Create a user
     *     parameters:
     *       - name: body
     *         description: Fields for a user
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/User'
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
    .post(createStudent)
    /**
     * @swagger
     * /students:
     *   put:
     *     tags:
     *       - Student
     *     description: Update a user
     *     security:
     *       - bearerAuth: -[]
     *     parameters:
     *       - name: body
     *         description: Fields for a user
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/User'
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
    .put([auth, updateStudent])
    /**
     * @swagger
     * /students:
     *   delete:
     *     tags:
     *       - Student
     *     description: Delete User
     *     security:
     *       - bearerAuth: -[]
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
    .delete([auth, deleteStudent]);

  router.route("/current")
    /**
     * @swagger
     * /students/current:
     *   get:
     *     tags:
     *       - Student
     *     description: Returns current User
     *     security:
     *       - bearerAuth: -[]
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
    .get([auth, getCurrentStudent])

  router.route("/login")
    /**
     * @swagger
     * /students/login:
     *   post:
     *     tags:
     *       - Student
     *     description: User Login
     *     parameters:
     *       - name: body
     *         description: Fields for a user
     *         in: body
     *         required: true
     *         schema:
     *           properties:
     *            email:
     *              type: string
     *            password:
     *              type: string
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
    .post(studentLogin)

  app.use("/api/students", router);
};