const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const dotenv = require('dotenv');
dotenv.config();
const app = require("./app");

// set port, listen for requests
const PORT = process.env.PORT || 8080;
const host = process.env.HOST || "localhost";

const swaggerOptions = {
  swaggerDefinition: {
      info: {
          title: "test System API Documentation",
          version: "1.0.0",
          description: "test System by Mr. shyaka",
      },
      schemes: [process.env.NODE_ENV === "production" ? "https" : "http"],
      host: host+":"+PORT,
      basePath: "/swagger",
      securityDefinitions: {
          bearerAuth: {
              type: "apiKey",
              name: "Authorization",
              scheme: "bearer",
              in: "header",
          },
      },
  },
  apis: ["./app/routes/**/*.js", "./app/controllers/**/**/*.js",
      "./app/models/**/*.js", "./app/models/**/**/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocs);
});

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs, false, { docExpansion: "none" }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
