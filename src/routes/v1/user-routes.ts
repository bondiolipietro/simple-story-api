import express from 'express'

import { userController } from '@/controllers/user-controller'
import { validator } from '@/middlewares/validator'
import { ensureUserIsAuthenticated } from '@/middlewares/authentication'
import {
  createUserReqSchema,
  deleteUserReqSchema,
  getUserByIdReqSchema,
  getUserPreviewByIdReqSchema,
  resendVerificationEmailReqSchema,
  updateUserPasswordReqSchema,
  updateUserReqSchema,
  verifyUserEmailReqSchema,
} from '@/validators/user-validators'

const router = express.Router()

/**
 * @swagger
 * /v1/user/register:
 *  post:
 *    tags:
 *      - user
 *    summary: Creates a new user
 *    description: Creates a new user
 *    requestBody:
 *      description: User to be created
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/info/components/schemas/UserCreate'
 *    responses:
 *      200:
 *        description: Returns the id of the created user and a jwt token
 *      400:
 *        description: User already exists
 */
router.post('/register', validator(createUserReqSchema), userController.createUser)

/**
 * @swagger
 * /v1/user/verify-email:
 *  post:
 *    tags:
 *      - user
 *    summary: Verify user email
 *    description: Verify user email using the token sent to the user's email
 *    requestBody:
 *      description: Object containing the token and email
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: User verified
 *      400:
 *        description: User does not exist / Invalid token / User already verified
 */
router.post('/verify-email', validator(verifyUserEmailReqSchema), userController.verifyUserEmail)

/**
 * @swagger
 * /v1/user/resend-verification-email:
 *  post:
 *    tags:
 *      - user
 *    summary: Resend verification email
 *    description: Regenerates token and send a new verification email to the user's email
 *    requestBody:
 *      description: Object containing the user's email
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: Verification email sent
 *      400:
 *        description: User does not exist / User already verified
 */
router.post(
  '/resend-verification-email',
  validator(resendVerificationEmailReqSchema),
  userController.resendVerificationEmail,
)

/**
 * @swagger
 * /v1/user/{id}:
 *  get:
 *    tags:
 *      - user
 *    security:
 *      - cookieAuth: []
 *    summary: Get user by id
 *    description: Get user information by id, needs authentication, otherwise preview route should be used to retrieve only public information
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID of the user to retrieve
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Returns user's information
 */
router.get('/:id', ensureUserIsAuthenticated, validator(getUserByIdReqSchema), userController.getUserById)

/**
 * @swagger
 * /v1/user/{id}/preview:
 *  get:
 *    tags:
 *      - user
 *    summary: Get user preview by id
 *    description: Get user preview by id, does not require authentication since it only returns public information
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID of the user to retrieve
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Returns user's information preview
 */
router.get('/:id/preview', validator(getUserPreviewByIdReqSchema), userController.getUserPreviewById)

/**
 * @swagger
 * /v1/user/{id}:
 *  put:
 *    tags:
 *      - user
 *    security:
 *      - cookieAuth: []
 *    summary: Updates user information
 *    description: Updates user information, needs authentication
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID of the user to be updated
 *        schema:
 *          type: string
 *    requestBody:
 *      description: User to be updated
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/info/components/schemas/UserUpdate'
 *    responses:
 *      200:
 *        description: Returns the id of the updated user
 */
router.put('/:id', ensureUserIsAuthenticated, validator(updateUserReqSchema), userController.updateUser)

/**
 * @swagger
 * /v1/user/{id}/password:
 *  put:
 *    tags:
 *      - user
 *    security:
 *      - cookieAuth: []
 *    summary: Updates user password
 *    description: Updates user password, needs authentication
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID of the user to be updated
 *        schema:
 *          type: string
 *    requestBody:
 *      description: User's new password object
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                example: password
 *              newPassword:
 *                type: string
 *                example: newPassword
 *    responses:
 *      200:
 *        description: Returns a success message
 */
router.put(
  '/:id/password',
  ensureUserIsAuthenticated,
  validator(updateUserPasswordReqSchema),
  userController.updateUserPassword,
)

/**
 * @swagger
 * /v1/user/{id}:
 *  delete:
 *    tags:
 *      - user
 *    security:
 *      - cookieAuth: []
 *    summary: Deletes user
 *    description: Deletes user, needs authentication
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID of the user to be deleted
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Returns the id of the deleted user
 */
router.delete('/:id', ensureUserIsAuthenticated, validator(deleteUserReqSchema), userController.deleteUser)

export { router as userRouter }
