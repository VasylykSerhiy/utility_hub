import { Schema, SchemaOptions } from 'mongoose';

export const applyIdVirtual = (schema: Schema) => {
  schema.virtual('id').get(function (this: any) {
    return this._id?.toHexString?.();
  });

  const options: SchemaOptions['toJSON'] = {
    virtuals: true,
    versionKey: false,
  };

  schema.set('toJSON', {
    ...options,
    transform: (_doc: any, ret: any) => {
      delete ret._id;
    },
  });

  schema.set('toObject', {
    ...options,
    transform: (_doc: any, ret: any) => {
      delete ret._id;
    },
  });
};
