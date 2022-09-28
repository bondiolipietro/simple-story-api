import express from 'express'

const router = express.Router()

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Login a user
 *     description: Login a user
 *     requestBody:
 *       description: login and password of the user
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Returns a success message and a jwt token
 */
router.post('/login', (req, res) => {
  res.send('post /login')
})

/**
 * @swagger
 * /v1/auth/refresh-login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Refresh a logged user's jwt token
 *     description: Refresh a logged user's jwt token
 *     requestBody:
 *       description: Expired jwt token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Returns a success message and a new jwt token
 */
router.post('/refresh-login', (req, res) => {
  res.send('post /refresh-login')
})

/**
 * @swagger
 * /v1/auth/recover-password:
 *   post:
 *     tags:
 *       - auth
 *     summary: Change a user's password using a recovery token
 *     description: Change a user's password using a recovery token
 *     parameters:
 *       - in: query
 *         name: recoveryToken
 *         required: true
 *         description: The recovery token generated and sent to the user's email
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New password information
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Returns a success message if the password was changed
 */
router.post('/recover-password/send-email', (req, res) => {
  res.send('post /recover-password/send-email')
})

/**
 * @swagger
 * /v1/auth/recover-password/send-email:
 *   post:
 *     tags:
 *       - auth
 *     summary: Send a password recovery email
 *     description: Send a password recovery email
 *     requestBody:
 *       description: Object with the user's email
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Returns a success message regardless of whether the email exists or not
 */
router.post('/recover-password/send-email', (req, res) => {
  res.send('post /recover-password/send-email')
})

export default router
