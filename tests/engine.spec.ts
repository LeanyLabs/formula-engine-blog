import { FormulaEngine } from "../src/engine";

describe("Engine", () => {
  const engine = new FormulaEngine();

  function assertEqual(formula: string, result) {
    expect(engine.exec(formula)).toEqual(result);
  }

  describe("simple operations", () => {
    describe("add/subtract", () => {
      it("should work for literals", () => {
        assertEqual("10 + 20", 30);
      });
      it("should work for literals - sub", () => {
        assertEqual("10 - 20", -10);
      });
    });

    describe("mul/div", () => {
      it("should work for literals", () => {
        assertEqual("10 * 20", 200);
      });
    });

    describe("priorities", () => {
      it("should do mul before addition", () => {
        assertEqual("1 + 2 * 3", 7);
      });

      it("should do div before addition", () => {
        assertEqual("1 + 3 / 3", 2);
      });

      it("should do op in parens first", () => {
        assertEqual("(1 + 3) / 2", 2);
      });
    });

    describe("formatting", () => {
      it("should work w/o whitespace separators", () => {
        assertEqual("10+20", 30);
        assertEqual("10+ 20", 30);
        assertEqual("10 +20", 30);
        assertEqual("1 + 2 *3", 7);
        assertEqual("1+2 *3", 7);
      });
    });
  });

  describe("invalid syntax", () => {
    it("should throw ParsingError", async () => {
      expect(() => engine.exec(`10 <*`)).toThrowErrorMatchingSnapshot();
    });

    it("should throw LexerError", async () => {
      expect(() => engine.exec(`^`)).toThrowErrorMatchingSnapshot();
    });
  });
});
