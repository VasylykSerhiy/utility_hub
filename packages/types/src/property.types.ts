export interface ITariffs {
  electricityDay: number;
  electricityNight: number;
  water: number;
  gas: number;
}

export interface IFixedCosts {
  internet: number;
  maintenance: number;
}

export interface IProperty {
  _id?: string;
  userId: string;
  name: string;
  tariffs: ITariffs;
  fixedCosts: IFixedCosts;
}
