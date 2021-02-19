const { marbles } = require("rxjs-marbles/jest");
const RxJSOperators = require("rxjs/operators");
const { bufferDebounce } = require("./bufferDebounce");

describe("bufferDebounce", () => {
  it(
    "works with > 0 timeout",
    marbles((m) => {
      const source$ = m.cold("--a--b----c-----d");
      const ms = m.time("       ---|");
      const expected = "      --------1----2-----3";

      const actual$ = source$.pipe(bufferDebounce(ms));
      m.expect(actual$).toBeObservable(expected, {
        1: ["a", "b"],
        2: ["c"],
        3: ["d"],
      });
    })
  );

  it(
    "works with 0 timeout",
    marbles((m) => {
      const source$ = m.cold("--(ab)--c--d");
      const ms = m.time("       |");
      const expected = "      --1-----2--3";

      const actual$ = source$.pipe(bufferDebounce(ms));
      m.expect(actual$).toBeObservable(expected, {
        1: ["a", "b"],
        2: ["c"],
        3: ["d"],
      });
    })
  );

  it(
    "works with `startWith`",
    marbles((m) => {
      const source$ = m.cold("-");
      const ms = m.time("     |");
      const expected = "      1";

      const actual$ = source$.pipe(
        RxJSOperators.startWith("a"),
        bufferDebounce(ms)
      );
      m.expect(actual$).toBeObservable(expected, { 1: ["a"] });
    })
  );

  it(
    "works with observable that emits and completes immediately",
    marbles((m) => {
      const source$ = m.cold("(a|)");
      const ms = m.time("     |");
      const expected = "      (1|)";

      const actual$ = source$.pipe(bufferDebounce(ms));
      m.expect(actual$).toBeObservable(expected, { 1: ["a"] });
    })
  );
});
