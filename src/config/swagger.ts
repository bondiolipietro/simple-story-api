import swaggerJSDoc, { Options, SwaggerDefinition } from 'swagger-jsdoc'
import YAML from 'js-yaml'

import fs from 'fs'
import path from 'path'

const swaggerDefinition = YAML.load(
  fs.readFileSync(path.resolve(__dirname, './swagger-definition.yaml'), 'utf8'),
) as SwaggerDefinition

const options: Options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/**/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

export { swaggerSpec }
