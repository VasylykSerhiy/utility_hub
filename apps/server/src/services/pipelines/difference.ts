import type { PipelineStage } from 'mongoose';

// Обчислюємо difference для lastMonth
export const computeDifference: PipelineStage = {
  $addFields: {
    lastMonth: {
      $mergeObjects: [
        '$lastMonth',
        {
          difference: {
            water: {
              $subtract: [
                '$lastMonth.meters.water',
                '$lastMonth.prevMeters.water',
              ],
            },
            gas: {
              $subtract: ['$lastMonth.meters.gas', '$lastMonth.prevMeters.gas'],
            },
            electricity: {
              $cond: [
                { $eq: ['$lastMonth.meters.electricity.type', 'single'] },
                {
                  single: {
                    $subtract: [
                      '$lastMonth.meters.electricity.single',
                      '$lastMonth.prevMeters.electricity.single',
                    ],
                  },
                },
                {
                  day: {
                    $subtract: [
                      '$lastMonth.meters.electricity.day',
                      '$lastMonth.prevMeters.electricity.day',
                    ],
                  },
                  night: {
                    $subtract: [
                      '$lastMonth.meters.electricity.night',
                      '$lastMonth.prevMeters.electricity.night',
                    ],
                  },
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
    { $subtract: [`$meters.${field}`, `$prevMeters.${field}`] },
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
