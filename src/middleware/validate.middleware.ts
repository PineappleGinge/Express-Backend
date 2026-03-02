import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { z } from 'zod';

type Schema = z.ZodTypeAny | Joi.ObjectSchema<any>;

export const validate = (schema: Schema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if ('safeParse' in schema) {
    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.issues
      });
    }

    req.body = validation.data;
    return next();
  }

  const { value, error } = (schema as Joi.ObjectSchema).validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details
    });
  }

  req.body = value;
  next();
};
