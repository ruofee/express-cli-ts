interface Handler<TLast, TNext> {
  (item: TLast, index: number): TNext;
}

interface Operation<TLast, TNext> {
  (arr: Array<TLast>): Array<TNext>;
}

interface OperationNotReturn<TLast> {
  (arr: Array<TLast>): void;
}

type ArrayInput<T> = Array<T>;

function arrayCommon<TLast, TNext>(arr: ArrayInput<TLast>, operation: Operation<TLast, TNext>): Array<TNext>;
function arrayCommon<TLast>(arr: ArrayInput<TLast>, operation: OperationNotReturn<TLast>): void;
function arrayCommon<TLast, TNext>(arr: ArrayInput<TLast>, operation: Operation<TLast, TNext> | OperationNotReturn<TLast>): Array<TNext> | void {
  const isArray = Array.isArray(arr);
  if (isArray) {
    return operation(arr as Array<TLast>);
  }
  return [];
}

export function arrayMap<TLast, TNext>(arr: ArrayInput<TLast>, handler: Handler<TLast, TNext>): Array<TNext> {
  return arrayCommon(arr, innerArr => innerArr.map(handler));
}

export function arrayForEach<TLast, TNext>(arr: ArrayInput<TLast>, handler: Handler<TLast, TNext>): void {
  arrayCommon(arr, innerArr => innerArr.forEach(handler));
}
