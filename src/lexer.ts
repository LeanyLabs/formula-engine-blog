import { createToken, Lexer, TokenType } from "chevrotain";

enum TokenName {
  AdditionOperator = "AdditionOperator",
  Plus = "Plus",
  Minus = "Minus",
  MultiplicationOperator = "MultiplicationOperator",
  Mul = "Mul",
  Div = "Div",

  LParen = "LParen",
  RParen = "RParen",

  WhiteSpace = "WhiteSpace",
  Comma = "Comma",

  NumberLiteral = "NumberLiteral",
}

const AdditionOperator = createToken({
  name: TokenName.AdditionOperator,
  pattern: Lexer.NA,
});
const Plus = createToken({
  name: TokenName.Plus,
  pattern: /\+/,
  categories: AdditionOperator,
});
const Minus = createToken({
  name: TokenName.Minus,
  pattern: /-/,
  categories: AdditionOperator,
});

const MultiplicationOperator = createToken({
  name: TokenName.MultiplicationOperator,
  pattern: Lexer.NA,
});
const Mul = createToken({
  name: TokenName.Mul,
  pattern: /\*/,
  categories: MultiplicationOperator,
});
const Div = createToken({
  name: TokenName.Div,
  pattern: /\//,
  categories: MultiplicationOperator,
});

const LParen = createToken({
  name: TokenName.LParen,
  pattern: /\(/,
});
const RParen = createToken({
  name: TokenName.RParen,
  pattern: /\)/,
});

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const NumberLiteral = createToken({
  name: TokenName.NumberLiteral,
  pattern: /[0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?/,
});

const tokensByPriority = [
  WhiteSpace,
  Plus,
  Minus,
  Mul,
  Div,
  LParen,
  RParen,
  NumberLiteral,
  AdditionOperator,
  MultiplicationOperator,
];

export const FormulaLexer = new Lexer(tokensByPriority, {
  ensureOptimizations: true,
});

export type TokenTypeDict = { [key in TokenName]: TokenType };
export const tokens: TokenTypeDict = tokensByPriority.reduce(
  (acc, tokenType) => {
    acc[tokenType.name] = tokenType;
    return acc;
  },
  {} as TokenTypeDict
);
