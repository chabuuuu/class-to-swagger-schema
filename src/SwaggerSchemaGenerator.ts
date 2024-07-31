import "reflect-metadata";
import {
  getSwaggerProperty,
  propertiesStorage,
} from "./decorator/SwaggerProperty.decorator";
import { getSwaggerExample } from "./decorator/SwaggerExample.decorator";

export class SwaggerSchemaGenerator {
  private requestBodySchema: Record<any, any> = {};

  private findOneResponseSchema: Record<any, any> = {};

  private findManyResponseSchema: Record<any, any> = {};

  private findPagingResponseSchema: Record<any, any> = {};

  private createSuccessResponseSchema: Record<any, any> = {};

  private updateSuccessResponseSchema: Record<any, any> = {};

  private deleteSuccessResponseSchema: Record<any, any> = {};

  private errorResponseSchema: Record<any, any> = {};

  public setRequestBodySchema(schema: Record<any, any>): void {
    this.requestBodySchema = schema;
  }

  public setFindOneResponseSchema(schema: Record<any, any>): void {
    this.findOneResponseSchema = schema;
  }

  public setFindManyResponseSchema(schema: Record<any, any>): void {
    this.findManyResponseSchema = schema;
  }

  public setFindManyPagingResponseSchema(schema: Record<any, any>): void {
    this.findPagingResponseSchema = schema;
  }

  public setCreateSuccessResponseSchema(schema: Record<any, any>): void {
    this.createSuccessResponseSchema = schema;
  }

  public setUpdateSuccessResponseSchema(schema: Record<any, any>): void {
    this.updateSuccessResponseSchema = schema;
  }

  public setDeleteSuccessResponseSchema(schema: Record<any, any>): void {
    this.deleteSuccessResponseSchema = schema;
  }

  public setErrorResponseSchema(schema: Record<any, any>): void {
    this.errorResponseSchema = schema;
  }

  private convertDto(dtoClass: any): Record<any, any> {
    let properties: Record<any, any> = {};
    const dtoClassInstance = new dtoClass();
    let keysOfClass = propertiesStorage.get(dtoClassInstance.constructor.name);
    if (!keysOfClass) {
      return properties;
    }
    for (const key of keysOfClass) {
      const metaDataValue = getSwaggerProperty(dtoClassInstance, key);
      let description = "";
      let example = "";
      if (metaDataValue?.description) {
        description = metaDataValue.description;
      }
      const exampleValue = getSwaggerExample(dtoClassInstance, key);
      if (exampleValue) {
        example = exampleValue;
      }

      const type = Reflect.getMetadata("design:type", dtoClass, key);

      let typeString = "";

      switch (type) {
        case String:
          typeString = "string";
          break;
        case Number:
          typeString = "integer";
          break;
        case Boolean:
          typeString = "boolean";
          break;
        default:
          typeString = "object";
      }
      properties[key] = {
        type: typeString,
        description: description,
        example: example,
      };
    }

    return properties;
  }

  /**
   ** Get update success response schema
   */
  public generateUpdateSuccessResponse(): Record<any, any> {
    return this.updateSuccessResponseSchema;
  }

  /**
   ** Get delete success response schema
   */
  public generateDeleteSuccessResponse(): Record<any, any> {
    return this.deleteSuccessResponseSchema;
  }

  /**
   * Convert DTO to find paging response schema
   */
  public generateFindManyPagingResponse(dtoClass: any): Record<any, any> {
    const properties = this.convertDto(dtoClass);
    this.findPagingResponseSchema.properties.data.properties.items.items.properties =
      properties;
    return this.findPagingResponseSchema;
  }

  /**
   ** Convert DTO to find many response schema
   */
  public generateFindManyResponse(dtoClass: any): Record<any, any> {
    const properties = this.convertDto(dtoClass);
    this.findManyResponseSchema.properties.data.items.properties = properties;
    return this.findManyResponseSchema;
  }

  /**
   ** Convert DTO to request body schema
   * @param dtoClass
   * @returns
   */
  public generateRequestBody(dtoClass: any): Record<any, any> {
    const properties = this.convertDto(dtoClass);

    this.requestBodySchema.properties = properties;

    return this.requestBodySchema;
  }

  /**
   ** Convert DTO to find one response schema
   * @param dtoClass
   * @returns
   */

  private findAndInjectClassToSchema(obj: any, value: any): any {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          if (obj[key].injectClassHere === true) {
            obj[key] = value;
          } else {
            this.findAndInjectClassToSchema(obj[key], value);
          }
        }
      }
    }
    return obj;
  }

  private findAndInjectHttpStatusToSchema(obj: any, value: any): any {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          if (obj[key].injectHttpStatusExample === true) {
            obj[key] = value;
          } else {
            this.findAndInjectClassToSchema(obj[key], value);
          }
        }
      }
    }
    return obj;
  }

  private findAndInjectHttpMessageToSchema(obj: any, value: any): any {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          if (obj[key].injectHttpStatusExample === true) {
            obj[key] = value;
          } else {
            this.findAndInjectHttpMessageToSchema(obj[key], value);
          }
        }
      }
    }
    return obj;
  }

  /**
   ** Convert DTO to find one response schema
   * @param dtoClass
   * @returns
   */
  public generateFindOneResponse(dtoClass?: any): Record<any, any> {
    const properties = this.convertDto(dtoClass);
    const obj = this.findAndInjectClassToSchema(
      this.findOneResponseSchema,
      properties
    );
    return obj;
  }

  /**
   ** Convert DTO to create success response schema
   * @param dtoClass
   * @returns
   */
  public generateCreateSuccessResponse(dtoClass: any): Record<any, any> {
    const properties = this.convertDto(dtoClass);
    const obj = this.findAndInjectClassToSchema(
      this.findOneResponseSchema,
      properties
    );
    return obj;
  }

  /**
   ** Convert DTO to error response schema
   * @param dtoClass
   * @returns
   */
  public generateErrorResponse(
    message: string,
    code?: string,
    httpStatusCode?: number,
    httpStatusMessage?: string
  ): Record<any, any> {
    let errorClass: any = {
      message: {
        type: "string",
        description: "Error message",
        example: message,
      },
    };
    if (code) {
      errorClass["code"] = {
        type: "string",
        description: "Error code",
        example: code,
      };
    }
    let obj = this.errorResponseSchema;
    obj = this.findAndInjectClassToSchema(obj, errorClass);
    if (httpStatusCode) {
      obj = this.findAndInjectHttpStatusToSchema(
        this.errorResponseSchema,
        httpStatusCode
      );
    }
    if (httpStatusMessage) {
      obj = this.findAndInjectHttpMessageToSchema(
        this.errorResponseSchema,
        httpStatusMessage
      );
    }
    return obj;
  }
}
