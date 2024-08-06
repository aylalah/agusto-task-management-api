import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export const IsName = (validationOptions?: ValidationOptions) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return !/\d/.test(value)
        },
        defaultMessage(args?: ValidationArguments) {
          return `${args.property} must not contain a numeric character`
        }
      },
    });
  };
}