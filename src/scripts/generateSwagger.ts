import fs from 'fs';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

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
  apis: [path.join(__dirname, '../routes/*.ts')]
};

try {
  const swaggerSpec = swaggerJSDoc(options);

  const docsDir = path.join(__dirname, '../../docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const jsonPath = path.join(docsDir, 'swagger.json');
  fs.writeFileSync(jsonPath, JSON.stringify(swaggerSpec, null, 2), 'utf8');
  console.log(`Swagger JSON specification generated successfully at:\n${jsonPath}`);

  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Secure Note-Taking API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerSpec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;

  const htmlPath = path.join(docsDir, 'swagger.html');
  fs.writeFileSync(htmlPath, htmlTemplate, 'utf8');
  console.log(`Swagger HTML UI documentation generated successfully at:\n${htmlPath}`);

} catch (error: any) {
  console.error('Failed to generate Swagger specification:', error.message);
  process.exit(1);
}
