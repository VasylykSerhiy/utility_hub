import { IProperty } from '@workspace/types';
import mongoose from 'mongoose';

import type {
  CreatePropertySchema,
  MonthSchema,
  UpdatePropertySchema,
} from '@workspace/utils/schemas/types';

import { Month, Property, Tariff } from '../models/database';
import { IMongooseUser } from '../types';
import {
  getAllMonthsPipeline,
  propertyWithLastMonthAndTariff,
} from './aggregation/propertyAggregation';

const getProperties = async (user: IMongooseUser) => {
  return Property.aggregate([
    { $match: { userId: user._id } },
    ...propertyWithLastMonthAndTariff,
  ]);
};

const getProperty = async (user: IMongooseUser, id: string) => {
  const [property] = await Property.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        userId: user._id,
      },
    },
    ...propertyWithLastMonthAndTariff,
  ]);

  if (!property) {
    throw new Error('Property not found or access denied');
  }

  return property;
};

const createProperty = async ({
  user,
  data,
}: {
  user: IMongooseUser;
  data: CreatePropertySchema;
}) => {
  const { tariffs, fixedCosts, ...rest } = data;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const property = await new Property({
      userId: user._id,
      electricityType: tariffs?.electricity?.type ?? 'single',
      ...rest,
    }).save({ session });

    if (!tariffs) new Error('Initial tariffs are required');

    await new Tariff({
      propertyId: property._id,
      startDate: new Date(),
      tariffs,
      fixedCosts,
    }).save({ session });

    await session.commitTransaction();
    return property;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

const updateProperty = async ({
  user,
  id,
  data,
}: {
  user: IMongooseUser;
  id: string;
  data: UpdatePropertySchema;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const property = await Property.findOneAndUpdate<IProperty>(
      { _id: id, userId: user._id },
      Object.fromEntries(
        Object.entries(data).filter(
          ([key]) => key !== 'tariffs' && key !== 'fixedCosts',
        ),
      ) as Partial<IProperty>,
      { new: true, session },
    );

    if (!property) throw new Error('Property not found');

    const { tariffs, fixedCosts } = data;
    if (tariffs || fixedCosts) {
      await Tariff.findOneAndUpdate(
        { propertyId: property.id },
        { ...(tariffs && { tariffs }), ...(fixedCosts && { fixedCosts }) },
        { new: true, upsert: true, session },
      );
    }

    await session.commitTransaction();
    return property;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

export const getMonths = async ({ propertyId }: { propertyId: string }) => {
  console.log(propertyId);
  return Month.aggregate([
    { $match: { propertyId: new mongoose.Types.ObjectId(propertyId) } },

    ...getAllMonthsPipeline,
  ]);
};

export const createMonth = async ({
  user,
  propertyId,
  data,
}: {
  user: IMongooseUser;
  propertyId: string;
  data: MonthSchema;
}) => {
  const property = await Property.findOne<IProperty>({
    _id: propertyId,
    userId: user._id,
  });

  if (!property) throw new Error('Property not found or access denied');

  const newMonth = new Month({
    propertyId,
    date: data.date,
    meters: data.meters,
  });

  await newMonth.save();

  return newMonth;
};

export default {
  getProperties,
  createProperty,
  updateProperty,
  getMonths,
  createMonth,
  getProperty,
};
