import { BaseDataProvider } from 'recyclerlistview';

export type P9DataObject = { _id: string } & Realm.Object;

export class ResultsDataProvider extends BaseDataProvider {
  getDataForIndex = (index: number): P9DataObject => this.getAllData()[index].toJSON();

  public newInstance(
    rowHasChanged: (r1: any, r2: any) => boolean,
    getStableId?: ((index: number) => string) | undefined,
  ): BaseDataProvider {
    return new ResultsDataProvider(rowHasChanged, getStableId);
  }
}
