import * as RxJS from "rxjs";
import * as RxJSOperators from "rxjs/operators";
import { prioritize } from "rxjs-etc/operators";

// Buffer the values and emit only after a particular time span has passed without another source
// emission.
// Like `bufferTime`, but uses debouncing instead of throttling.
// https://stackoverflow.com/questions/50515357/debounce-and-buffer-an-rxjs-subscription/50519552#50519552
export const bufferDebounce = (ms: number) => <T>(
  source: RxJS.Observable<T>
): RxJS.Observable<T[]> =>
  // The observable will have multiple subscribers, because it is used by both `buffer` and
  // `debounceTime`. We want to share the execution.
  source.pipe(
    prioritize((first, second) =>
      second.pipe(
        RxJSOperators.buffer(first.pipe(RxJSOperators.debounceTime(ms)))
      )
    )
  );
