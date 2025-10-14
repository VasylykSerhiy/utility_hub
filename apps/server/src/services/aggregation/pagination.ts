import { PaginateOptions } from '@workspace/types';
import mongoose, { PipelineStage } from 'mongoose';

export const aggregateWithPagination = async <
  TDoc extends mongoose.Document,
  TResult = TDoc,
>(
  model: mongoose.Model<TDoc>,
  pipeline: PipelineStage[],
  { page = 1, pageSize = 10 }: PaginateOptions,
): Promise<{
  data: TResult[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}> => {
  const skip = (page - 1) * pageSize;

  const paginatedPipeline: PipelineStage[] = [
    ...pipeline,
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: pageSize }],
        totalCount: [{ $count: 'count' }],
      },
    },
    {
      $project: {
        data: 1,
        total: { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
      },
    },
  ];

  const result = await model.aggregate(paginatedPipeline).exec();
  const { data, total } = result[0] || { data: [], total: 0 };

  return {
    data: data as TResult[],
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
    pageSize,
  };
};
