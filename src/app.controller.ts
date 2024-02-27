import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Logger } from '@nestjs/common';

/**
 * AppController handles incoming requests to perform CRUD operations
 * on Redis and other app-specific functionalities.
 */
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  private logger = new Logger('AppController');

  /**
   * Stores a value in Redis under a specified key.
   *
   * @param {string} key - The key under which the value is stored.
   * @param {string} value - The value to store.
   * @returns {Promise<string>} A promise that resolves with a success message.
   */
  @Post('set/:key')
  async setKey(@Param('key') key: string, @Body() value: string) {
    try {
      await this.redisService.set(key, value);
      return 'Data stored in Redis!';
    } catch (error) {
      this.logger.error(`Failed to set value for key ${key}`, error.stack);
    }
  }

  /**
   * Retrieves a value from Redis by its key.
   *
   * @param {string} key - The key of the value to retrieve.
   * @returns {Promise<string>} A promise that resolves with the retrieved value or a not found message.
   */
  @Get('get/:key')
  async getKey(@Param('key') key: string) {
    try {
      const value = await this.redisService.get(key);
      if (!value) {
        return 'Key not found';
      }
      return value;
    } catch (error) {
      this.logger.error(`Failed to retrieve value for key ${key}`, error.stack);
    }
  }

  /**
   * Fetches the last stored crypto rates from Redis, applying rate limiting.
   *
   * @returns {Promise<any>} A promise that resolves with the last crypto rates or a no data available message.
   */
  @Get('last')
  @UseGuards(ThrottlerGuard)
  async getLastCryptoRates() {
    try {
      this.logger.log('Fetching last crypto rates from redis');
      const lastRates = await this.redisService.get('crypto_rates');
      if (!lastRates) {
        return { message: 'No data available' };
      }
      return lastRates;
    } catch (error) {
      this.logger.error('Failed to fetch last crypto rates', error.stack);
    }
  }
}
