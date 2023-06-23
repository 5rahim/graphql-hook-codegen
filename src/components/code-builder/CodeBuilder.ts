import { js_beautify } from "js-beautify"
import _ from "lodash"

export interface CodeBlock {
   getStringOutput: () => string
}

export interface CodeContainer extends CodeBlock {
   blocks: CodeBlock[]
   addBlock: (block: CodeBlock) => CodeContainer
}

/**
 * High level component
 */

export interface WrapperFunctionBlockReturn extends CodeContainer {
   addBlock: (block: CodeBlock) => CodeContainer
}

export type WrapperFunctionBlock = (name: string, params?: { name: string, type: string, optional?: boolean }[], options?: {
   exported: boolean
}) => WrapperFunctionBlockReturn

export const WrapperFunctionBlock: WrapperFunctionBlock = (name, params, options = { exported: false }) => {
   let blocks: CodeBlock[] = []
   const formattedParams = _.sortBy(params, 'optional').map(param => `${param.name}${param.optional ? '?' : ''}: ${param.type}`)
   return {
      blocks,

      addBlock(block: CodeBlock) {
         blocks.push(block)
         return this
      },

      getStringOutput() {
         return `
${options.exported ? 'export ' : ''}const ${name} = (${formattedParams}) => {
   ${blocks.map(block => block.getStringOutput()).join(' ')}
};
      `
      },
   }
}

export const LineBlock = (content: string): CodeBlock => {
   return {
      getStringOutput() {
         return content === '' ? '\n\n' : `${content}${!(content.endsWith('{') || content.endsWith(',')) ? ';' : ''}`
      },
   }
}
export const RawLineBlock = (content: string): CodeBlock => {
   return {
      getStringOutput() {
         return content === '' ? '\n' : `${content}\n`
      },
   }
}

/**
 * Code Builder
 */

export interface CodeBuilder extends CodeContainer {
   wipe(): CodeBuilder

   startIf(cond: boolean): CodeBuilder

   endIf(): CodeBuilder

   whenCondition: boolean,
   addBlock: (block: CodeBlock) => CodeBuilder
   line: (value: string) => CodeBuilder
   rawLine: (value: string) => CodeBuilder
   addImport: (value: string) => CodeBuilder
   space: () => CodeBuilder
}

export const CodeBuilder: CodeBuilder = {

   blocks: [],

   whenCondition: true,

   wipe() {
      this.blocks = []
      return this
   },

   startIf(cond: boolean) {
      this.whenCondition = cond
      return this
   },

   endIf() {
      this.whenCondition = true
      return this
   },

   addBlock(block: CodeBlock) {
      if (this.whenCondition) {
         this.blocks.push(block)
      }
      return this
   },

   line(content: string) {
      if (this.whenCondition) {
         this.blocks.push(LineBlock(content))
      }
      return this
   },

   rawLine(content: string) {
      if (this.whenCondition) {
         this.blocks.push(RawLineBlock(content))
      }
      return this
   },

   space() {
      if (this.whenCondition) {
         this.blocks.push(LineBlock(''))
      }
      return this
   },

   addImport(content: string) {
      if (this.whenCondition) {
         this.blocks = [LineBlock(content), ...this.blocks]
      }
      return this
   },

   getStringOutput() {
      return js_beautify(this.blocks.map(block => block.getStringOutput()).join(" "), {
         brace_style: "preserve-inline", indent_with_tabs: true, indent_char: "   ",
      })
   },

}
