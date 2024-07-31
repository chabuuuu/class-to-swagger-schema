import "reflect-metadata";
export let propertiesStorage: Map<string, Array<string>> = new Map();

/**
 ** Mark that this property will be map to swagger schema
 * @param description (optional) The description of the property that will be map to swagger schema property description
 * @returns
 */
export function SwaggerProperty(description?: string) {
  const metaDataValue = {
    description: description,
  };
  return function (target: any, propertyKey: string) {
    if (!propertiesStorage.has(target.constructor.name)) {
      propertiesStorage.set(target.constructor.name, []);
    }
    propertiesStorage.get(target.constructor.name)?.push(propertyKey);

    Reflect.defineMetadata(
      "swagger-property",
      metaDataValue,
      target,
      propertyKey
    );
  };
}

export function getSwaggerProperty(
  target: any,
  propertyKey: string
):
  | {
      description: string | undefined;
    }
  | undefined {
  return Reflect.getMetadata("swagger-property", target, propertyKey);
}
