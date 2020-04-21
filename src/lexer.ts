// http://ubs-icap.org/chm/usfm/2.4/index.html
import { IToken } from 'pratt';
import Lexer from 'perplex/lib/lexer';

export class UsfmLexer {
  public lexer: Lexer;
  constructor(s?: string) {
    this.lexer = new Lexer(s);
    this.lexer
      .token('$SKIP_xt', /^\\xt\*/i)
      .token('q1_p', /^\\q\d\s?\n/i)
      .token('q1_p', /^\\q1\s(?=\\f.*\\f\*)/i) // NIV LAM.4
      .token('TAG', /\\\+?\w{0,}\*?\s*/i)
      .token('TEXT', /[^\\]+/)
      .token('p', /^\\p\s?\n/i)
      .token('br', /^\\p\s/i)
      .token('po', /^\\po\s?\n/i)
      .token('pr', /^\\pr\s/i)
      .token('p', /^\\pi\d\s?\n/i)
      .token('p', /^\\pm\d\s?\n/i)
      .token('br', /^\\pi\d\s/i);
  }

  private _tkn(t: IToken) {
    if (t.type == 'TAG') t.type = t.match.replace(/^\\/, '').trim();

    return t;
  }

  peek(): IToken {
    return this._tkn(this.lexer.peek());
  }

  next(): IToken {
    return this._tkn(this.lexer.next());
  }

  expect(type: string): IToken {
    const token = this.lexer.next();
    const surrogateType = token.type == 'TAG' ? token.match.replace(/^\\/, '').trim() : token.type;
    // Make expect more forgiving if closing tag has an errant '+' value (it's all the NIV's fault)
    if (surrogateType != type && surrogateType.replace(/^\+/, '') != type) {
      const { start } = token.strpos();
      throw new Error(`Expected ${type}, got ${surrogateType} (at ${start.line}:${start.column})`);
    }
    return token;
  }
}
