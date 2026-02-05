import { LoggerService } from '@nestjs/common';

export class LoggerCustomService implements LoggerService {
  private readonly datetime = new Date().toLocaleString('vi-VN', {
    hour12: false,
  });

  log(message: string, context?: string) {
    console.log(
      `[LOG] [${this.datetime}] ${context ? context : ''} ${message}`,
    );
  }

  error(message: string, trace: string, context?: string) {
    console.error(
      `[ERROR] [${this.datetime}] ${context ? context : ''} ${message} ${trace}`,
    );
  }

  warn(message: string, context?: string) {
    console.warn(
      `[WARN] [${this.datetime}] ${context ? context : ''} ${message}`,
    );
  }

  debug(message: string, context?: string) {
    console.debug(
      `[DEBUG] [${this.datetime}] ${context ? context : ''} ${message}`,
    );
  }

  verbose(message: string, context?: string) {
    console.log(
      `[VERBOSE] [${this.datetime}] ${context ? context : ''} ${message}`,
    );
  }
}
