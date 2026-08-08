import { Router } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const router = Router();

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Secure Note-Taking API Docs',
      version: '1.0.0',
      description: 'REST API documentation for the Secure Note-Taking backend built using TypeScript and Clean Architecture.'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
