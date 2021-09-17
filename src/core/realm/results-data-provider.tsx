import { Results } from 'realm';
import { BaseDataProvider } from 'recyclerlistview';

export type P9DataObject = { _id: string } & Realm.Object;

export class ResultsDataProvider extends BaseDataProvider {
  results: Results<any> | undefined;

  constructor(public rowHasChanged: (r1: any, r2: any) => boolean, getStableId?: (index: number) => string) {
    super(rowHasChanged, getStableId);
  }

  getDataForIndex = (index: number) => this.results?.[index]?.toJSON(); // this.getAllData()[index];

  getAllData = () => (this.results?.isValid?.() ? (this.results as unknown as any[]) : ([] as any[]));

  getSize = () => this.results?.length ?? 0;

  hasStableIds = () => true;

  requiresDataChangeHandling = () => true;

  getFirstIndexToProcessInternal = () => 0;

  // getStableId = (index: number) => this.results?.[index]?._id ?? index.toString();

  newInstance = (rowHasChanged: (r1: any, r2: any) => boolean) => new ResultsDataProvider(rowHasChanged);

  cloneWithRows = (data: any[]) => {
    const dp = new ResultsDataProvider(this.rowHasChanged, this.getStableId);
    dp.results = data as unknown as Results<any>;

    return dp;
  };
}
