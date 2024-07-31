import "reflect-metadata";

/**
 *
 * @param example The example of the property that will be map to swagger schema property example
 * @returns
 */
export function SwaggerExample(example: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("example", example, target, propertyKey);
  };
}

export function getSwaggerExample(
  target: any,
  propertyKey: string
): string | undefined {
  return Reflect.getMetadata("example", target, propertyKey);
}
