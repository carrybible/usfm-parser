import { Parser } from 'pratt';
import { UsfmLexer } from './lexer';

function arrify(val) {
  if (val === null || val === undefined) {
    return ' ';
  }

  return val;
}

function single(parser: Parser, bp: number, type: string) {
  parser
    .builder()
    .nud(type, bp, (t, bp) => ' ')
    .led(type, bp, (left, t, bp) => left.concat(' '));
}

function value(parser: Parser, lex: UsfmLexer, bp: number, type: string) {
  parser
    .builder()
    .nud(type, bp, (t, bp) => parser.parse(bp))
    .led(type, bp, (left, t, bp) => left.concat(parser.parse(bp)));
}

function ignoreValue(parser: Parser, lex: UsfmLexer, bp: number, type: string) {
  parser
    .builder()
    .nud(type, bp, (t, bp) => {
      parser.parse(bp);
      return '';
    })
    .led(type, bp, (left, t, bp) => {
      parser.parse(bp);
      return left.concat(' ');
    });
}

function content(parser: Parser, lex: UsfmLexer, bp: number, type: string) {
  parser
    .builder()
    .nud(type, bp, (t, bp) => parser.parse(bp))
    .led(type, bp, (left, t, bp) => left.concat(parser.parse(bp)));
}

function ignoreContent(parser: Parser, lex: UsfmLexer, bp: number, type: string) {
  parser
    .builder()
    .nud(type, bp, (t, bp) => {
      parser.parse(bp);
      return ' ';
    })
    .led(type, bp, (left, t, bp) => {
      parser.parse(bp);
      return left.concat(' ');
    });
}

function ignoreEnclosed(
  parser: Parser,
  lex: UsfmLexer,
  bp: number,
  opener: string,
  closer: string = `${opener}*`,
  type: string = opener,
) {
  parser
    .builder()
    .bp(closer, -1)
    .either(opener, bp, (left, t, bp) => {
      const value = parser.parse(bp);
      lex.expect(closer);
      return arrify(left).concat(' ');
    });
}

function enclosed(
  parser: Parser,
  lex: UsfmLexer,
  bp: number,
  opener: string,
  closer: string = `${opener}*`,
  type: string = opener,
) {
  parser
    .builder()
    .bp(closer, -1)
    .either(opener, bp, (left, t, bp) => {
      const value = parser.parse(bp);
      lex.expect(closer);
      return arrify(left).concat(value).concat(' ');
    });
}

export class UsfmStringify extends Parser {
  start = 0;

