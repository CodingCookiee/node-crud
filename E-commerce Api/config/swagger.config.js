import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "E-Commerce API Documentation",
    version: "1.0.0",
    description:
      "Comprehensive API documentation for E-Commerce platform with authentication, products, orders, payments, and more",
    contact: {
      name: "API Support",
      email: "support@ecommerce.com",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 8000}`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
      cookieAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js", "./models/*.js"], // Path to API docs
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec);
export const swaggerUiServe = swaggerUi.serve;
