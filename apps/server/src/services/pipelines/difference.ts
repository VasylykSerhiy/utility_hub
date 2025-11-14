import type { PipelineStage } from 'mongoose';





// Обчислюємо difference для lastMonth
const safeSubtract = (a: string, b: string) => ({
  $let: {
    vars: {
      diff: { $subtract: [a, b] },
    },
    in: { $cond: [{ $lt: ['$$diff', 0] }, 0, '$$diff'] },
  },
});

export const computeDifference: PipelineStage = {
  $addFields: {
    lastMonth: {
      $mergeObjects: [
        '$lastMonth',
        {
          difference: {
            water: safeSubtract(
              '$lastMonth.meters.water',
              '$lastMonth.prevMeters.water',
            ),
            gas: safeSubtract(
              '$lastMonth.meters.gas',
              '$lastMonth.prevMeters.gas',
            ),
            electricity: {
              $cond: [
                { $eq: ['$lastMonth.meters.electricity.type', 'single'] },
                {
                  single: safeSubtract(
                    '$lastMonth.meters.electricity.single',
                    '$lastMonth.prevMeters.electricity.single',
                  ),
                },
                {
                  day: safeSubtract(
                    '$lastMonth.meters.electricity.day',
                    '$lastMonth.prevMeters.electricity.day',
                  ),
                  night: safeSubtract(
                    '$lastMonth.meters.electricity.night',
                    '$lastMonth.prevMeters.electricity.night',
                  ),
                },
              ],
            },
          },
        },
      ],
    },
  },
};

const computeDifferenceField = (field: string) => ({
  $cond: [
    { $ifNull: [`$prevMeters.${field}`, false] },
    {
      $let: {
        vars: {
          diff: { $subtract: [`$meters.${field}`, `$prevMeters.${field}`] },
        },
        in: {
          $cond: [{ $lt: ['$$diff', 0] }, 0, '$$diff'],
        },
      },
    },
    0,
  ],
});

export const computeDifferenceForAllMonths: PipelineStage = {
  $addFields: {
    difference: {
      electricity: {
        $cond: [
          { $eq: ['$meters.electricity.type', 'single'] },
          {
            type: '$meters.electricity.type',
            single: computeDifferenceField('electricity.single'),
          },
          {
            type: '$meters.electricity.type',
            day: computeDifferenceField('electricity.day'),
            night: computeDifferenceField('electricity.night'),
          },
        ],
      },
      water: computeDifferenceField('water'),
      gas: computeDifferenceField('gas'),
    },
  },
};
