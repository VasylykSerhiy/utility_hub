import type { PipelineStage } from 'mongoose';

export const projectIds: PipelineStage = {
  $addFields: {
    'lastMonth.id': '$lastMonth._id',
    'lastMonth.tariff.id': '$lastMonth.tariff._id',
    id: '$_id',
  },
};

export const cleanup: PipelineStage = {
  $unset: ['_id', 'lastMonth._id', 'lastMonth.tariff._id', 'months'],
};
