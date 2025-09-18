import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",   // OpenAPI version
    info: {
      title: "Event Management API",   // Title of the docs
      version: "1.0.0",                // API version
      description: "API documentation for Event Management System",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`, // Base URL of your API (can add more later)
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to where your @swagger comments live
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
