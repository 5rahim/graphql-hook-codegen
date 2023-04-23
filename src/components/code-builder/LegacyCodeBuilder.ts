export default {}

// import _ from 'lodash'
// import { js_beautify } from 'js-beautify'
//
// type FunctionParam = { name: string, type: string, optional?: boolean }
//
// export interface CodeBlock {
//    stringOutput(): string
// }
//
// export abstract class CodeContainer {
//
//    private blocks: CodeBlock[] = []
//
//    constructor() {}
//
//    public addBlock(block: CodeBlock) {
//       this.blocks.push(block)
//       return this
//    }
//
//    getStringOutput(): string {
//       return js_beautify(this.blocks.map(b => b.stringOutput()).toString())
//    }
//
// }
//
// /**
//  * Code Builder
//  */
// export class LegacyCodeBuilder extends CodeContainer {
//
//
//    constructor() {
//       super()
//    }
//
//    public addHighLevelFunction(name: string, params?: FunctionParam[]) {
//       return new HighLevelFunction(name, params)
//    }
//
// }
//
// export class HighLevelFunction extends CodeContainer implements CodeBlock {
//
//    name: string = ''
//    params: FunctionParam[] = []
//
//    constructor(name: string, params?: FunctionParam[]) {
//       super()
//       this.name = name
//       this.params = params ?? []
//    }
//
//    public formattedParams() {
//       return _.sortBy(this.params, 'optional').map(param => `${param.name}${param.optional ? '?' : ''}: ${param.type}`)
//    }
//
//    public stringOutput() {
//       return `
// export const ${this.name} = (${this.formattedParams()}) => {
//    ${this.getStringOutput()}
// }
//       `
//    }
//
// }
//
