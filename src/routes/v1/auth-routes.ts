import express from 'express'

import { authControlller } from '@/controllers/auth-controller'

const router = express.Router()

/**
 * @swagger
 * /v1/auth/login:
 *  post:
 *    tags:
 *      - auth
 *    summary: Login a user
 *    description: Login a user
 *    requestBody:
 *      description: login and password of the user
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: email
 *              password:
 *                type: string
 *                example: password
 *    responses:
 *      200:
 *        description: Returns a success message and a jwt token
 *        headers:
 *          accessToken:
 *            schema:
 *              type: string
 *              example: accessToken=abcde12345; Path=/; HttpOnly
 */
router.post('/login', authControlller.login)

/**
 * @swagger
 * /v1/auth/recover-password/send-email:
 *  post:
 *    tags:
 *      - auth
 *    summary: Send a password recovery email
 *    description: Send a password recovery email
 *    requestBody:
 *      description: Object with the user's email
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: email
 *    responses:
 *      200:
 *        description: Returns a success message regardless of whether the email exists or not
 */
router.post('/recover-password/send-email', authControlller.sendRecoverPasswordEmail)

/**
 * @swagger
 * /v1/auth/recover-password:
 *  post:
 *    tags:
 *      - auth
 *    summary: Recover user's password
 *    description: Generate a recover token and sends it to the user's email
 *    requestBody:
 *      description: Object containing user's email, password and token
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: email
 *              password:
 *                type: string
 *                example: password
 *              token:
 *                type: string
 *                example: token
 *    responses:
 *      200:
 *        description: Returns a success message
 */
router.post('/recover-password', authControlller.recoverPassword)

export { router as authRouter }
