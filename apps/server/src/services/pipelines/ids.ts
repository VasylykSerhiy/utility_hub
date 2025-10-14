import type { PipelineStage } from 'mongoose';

export const projectIds: PipelineStage = {
  $addFields: {
    'lastMonth.id': '$lastMonth._id',
    'lastMonth.tariff.id': '$lastMonth.tariff._id',
    id: '$_id',
  },
};
export const replaceIdsUniversal: PipelineStage = {
  $addFields: {
    id: '$_id',

    meters: {
      $cond: [
        { $eq: [{ $type: '$meters' }, 'object'] },
        { $mergeObjects: ['$meters', { id: '$meters._id' }] },
        '$meters',
      ],
    },

    prevMeters: {
      $cond: [
        { $eq: [{ $type: '$prevMeters' }, 'object'] },
        { $mergeObjects: ['$prevMeters', { id: '$prevMeters._id' }] },
        '$prevMeters',
      ],
    },

    tariff: {
      $cond: [
        { $eq: [{ $type: '$tariff' }, 'object'] },
        { $mergeObjects: ['$tariff', { id: '$tariff._id' }] },
        '$tariff',
      ],
    },

    readings: {
      $cond: [
        { $eq: [{ $type: '$readings' }, 'array'] },
        {
          $map: {
            input: '$readings',
            as: 'r',
            in: {
              $mergeObjects: ['$$r', { id: '$$r._id' }],
            },
          },
        },
        '$readings',
      ],
    },
  },
};

export const unsetIdsUniversal: PipelineStage = {
  $unset: ['_id', 'meters._id', 'prevMeters._id', 'tariff._id', 'readings._id'],
};

export const cleanup: PipelineStage = {
  $unset: ['_id', 'lastMonth._id', 'lastMonth.tariff._id', 'months'],
};
