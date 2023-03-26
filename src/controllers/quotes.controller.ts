import Quote from '../models/Quote'
import { Route, Get, Post, Body, Controller, Tags } from 'tsoa'

import { redis } from '../app'

@Route('quotes')
@Tags('Ace Attorney Quotes')
export class QuotesController extends Controller {
  @Get('/?limit={limit}&character={character}')
  public async getQuotes(): Promise<Quote[] | null> {
    console.log('Connected to Redis')

    const quotes = await redis.get<string>('quotes')

    return quotes ? JSON.parse(quotes) : null

    return null
  }
}
