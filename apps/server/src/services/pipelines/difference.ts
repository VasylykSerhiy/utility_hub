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

export const computeDifferenceForAllMonths: PipelineStage = {
  $addFields: {
    difference: {
      electricity: {
        $cond: [
          { $eq: ['$meters.electricity.type', 'single'] },
          {
            single: {
              $subtract: [
                '$meters.electricity.single',
                '$prevMeters.electricity.single',
              ],
            },
          },
          {
            day: {
              $subtract: [
                '$meters.electricity.day',
                '$prevMeters.electricity.day',
              ],
            },
            night: {
              $subtract: [
                '$meters.electricity.night',
                '$prevMeters.electricity.night',
              ],
            },
          },
        ],
      },
      water: {
        $subtract: ['$meters.water', { $ifNull: ['$prevMeters.water', 0] }],
      },
      gas: {
        $subtract: ['$meters.gas', { $ifNull: ['$prevMeters.gas', 0] }],
      },
    },
  },
};
