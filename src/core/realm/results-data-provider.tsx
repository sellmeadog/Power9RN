import { Results } from 'realm';
import { BaseDataProvider } from 'recyclerlistview';

export type P9DataObject = { _id: string } & Realm.Object;

export class ResultsDataProvider<T extends P9DataObject = P9DataObject> extends BaseDataProvider {
  get isValid() {
    return checkValidity(this.results);
  }

  constructor(private results: Results<T> | ArrayLike<T>) {
    super((a, b) => a?._id !== b?._id, makeGetStableId());
  }

  getAllData = () => (this.isValid ? (this.results as unknown as any[]) : []);

  getDataForIndex = (index: number) => (this.isValid ? (this.results[index]?.toJSON() as T | undefined) : undefined);

  getSize = () => (this.isValid ? this.results.length : 0);

  newInstance = () => new ResultsDataProvider<T>(this.results);

  cloneWithRows = (data: any[]) => {
    return new ResultsDataProvider(data);
  };
}

function checkValidity<T extends { _id: string } = { _id: string }>(results: Results<T> | ArrayLike<T>): boolean {
  if (results instanceof Results) {
    return results.isValid();
  }

  return false;
}

function makeGetStableId(): ((index: number) => string) | undefined {
  return (index) => index.toString();
}
