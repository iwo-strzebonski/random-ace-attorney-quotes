export default class Quote {
  id: number
  character: string
  quote: string

  constructor(id: number, character: string, quote: string) {
    this.id = id
    this.character = character
    this.quote = quote
  }
}
