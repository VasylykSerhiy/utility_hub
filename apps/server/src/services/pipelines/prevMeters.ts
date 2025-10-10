import type { PipelineStage } from 'mongoose';

export const addPrevMeters: PipelineStage = {
  $addFields: {
    months: {
      $map: {
        input: { $range: [0, { $size: '$months' }] },
        as: 'idx',
        in: {
          $let: {
            vars: {
              current: { $arrayElemAt: ['$months', '$$idx'] },
              prev: {
                $cond: [
                  { $gt: ['$$idx', 0] },
                  { $arrayElemAt: ['$months', { $subtract: ['$$idx', 1] }] },
                  {
                    electricity: { type: 'single', single: 0 },
                    water: 0,
                    gas: 0,
                  },
                ],
              },
            },
            in: {
              $mergeObjects: ['$$current', { prevMeters: '$$prev' }],
            },
          },
        },
      },
    },
  },
};
