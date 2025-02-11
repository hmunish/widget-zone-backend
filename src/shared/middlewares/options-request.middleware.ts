import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cors from 'cors';

@Injectable()
export class OptionsRequestMiddleware implements NestMiddleware {
  private readonly corsHandler = cors();

  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      if (
        req.path.match(/^\/users\/widgets\/[^/]+\/subscribers$/) ||
        req.path.match(/^\/users\/widgets\/[^/]+\/tickets$/)
      ) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
          'Access-Control-Allow-Methods',
          'GET, POST, PUT, DELETE, OPTIONS',
        );
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization',
        );
        return res.status(204).send();
      } else {
        this.corsHandler(req, res, next);
      }
    } else {
      next();
    }
  }
}
