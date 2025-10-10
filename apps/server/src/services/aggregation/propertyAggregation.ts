import type { PipelineStage } from 'mongoose';

import {
  computeDifference,
  computeDifferenceForAllMonths,
} from '../pipelines/difference';
import { cleanup, projectIds } from '../pipelines/ids';
import {
  addPrevMetersToAllMonths,
  addPrevMetersToMonths,
  lookupMonths,
  sortMonthsByDate,
  unwindMonths,
} from '../pipelines/months';
import { lookupTariff } from '../pipelines/tariffs';
import '../pipelines/total';
import { computeTotalCurrent, computeTotalLastMonth } from '../pipelines/total';

export const propertyWithLastMonthAndTariff: PipelineStage[] = [
  lookupMonths,
  sortMonthsByDate,
  addPrevMetersToMonths,
  unwindMonths,
  ...lookupTariff({
    dateField: '$lastMonth.date',
    propertyField: '$_id',
    outputField: 'lastMonth.tariff',
  }),
  computeDifference,
  computeTotalLastMonth,
  projectIds,
  cleanup,
];

export const getAllMonthsPipeline: PipelineStage[] = [
  addPrevMetersToAllMonths,
  computeDifferenceForAllMonths,
  ...lookupTariff({ dateField: '$date', propertyField: '$propertyId' }),
  computeTotalCurrent,
  { $sort: { date: -1 } },
];