  constructor(lex: UsfmLexer) {
    super(lex);
    const builder = this.builder();
    builder.bp('$EOF', -1);
    builder.nud('TEXT', Number.MAX_VALUE, (t, bp) => t.match.replace(/(^(\r?\n)+|(\r?\n)+$)/g, ''));
    builder.led('TEXT', Number.MAX_VALUE, (left, t, bp) => left.concat(t.match.replace(/(^(\r?\n)+|(\r?\n)+$)/g, ' ')));

    // binding power
    // this controls operator precedence;
    // the higher the value, the tighter a token binds to the tokens that follow.
    let BP = 10;

    BP += 10;

    // \c
    // Chapter
    builder.led('c', BP, (left, t, bp) => {
      const num = parseInt(lex.expect('TEXT').match.trim());
      const id = this.start;
      this.start++;
      const content = this.parse(bp);
      return left.concat(content);
    });

    BP += 10;

    // \p
    // Paragraph
    builder.either('p', BP, (left, t, bp) => {
      const content = this.parse(bp);
      return arrify(left).concat(content);
    });

    builder.either('pm', BP, (left, t, bp) => {
      var content = this.parse(bp);
      return arrify(left).concat(content);
    });
    builder.either('pi1', BP, (left, t, bp) => {
      var content = this.parse(bp);
      return arrify(left).concat(content);
    });
    builder.either('li1', BP, (left, t, bp) => {
      var content = this.parse(bp);
      return arrify(left).concat(content);
    });

    builder.either('m', BP, (left, t, bp) => {
      var content = this.parse(bp);
      return arrify(left).concat(content);
    });
    builder.either('mi', BP, (left, t, bp) => {
      var content = this.parse(bp);
      return arrify(left).concat(content);
    });
    builder.either('q1_p', BP, (left, t, bp) => {
      var content = this.parse(bp);
      return arrify(left).concat(content);
    });

    // \nb
    // No-break Paragraph
    builder.either('nb', BP, (left, t, bp) => {
      const content = this.parse(bp);
      return arrify(left).concat(content);
    });

    BP += 10;

    // \v #
    // Verse
    builder.either('v', BP, (left, t, bp) => {
      const text = lex.peek().match;
      const num = /^\s*(\d+)\s*/.exec(text);
      lex.lexer.position += num[0].length;
      // Indexes rootID
      const id = this.start;
      this.start++;

      return arrify(left).concat(' ' + this.parse(bp));
    });

    BP += 10;

    builder.either('h', BP, (left, t, bp) => {
      const text = lex.peek().match;
      lex.lexer.position += text.length;
      const id = this.start;
      this.start++;
      return arrify(left).concat(this.parse(bp));
    });

    // \p [text]
    // Line break
    content(this, lex, BP, 'br');

    // \b
    // Blank line
    // \b
    // Blank line
    single(this, BP, 'b');

    single(this, BP, 'li2');
    single(this, BP, 'li3');
    single(this, BP, 'li4');

    // Paragraphs
    single(this, BP, 'pc');
    single(this, BP, 'pmc');
    single(this, BP, 'pmo');
    single(this, BP, 'pmr');
    single(this, BP, 'pi2');
    single(this, BP, 'pi3');

    // \q#
    // Poetic line
    single(this, BP, 'q1');
    single(this, BP, 'q2');
    single(this, BP, 'q3');
    single(this, BP, 'q4');

    // \qm#
    // Embedded text poetic line.
    content(this, lex, BP, 'qm1');
    content(this, lex, BP, 'qm2');

    // \qr
    // Right-aligned poetic line.
    content(this, lex, BP, 'qr');

    // \qc
    // Centered poetic line.
    content(this, lex, BP, 'qc');

    // \qa
    // Acrostic heading.
    ignoreContent(this, lex, 30, 'qa');

    // \qd
    // Hebrew note.
    ignoreContent(this, lex, BP, 'qd');

    ignoreValue(this, lex, BP, 'cl');
    ignoreValue(this, lex, BP, 'cp');
    ignoreValue(this, lex, BP, 'd');
    ignoreValue(this, lex, BP, 'id');
    ignoreValue(this, lex, BP, 'ide');
    ignoreValue(this, lex, BP, 'ili');
    ignoreValue(this, lex, BP, 'ili1');
    ignoreValue(this, lex, BP, 'ili2');
    ignoreValue(this, lex, BP, 'im');
    ignoreValue(this, lex, BP, 'imt1');
    ignoreValue(this, lex, BP, 'imt2');
    ignoreValue(this, lex, BP, 'ip');
    ignoreValue(this, lex, BP, 'ie');
    ignoreValue(this, lex, BP, 'iex');
    ignoreValue(this, lex, BP, 'is1');
    ignoreValue(this, lex, BP, 'ms1');
    ignoreValue(this, lex, BP, 'rem');

    // \mt#
    // Major title.
    ignoreContent(this, lex, BP, 'mt1');
    ignoreContent(this, lex, BP, 'mt2');
    ignoreContent(this, lex, BP, 'mt3');
    value(this, lex, BP, 'mr');

    // \s#
    // Section Heading
    // Given same binding power as paragraphs so they don't get wrapped in the paragraph
    ignoreValue(this, lex, 30, 's1');
    ignoreValue(this, lex, 30, 's2');

    ignoreValue(this, lex, BP, 'sp');
    ignoreValue(this, lex, BP, 'toc1');
    ignoreValue(this, lex, BP, 'toc2');
    ignoreValue(this, lex, BP, 'toc3');

    // Tables
    builder.either('tr', BP, (left, t, bp) => arrify(left).concat(''));
    builder.either('tc1', BP, (left, t, bp) => arrify(left).concat(''));
    value(this, lex, BP, 'tcr2');

    BP += 10;
    ignoreEnclosed(this, lex, BP - 1, 'f');
    enclosed(this, lex, BP, 'add');
    enclosed(this, lex, BP, 'bk');
    enclosed(this, lex, BP, 'k');
    enclosed(this, lex, BP, 'tl');
    enclosed(this, lex, BP, 'it');
    enclosed(this, lex, BP, 'ord');
    enclosed(this, lex, BP, 'sc');
    enclosed(this, lex, BP, 'bdit');

    // \qs ... \qs*
    enclosed(this, lex, BP, 'qs');

    // Quoted Text
    enclosed(this, lex, BP, 'qt');

    // \qac ... \qac*
    // Acrostic letter within a poetic line
    enclosed(this, lex, BP, 'qac');

    // \wj ... \wj*
    // Words of Jesus
    enclosed(this, lex, BP, 'wj');
    enclosed(this, lex, BP, 'w');
    ignoreEnclosed(this, lex, BP, 'x');

    // \nd ... \nd*
    // Name of God
    enclosed(this, lex, BP, 'nd');
    // \+nd ... \+nd*
    enclosed(this, lex, BP, '+nd');

    BP += 10;
    // Footnotes
    ignoreValue(this, lex, BP - 1, 'ft');
    ignoreValue(this, lex, BP, 'fl');
    ignoreEnclosed(this, lex, BP, 'fm');
    ignoreValue(this, lex, BP, 'fq');
    ignoreValue(this, lex, BP, 'fr');
    ignoreValue(this, lex, BP, 'fqa');
    ignoreEnclosed(this, lex, BP, 'fv');
    ignoreValue(this, lex, BP, 'xo');
    ignoreValue(this, lex, BP, 'xt');

    BP += 10;
    ignoreEnclosed(this, lex, BP, '+bk', '+bk*', 'bk');
    ignoreEnclosed(this, lex, BP, '+add', '+add*', 'add');
    ignoreEnclosed(this, lex, BP, '+fv', '+fv*', 'fv');
    ignoreEnclosed(this, lex, BP, '+sc', '+sc*', 'sc');
    ignoreEnclosed(this, lex, BP, '+bdit', '+bdit*', 'bdit');
    ignoreEnclosed(this, lex, BP, '+tl', '+tl*', 'tl');
    ignoreEnclosed(this, lex, BP, '+wj', '+wj*', 'wj');
  }

  format() {
    return this.parse()
                .trim()
                .replace(/([\.\,\?\!])(\S)/g, '$1 $2') // add space after punctual
                .replace(/\s+(\W)/g, "$1") // remove spaces before punctual
                .replace(/\s+/g, ' ');
  }
}
