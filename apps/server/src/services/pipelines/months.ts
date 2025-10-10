import type { PipelineStage } from 'mongoose';

// Підтягнути всі місяці
export const lookupMonths: PipelineStage = {
  $lookup: {
    from: 'months',
    localField: '_id',
    foreignField: 'propertyId',
    as: 'months',
  },
};

// Сортуємо місяці по даті
export const sortMonthsByDate: PipelineStage = {
  $addFields: {
    months: { $sortArray: { input: '$months', sortBy: { date: 1 } } },
  },
};

// Додаємо попередній місяць для обчислення difference
export const addPrevMetersToMonths: PipelineStage = {
  $addFields: {
    months: {
      $map: {
        input: { $range: [0, { $size: '$months' }] },
        as: 'idx',
        in: {
          $mergeObjects: [
            { $arrayElemAt: ['$months', '$$idx'] },
            {
              prevMeters: {
                $cond: [
                  { $gt: ['$$idx', 0] },
                  {
                    $arrayElemAt: [
                      '$months.meters',
                      { $subtract: ['$$idx', 1] },
                    ],
                  },
                  {
                    electricity: { type: 'single', single: 0 },
                    water: 0,
                    gas: 0,
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
};

// Додаємо попередній місяць для обчислення difference
export const addPrevMetersToAllMonths: PipelineStage = {
  $setWindowFields: {
    partitionBy: '$propertyId',
    sortBy: { date: 1 },
    output: {
      prevMeters: {
        $shift: {
          output: '$meters',
          by: -1,
        },
      },
    },
  },
};

// Вибираємо останній місяць
export const unwindMonths: PipelineStage = {
  $addFields: { lastMonth: { $arrayElemAt: ['$months', -1] } },
};
