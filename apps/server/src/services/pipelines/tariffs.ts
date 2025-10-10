import type { PipelineStage } from 'mongoose';

type LookupTariffOptions = {
  dateField: string; // Поле дати, наприклад '$date' або '$lastMonth.date'
  propertyField: string; // Поле propertyId, наприклад '$propertyId' або '$_id'
  outputField?: string; // Куди підставляти результат, за замовчуванням 'tariff'
};

export const lookupTariff = ({
  dateField,
  propertyField,
  outputField = 'tariff',
}: LookupTariffOptions): PipelineStage[] => [
  {
    $lookup: {
      from: 'tariffs',
      let: { monthDate: dateField, propertyId: propertyField },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$propertyId', '$$propertyId'] },
                { $lte: ['$startDate', '$$monthDate'] },
                {
                  $or: [
                    {
                      $gte: [
                        { $ifNull: ['$endDate', new Date('9999-12-31')] },
                        '$$monthDate',
                      ],
                    },
                    { $eq: ['$endDate', null] },
                  ],
                },
              ],
            },
          },
        },
        { $sort: { startDate: -1 } },
        { $limit: 1 },
      ],
      as: outputField,
    },
  },
  {
    $unwind: { path: `$${outputField}`, preserveNullAndEmptyArrays: true },
  },
];
