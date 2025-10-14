import type { PaginateOptions } from '@workspace/types';
import { PipelineStage } from 'mongoose';

/**
 * Додає пагінацію (page / pageSize) в будь-який pipeline.
 *
 * Приклад використання:
 * Month.aggregate([
 *   { $match: { propertyId } },
 *   { $sort: { date: -1 } },
 *   ...paginate({ page, pageSize })
 * ])
 */
export const paginate = ({
  page = 1,
  pageSize = 10,
}: PaginateOptions): PipelineStage[] => {
  const skip = (page - 1) * pageSize;

  return [
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: skip }, { $limit: pageSize }],
      },
    },
    {
      $project: {
        data: 1,
        total: { $ifNull: [{ $arrayElemAt: ['$metadata.total', 0] }, 0] },
      },
    },
  ];
};
