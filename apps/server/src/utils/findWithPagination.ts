import { PaginateOptions } from '@workspace/types';
import mongoose from 'mongoose';

export const findWithPagination = async <
  TDoc extends mongoose.Document,
  TResult = TDoc,
>(
  model: mongoose.Model<TDoc>,
  filter: mongoose.FilterQuery<TDoc>,
  sort: Record<string, mongoose.SortOrder> = {},
  { page = 1, pageSize = 10 }: PaginateOptions,
): Promise<{
  data: TResult[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}> => {
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(pageSize).exec(),
    model.countDocuments(filter),
  ]);

  return {
    data: data as TResult[],
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
    pageSize,
  };
};
