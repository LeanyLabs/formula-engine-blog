import { CstParser } from "chevrotain";
import { tokens } from "./lexer";

export class FormulaParser extends CstParser {
  constructor() {
    super(tokens, {
      maxLookahead: 1,
    });
    this.performSelfAnalysis();
  }

  expression = this.RULE("expression", () => {
    this.SUBRULE(this.additionExpression);
  });

  additionExpression = this.RULE("additionExpression", () => {
    this.SUBRULE(this.multiplicationExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME(tokens.AdditionOperator);
      this.SUBRULE1(this.multiplicationExpression, { LABEL: "rhs" });
    });
  });

  multiplicationExpression = this.RULE("multiplicationExpression", () => {
    this.SUBRULE(this.atomicExpression, { LABEL: "lhs" });
    this.MANY(() => {
      this.CONSUME(tokens.MultiplicationOperator);
      this.SUBRULE1(this.atomicExpression, { LABEL: "rhs" });
    });
  });

  atomicExpression = this.RULE("atomicExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.parenthesisExpression) },
      { ALT: () => this.CONSUME(tokens.NumberLiteral) },
    ]);
  });

  parenthesisExpression = this.RULE("parenthesisExpression", () => {
    this.CONSUME(tokens.LParen);
    this.SUBRULE(this.expression);
    this.CONSUME(tokens.RParen);
  });
}
