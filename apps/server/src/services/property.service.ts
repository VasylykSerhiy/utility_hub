import { IProperty } from '@workspace/types';
import { PropertySchema } from '@workspace/utils';

import { Property } from '../models/database';
import { IMongooseUser } from '../types';

const getProperties = (user: IMongooseUser) => {
  return Property.find({ userId: user._id });
};

const createProperty = async ({
  user,
  data,
}: {
  user: IMongooseUser;
  data: PropertySchema;
}) => {
  const property = new Property({ ...data, userId: user._id });
  await property.save();
  return property;
};

const updateProperty = async ({
  user,
  id,
  data,
}: {
  user: IMongooseUser;
  id: string;
  data: PropertySchema;
}) => {
  const property = await Property.findOneAndUpdate<IProperty>(
    { _id: id, userId: user._id },
    data,
    {
      new: true,
    },
  );

  if (!property) {
    throw new Error('Property not found');
  }

  return property;
};

export default { getProperties, createProperty, updateProperty };
