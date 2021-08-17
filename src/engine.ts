import { LexerError, ParserError } from "./exceptions";
import { FormulaLexer } from "./lexer";
import { FormulaParser } from "./parser";
import { createEvalVisitor, IVisitor } from "./visitor";

export type FunctionsResolver = Record<string, Function>;
export type ReferenceResolver = (names: string[]) => Record<string, any>;
export type ReferenceResolverAsync = (
  names: string[]
) => Promise<Record<string, any>>;

export class FormulaEngine {
  private parser: FormulaParser;
  private evalVisitor: IVisitor;

  constructor() {
    this.parser = new FormulaParser();
    this.evalVisitor = createEvalVisitor(this.parser);
  }

  exec(formula: string) {
    const cst = this.getCst(formula);

    const result = this.evalVisitor.visit(cst);
    return result;
  }

  private getCst(formula: string) {
    const lexingResult = this.tokenize(formula);
    const cst = this.parse(lexingResult);
    return cst;
  }

  private tokenize(formula: string) {
    const lexingResult = FormulaLexer.tokenize(formula);
    if (lexingResult.errors.length > 0) {
      throw new LexerError("Tokenization error", lexingResult.errors);
    }
    return lexingResult;
  }

  private parse(lexingResult) {
    this.parser.reset();
    this.parser.input = lexingResult.tokens;
    const cst = this.parser.expression();

    if (!cst || this.parser.errors.length > 0) {
      throw new ParserError("Parsing error", this.parser.errors);
    }

    return cst;
  }
}
