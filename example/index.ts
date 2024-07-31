import { Expose } from "class-transformer";
import { createSuccessResponseSchema } from "./base-schema/create-success-response.schema";
import { deleteSuccessResponseSchema } from "./base-schema/delete-success-response.schema";
import { errorResponseSchema } from "./base-schema/error-response.schema";
import { findManyPagingResponseSchema } from "./base-schema/find-many-paging-response.schema";
import { findManyResponseSchema } from "./base-schema/find-many.response.schema";
import { findOneResponseSchema } from "./base-schema/find-one-response.schema";
import { requestBodySchema } from "./base-schema/request-body.schema";
import { updateSuccessResponseSchema } from "./base-schema/update-success-response.schema";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";
import {
  PropertyDescription,
  PropertyExample,
  swaggerSchemaGenerator,
} from "class-to-swagger-schema";
/**
 * Config base schema example, you can config your own schema
 * There are total 8 base schema that you can config:
 * - createSuccessResponseSchema
 * - deleteSuccessResponseSchema
 * - errorResponseSchema
 * - findManyPagingResponseSchema
 * - findManyResponseSchema
 * - findOneResponseSchema
 * - requestBodySchema
 * - updateSuccessResponseSchema
 */
swaggerSchemaGenerator.setCreateSuccessResponseSchema(
  createSuccessResponseSchema
);
swaggerSchemaGenerator.setDeleteSuccessResponseSchema(
  deleteSuccessResponseSchema
);
swaggerSchemaGenerator.setErrorResponseSchema(errorResponseSchema);
swaggerSchemaGenerator.setFindManyPagingResponseSchema(
  findManyPagingResponseSchema
);
swaggerSchemaGenerator.setFindManyResponseSchema(findManyResponseSchema);
swaggerSchemaGenerator.setFindOneResponseSchema(findOneResponseSchema);
swaggerSchemaGenerator.setRequestBodySchema(requestBodySchema);
swaggerSchemaGenerator.setUpdateSuccessResponseSchema(
  updateSuccessResponseSchema
);

/*
Example that I have a DTO class that describe request body
for resgiter new user, I want to inject this class to the swagger schema
*/
class RegisterUserRequestDto {
  @PropertyDescription("Username of user")
  @PropertyExample("my_user_name_is_cool_123")
  @Expose()
  username!: string;

  @PropertyDescription("Password of user")
  @PropertyExample("my_password_is_cool_123")
  @Expose()
  password!: string;
}
/*
Example that I want to generate schema for the request body
*/
const testRequestBody = swaggerSchemaGenerator.generateRequestBody(
  RegisterUserRequestDto
);

console.log("test request body schema: ", JSON.stringify(testRequestBody));

/*
Next, I want to generate schema for the create success response
*/
//I have a DTO class that describe the response when register new user successfully
class RegisterUserResponseDto {
  @PropertyDescription("ID of user")
  @PropertyExample("1562")
  @Expose()
  id!: number;
  @PropertyDescription("Username of user")
  @PropertyExample("my_user_name_is_cool_123")
  @Expose()
  username!: string;
}

const testCreate = swaggerSchemaGenerator.generateCreateSuccessResponse(
  RegisterUserResponseDto
);

console.log("test create schema: ", JSON.stringify(testCreate));

/*
Example that I want to generate schema for the error response when register new user:
User provide invalid password, http status code is 400, 
custom error code is INVALID_PASSWORD_ERROR, I want to inject this error to the swagger schema
*/
const testError = swaggerSchemaGenerator.generateErrorResponse(
  "Your password must be at least 10 charactors", //The error message you want to inject (required)
  "INVALID_PASSWORD_ERROR", //The error code you want to inject (optional)
  400, //The status code you want to inject (optional)
  "Bad request" //The status message you want to inject (optional)
);

console.log("test error schema: ", JSON.stringify(testError));

/*
Next, I need to mapping the schema above to the swagger schema
*/
/**
 ** Swagger schema mapping with application DTOs
 */
export const swaggerSchemaMapping = {
  /**
   ** POST /user/register
   */
  RegisterRequestBodyDto: testRequestBody,
  RegisterSuccessResponseDto: testCreate,
  Register_INVALID_PASSWORD_ERROR: testError,
};

//Finally, you can use the swaggerSchemaMapping to inject to the swagger schema in swagger option:
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "ExpressJS Super Clean Base Source API Documentation",
      version: "0.1.0",
      description:
        "This is API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Thinh Ha",
        email: "haphuthinh332004@gmail.com",
      },
    },
    servers: [],
    components: {
      schemas: swaggerSchemaMapping, //Inject the schema mapping here
    },
  },
  apis: ["./controllers/*.ts"],
};

/**
 * Express app
 */
const app = express();

const specs = swaggerJsdoc(options);

//Swagger init
app.use(
  `/api-docs`,
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
  })
);
console.log(`Swagger is running on http://localhost:3000/api-docs`);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

/*
 **Another method describe as below:
 */

class ExampleDto {
  @PropertyDescription("Example property")
  @PropertyExample("Example value")
  @Expose()
  example!: string;
}
/*
Example that I want to generate schema for the update success response
*/
const testUpdate = swaggerSchemaGenerator.generateUpdateSuccessResponse();
console.log("test update schema: ", JSON.stringify(testUpdate));

/*
Example that I want to generate schema for the delete success response
*/
const testDelete = swaggerSchemaGenerator.generateDeleteSuccessResponse();
console.log("test delete schema: ", JSON.stringify(testDelete));

/*
Example that I want to generate schema for the find one response
*/
const testFindOne = swaggerSchemaGenerator.generateFindOneResponse(ExampleDto);

console.log("test find one schema: ", JSON.stringify(testFindOne));

/*
Example that I want to generate schema for the find many response
*/
const testFindMany =
  swaggerSchemaGenerator.generateFindManyResponse(ExampleDto);

console.log("test find many schema: ", JSON.stringify(testFindMany));

/*
Example that I want to generate schema for the find many paging response
*/
const testFindManyPaging =
  swaggerSchemaGenerator.generateFindManyPagingResponse(ExampleDto);

console.log(
  "test find many paging schema: ",
  JSON.stringify(testFindManyPaging)
);
