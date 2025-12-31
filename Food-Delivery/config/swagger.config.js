import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Food Delivery API Documentation",
    version: "1.0.0",
    description:
      "Comprehensive API documentation for Food Delivery platform with multi-role authentication (customers, restaurants, drivers, admin), orders, real-time tracking, payments, and more",
    contact: {
      name: "API Support",
      email: "support@fooddelivery.com",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
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
