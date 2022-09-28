import express from 'express'

const router = express.Router()

/**
 * @swagger
 * /v1/user/{id}:
 *   get:
 *     tags:
 *       - user
 *     summary: Get user by id
 *     description: Get user information by id, needs authentication, otherwise preview route should be used to retrieve only public information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns user's information
 */
router.get('/:id', (req, res) => {
  res.status(200).send('get /:id')
})

/**
 * @swagger
 * /v1/user/{id}/preview:
 *   get:
 *     tags:
 *       - user
 *     summary: Get user preview by id
 *     description: Get user preview by id, does not require authentication since it only returns public information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns user's information preview
 */
router.get('/:id/preview', (req, res) => {
  res.send('get /:id/preview')
})

/**
 * @swagger
 * /v1/user:
 *   post:
 *     tags:
 *       - user
 *     summary: Creates a new user
 *     description: Creates a new user
 *     requestBody:
 *       description: User to be created
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Returns the id of the created user and a jwt token
 */
router.post('/register', (req, res) => {
  res.send('post /register')
})

/**
 * @swagger
 * /v1/user/{id}:
 *   put:
 *     tags:
 *       - user
 *     summary: Updates user information
 *     description: Updates user information, needs authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to be updated
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: User to be updated
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Returns the id of the updated user
 */
router.put('/:id', (req, res) => {
  res.send('put /:id')
})

/**
 * @swagger
 * /v1/user/{id}/password:
 *   put:
 *     tags:
 *       - user
 *     summary: Updates user password
 *     description: Updates user password, needs authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to be updated
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: User's new password object
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Returns a success message
 */
router.put('/:id/password', (req, res) => {
  res.send('put /:id/password')
})

/**
 * @swagger
 * /v1/user/{id}:
 *   delete:
 *     tags:
 *       - user
 *     summary: Deletes user
 *     description: Deletes user, needs authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to be deleted
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the id of the deleted user
 */
router.delete('/:id', (req, res) => {
  res.send('delete /:id')
})

export default router
