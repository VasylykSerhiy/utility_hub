import { IProperty, PaginateOptions } from '@workspace/types';
import mongoose from 'mongoose';

import type {
  CreatePropertySchema,
  MonthSchema,
  UpdatePropertySchema,
} from '@workspace/utils/schemas/types';

import { Month, Property, Tariff } from '../models/database';
import { IMongooseUser } from '../types';
import { findWithPagination } from '../utils/findWithPagination';
import { aggregateWithPagination } from './aggregation/pagination';
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
      startDate: new Date('1970-01-01'),
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
    const property = await Property.findOne<IProperty>({
      _id: id,
      userId: user._id,
    });

    if (!property) throw new Error('Property not found');

    const { tariffs, fixedCosts } = data;

    if (tariffs || fixedCosts) {
      const prevTariff = await Tariff.findOne(
        { propertyId: property.id },
        {},
        { sort: { startDate: -1 }, session },
      );

      if (prevTariff) {
        await Tariff.updateOne(
          { _id: prevTariff._id },
          { $set: { endDate: new Date() } },
          { session },
        );
      }

      await Tariff.findOneAndUpdate(
        { propertyId: property.id, endDate: { $exists: false } },
        {
          ...(tariffs && { tariffs }),
          ...(fixedCosts && { fixedCosts }),
          startDate: new Date(),
          endDate: null,
        },
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

export const getMonths = async ({
  propertyId,
  page = 1,
  pageSize = 10,
}: {
  propertyId: string;
} & PaginateOptions) => {
  const pipeline = [
    { $match: { propertyId: new mongoose.Types.ObjectId(propertyId) } },
    ...getAllMonthsPipeline,
    { $sort: { date: -1 as const } },
  ];

  return aggregateWithPagination(Month, pipeline, {
    page,
    pageSize,
  });
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

export const getLastTariff = async (propertyId: string) => {
  return Tariff.findOne({ propertyId }, {}, { sort: { startDate: -1 } });
};

export const getTariffs = async ({
  propertyId,
  page = 1,
  pageSize = 10,
}: {
  propertyId: string;
} & PaginateOptions) => {
  return findWithPagination(
    Tariff,
    { propertyId },
    { startDate: -1 },
    { page, pageSize },
  );
};

export const getMetrics = async ({
  propertyId,
}: {
  propertyId: string;
} & PaginateOptions) => {
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const preStartDate = new Date(startDate);
  preStartDate.setMonth(preStartDate.getMonth() - 1);

  return Month.aggregate([
    {
      $match: {
        date: { $gte: preStartDate },
        propertyId: new mongoose.Types.ObjectId(propertyId),
      },
    },
    ...getAllMonthsPipeline,
    { $match: { date: { $gte: startDate } } },
    { $sort: { date: 1 } },
  ]);
};

export default {
  getProperties,
  createProperty,
  updateProperty,
  getMonths,
  createMonth,
  getProperty,
  getLastTariff,
  getTariffs,
  getMetrics,
};
