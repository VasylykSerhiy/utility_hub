import { IMonth, IProperty } from '@workspace/types';
import { MonthSchema } from '@workspace/utils';

import { Month, Property } from '../models/database';
import { IMongooseUser } from '../types';

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

const createMonth = async ({
  user,
  data,
}: {
  user: IMongooseUser;
  data: MonthSchema;
}) => {
  const property = await Property.findOne<IProperty>({
    _id: data.propertyId,
    userId: user._id,
  });

  if (!property) {
    throw new Error('Квартира не знайдена');
  }

  const prevMonth = await Month.find({ propertyId: data.propertyId })
    .sort({ date: -1 })
    .limit(1);

  const prevMeters = prevMonth[0]?.meters || {
    electricityDay: 0,
    electricityNight: 0,
    water: 0,
    gas: 0,
  };

  const difference = {
    electricityDay: data.meters.electricityDay - prevMeters.electricityDay,
    electricityNight:
      data.meters.electricityNight - prevMeters.electricityNight,
    water: data.meters.water - prevMeters.water,
    gas: data.meters.gas - prevMeters.gas,
  };

  const total =
    difference.electricityDay * property.tariffs.electricityDay +
    difference.electricityNight * property.tariffs.electricityNight +
    difference.water * property.tariffs.water +
    difference.gas * property.tariffs.gas +
    property.fixedCosts.internet +
    property.fixedCosts.maintenance;

  const monthRecord = new Month<IMonth>({
    propertyId: data.propertyId,
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

export default { getMonths, createMonth };
