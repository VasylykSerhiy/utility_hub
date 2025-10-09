import { IMonth, IProperty } from '@workspace/types';
import { MonthSchema, PropertySchema } from '@workspace/utils';

import { calcElectricity, calcTotalElectricity } from '../helpers';
import { Month, Property } from '../models/database';
import { IMongooseUser } from '../types';

const getProperties = async (user: IMongooseUser) => {
  const properties = await Property.find({ userId: user._id });

  return await Promise.all(
    properties.map(async property => {
      const lastMonth = await Month.findOne<IMonth>({
        propertyId: property._id,
      })
        .sort({
          createdAt: -1,
        })
        .limit(1);

      if (!lastMonth) {
        return {
          ...property.toObject(),
          lastMonth: {},
        };
      }

      return {
        ...property.toObject(),
        lastMonth: lastMonth,
      };
    }),
  );
};

const createProperty = async ({
  user,
  data,
}: {
  user: IMongooseUser;
  data: PropertySchema;
}) => {
  const property = new Property({
    ...data,
    userId: user._id,
    electricityType: data?.tariffs?.electricity?.type,
  });
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
    {
      ...data,
      ...(data?.tariffs?.electricity?.type && {
        electricityType: data?.tariffs?.electricity?.type,
      }),
    },
    {
      new: true,
    },
  );

  if (!property) {
    throw new Error('Property not found');
  }

  return property;
};

const getMonths = async ({
  user,
  propertyId,
}: {
  user: IMongooseUser;
  propertyId: string;
}) => {
  const userId = user._id;
  const property = await Property.findOne<IProperty>({
    _id: propertyId,
    userId,
  });

  if (!property) {
    throw new Error('Property not found or access denied');
  }

  return Month.find<IMonth>({ propertyId }).sort({ month: 1 });
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

  const prevMonth = await Month.find<IMonth>({ propertyId })
    .sort({ date: -1 })
    .limit(1);

  const prevMeters = prevMonth[0]?.meters ?? {
    electricity: {
      type: 'single',
      single: 0,
    },
    water: 0,
    gas: 0,
  };

  const difference = {
    electricity: calcElectricity(
      data.meters.electricity,
      prevMeters.electricity,
    ),
    water: data.meters.water - (prevMeters.water ?? 0),
    gas: data.meters.gas - (prevMeters.gas ?? 0),
  };

  const totalElectricity = calcTotalElectricity(
    difference.electricity,
    property.tariffs.electricity,
  );

  const utilities: Array<keyof typeof difference> = ['water', 'gas'];

  const total =
    totalElectricity +
    utilities.reduce((sum, key) => {
      const diff = Number(difference[key]);
      const tariff = Number(property.tariffs[key]);
      return sum + diff * tariff;
    }, 0) +
    Object.values(property.fixedCosts ?? {}).reduce(
      (sum, cost) => sum + (cost ?? 0),
      0,
    );

  const monthRecord = new Month({
    propertyId,
    date: data.date,
    meters: data.meters,
    difference,
    tariffs: property.tariffs,
    fixedCosts: property.fixedCosts,
    total,
  });

  await monthRecord.save();
  return monthRecord;
};

export default {
  getProperties,
  createProperty,
  updateProperty,
  getMonths,
  createMonth,
};
