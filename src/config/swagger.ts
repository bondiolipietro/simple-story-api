import swaggerJSDoc from 'swagger-jsdoc'

import { ApiInfo } from '@/constants/ApiInfo'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: ApiInfo.NAME,
    version: ApiInfo.VERSION,
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'jwt',
          in: 'cookie',
          name: 'accessToken',
        },
      },
    },
    tags: [
      {
        name: 'auth',
        description: 'Everything about authentication',
      },
      {
        name: 'story',
        description: 'Everything about stories',
      },
      {
        name: 'user',
        description: 'Everything about users',
      },
    ],
  },
}

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/**/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

export { swaggerSpec }
