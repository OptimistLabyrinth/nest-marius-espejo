import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class IdPoolService {
  private idPool: Set<number>;

  constructor() {
    this.idPool = new Set<number>();
  }

  getRandomInt(): number {
    let idCandidate = crypto.randomInt(281474976710655);
    let i = 10;
    while (this.idPool.has(idCandidate)) {
      idCandidate = crypto.randomInt(281474976710655);
      if (--i <= 0) throw new Error('cannot generate random integer');
    }
    this.idPool.add(idCandidate);
    return idCandidate;
  }
}
