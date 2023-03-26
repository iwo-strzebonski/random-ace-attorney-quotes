export const swaggerDefinition = {
  basePath: '/',
  openapi: '3.0.0',
  info: {
    version: '3.0.0',
    title: 'Random Ace Attorney Quotes API'
  },
  servers: [{ url: 'http://localhost:2137' }],
  apis: [
    {
      url: 'http://localhost:2137',
      description: 'Localhost'
    }
  ],
  configUrl: '/swagger.json'
}

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./**/*.ts'],
  configUrl: '/swagger.json'
}

export default swaggerOptions
