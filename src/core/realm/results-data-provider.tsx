import { Results } from 'realm';
import { BaseDataProvider } from 'recyclerlistview';

export type P9DataObject = { _id: string } & Realm.Object;

export class ResultsDataProvider extends BaseDataProvider {
  // getAllData = () => {
  //   const data = super.getAllData() as unknown as Results<any>;
  //   return data.isValid() ? (data as unknown as any[]) : [];
  // };

  // getDataForIndex = (index: number): P9DataObject => this.getAllData()[index].toJSON();

  // public newInstance(
  //   rowHasChanged: (r1: any, r2: any) => boolean,
  //   getStableId?: ((index: number) => string) | undefined,
  // ): BaseDataProvider {
  //   return new ResultsDataProvider(rowHasChanged, getStableId);
  // }

  results: Results<any> | undefined;

  constructor(public rowHasChanged: (r1: any, r2: any) => boolean) {
    super(rowHasChanged, (index) => index.toString());
  }

  getDataForIndex = (index: number) => this.getAllData()[index];

  getAllData = () => (this.results?.isValid?.() ? (this.results as unknown as any[]) : ([] as any[]));

  getSize = () => this.getAllData().length;

  hasStableIds = () => true;

  requiresDataChangeHandling = () => true;

  getFirstIndexToProcessInternal = () => 0;

  getStableId = (index: number) => index.toString();

  newInstance = (rowHasChanged: (r1: any, r2: any) => boolean) => new ResultsDataProvider(rowHasChanged);

  cloneWithRows = (data: any[]) => {
    const dp = new ResultsDataProvider(this.rowHasChanged);
    dp.results = data as unknown as Results<any>;

    return dp;
  };
}
