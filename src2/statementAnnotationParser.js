// @flow strict
/*::
import type { AcornConfig } from 'acorn';
*/

const { Parser, nonASCIIwhitespace, tokTypes: { _const, _var } } = require('acorn');
/*::
type EstreeProgramWithComments = {
  ...EstreeProgram,
  commentElementMap: Map<EstreeStatement, string[]>,
  pendingComments: string[],
};
*/

/*
# Parser With Statement Annotations
An extenions of a Acornjs parser, that includes information in comments that are
placed above statements, which is called an 'annotation'.

Trailing comments that do not preceed a statement before the end of the file
poulate the 'pending comments' property.
*/

const enhanceWithStatementAnnotations = (parser/*: typeof Parser*/) => {
  class ParserWithStatementAnnotations extends parser {
    pendingComments = [];
    commentElementMap/*: Map<EstreeStatement, Array<string>>*/ = new Map();
    skipBlockComment() {
      const commentStart = this.pos;
      super.skipBlockComment();
      const commentEnd = this.pos;
      
      const commentContent = this.input.slice(commentStart + 2, commentEnd - 2);
      this.pendingComments.push(commentContent);
    }
    skipLineComment(count/*:: ?: number*/) {
      const commentStart = this.pos;
      super.skipLineComment(count);
      const commentEnd = this.pos;
      
      const commentContent = this.input.slice(commentStart + 2, commentEnd);
      this.pendingComments.push(commentContent);
    }
    parseStatement(context/*: {}*/, topLevel/*: EstreeProgram*/, exports/*: {}*/) {
      const commentsForThisNode = this.pendingComments;
      this.pendingComments = [];
      const node = super.parseStatement(context, topLevel, exports);
      this.commentElementMap.set(node, commentsForThisNode);
      return node;
    }
    parseTopLevel(node/*: EstreeStatement*/)/*: EstreeProgramWithComments*/ {
      const programNode = super.parseTopLevel(node);
      const programNodeWithAnnotations = {
        ...programNode,
        pendingComments: this.pendingComments,
        commentElementMap: this.commentElementMap,
      };
      return programNodeWithAnnotations;
    }
    parseWithComments()/*: EstreeProgramWithComments*/ {
      this.pendingComments = [];
      this.commentElementMap = new Map();

      const programNode = super.parse();
    
      const programNodeWithAnnotations = {
        ...programNode,
        pendingComments: this.pendingComments,
        commentElementMap: this.commentElementMap,
      };
      return programNodeWithAnnotations;
    }

    constructor(options/*:: ?: AcornConfig*/, input/*: string*/)/*: ParserWithStatementAnnotations*/ {
      super(options, input);
      return this;
    }
    static parse(input/*: string*/, options/*:: ?: AcornConfig*/)/*: EstreeProgramWithComments*/ {
      const instance = new ParserWithStatementAnnotations(options, input);
      const node = instance.parseWithComments();
      return node;
    }
  }

  return ParserWithStatementAnnotations;
};

const ParserWithStatementAnnotations = enhanceWithStatementAnnotations(Parser);

module.exports = {
  ParserWithStatementAnnotations,
  enhanceWithStatementAnnotations,
};