import type { PipelineStage } from 'mongoose';

type ComputeTotalAnyOptions = {
  metersPrefix: string;
  differencePrefix: string;
  tariffPrefix: string;
};

// Обчислюємо total
export const computeTotalAny = ({
  metersPrefix,
  differencePrefix,
  tariffPrefix,
}: ComputeTotalAnyOptions) => ({
  $add: [
    // Електрика
    {
      $cond: [
        { $eq: [`${metersPrefix}.electricity.type`, 'single'] },
        {
          $multiply: [
            { $ifNull: [`${differencePrefix}.electricity.single`, 0] },
            {
              $ifNull: [`${tariffPrefix}.tariffs.electricity.single`, 0],
            },
          ],
        },
        {
          $add: [
            {
              $multiply: [
                { $ifNull: [`${differencePrefix}.electricity.day`, 0] },
                {
                  $ifNull: [`${tariffPrefix}.tariffs.electricity.day`, 0],
                },
              ],
            },
            {
              $multiply: [
                { $ifNull: [`${differencePrefix}.electricity.night`, 0] },
                {
                  $ifNull: [`${tariffPrefix}.tariffs.electricity.night`, 0],
                },
              ],
            },
          ],
        },
      ],
    },
    // Вода
    {
      $multiply: [
        { $ifNull: [`${differencePrefix}.water`, 0] },
        { $ifNull: [`${tariffPrefix}.tariffs.water`, 0] },
      ],
    },
    // Газ
    {
      $multiply: [
        { $ifNull: [`${differencePrefix}.gas`, 0] },
        { $ifNull: [`${tariffPrefix}.tariffs.gas`, 0] },
      ],
    },
    // FixedCosts
    {
      $reduce: {
        input: {
          $objectToArray: { $ifNull: [`${tariffPrefix}.fixedCosts`, {}] },
        },
        initialValue: 0,
        in: { $add: ['$$value', { $ifNull: ['$$this.v', 0] }] },
      },
    },
  ],
});
export const computeTotalLastMonth: PipelineStage = {
  $addFields: {
    'lastMonth.total': {
      ...computeTotalAny({
        metersPrefix: '$lastMonth.meters',
        differencePrefix: '$lastMonth.difference',
        tariffPrefix: '$lastMonth.tariff',
      }),
    },
  },
};

export const computeTotalCurrent: PipelineStage = {
  $addFields: {
    total: computeTotalAny({
      metersPrefix: '$meters',
      differencePrefix: '$difference',
      tariffPrefix: '$tariff',
    }),
  },
};
