import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const timeRequest = new Date().toISOString();
    let responseBody: any;

    const originalSend = res.send;
    const originalJson = res.json;

    res.send = function (body: any) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    res.json = function (body: any) {
      responseBody = body;
      return originalJson.call(this, body);
    };

    // Log khi response được gửi đi
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const infoLogger = {
        method: req.method,
        url: req.originalUrl,
        requestBody: req.body,
        time: timeRequest,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        responseTime: `${responseTime}ms`,
        responseBody: responseBody,
      };
      // console.info('Response:\n' + JSON.stringify(infoLogger, null, 2));
    });

    next();
  }
}
