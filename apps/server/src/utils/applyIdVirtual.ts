import type { Document, Schema, SchemaOptions } from 'mongoose';

export const applyIdVirtual = (schema: Schema) => {
  schema.virtual('id').get(function (this: Document) {
    return this._id?.toHexString?.();
  });

  const options: SchemaOptions['toJSON'] = {
    virtuals: true,
    versionKey: false,
  };

  schema.set('toJSON', {
    ...options,
    transform: (
      _doc: Document,
      ret: Record<string, unknown> & { _id?: unknown },
    ) => {
      delete ret._id;
    },
  });

  schema.set('toObject', {
    ...options,
    transform: (
      _doc: Document,
      ret: Record<string, unknown> & { _id?: unknown },
    ) => {
      delete ret._id;
    },
  });
};
