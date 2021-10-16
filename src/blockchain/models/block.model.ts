import * as crypto from 'crypto';

export class Block {
  private hash: string = '';
  private nonce: number = 0;

  constructor(
    public readonly previousHash: string,
    public readonly timestamp: number,
    public readonly data: any[]
  ) {}

  private async calculateHash(nonce: number) {
    const hash = this.previousHash + this.timestamp + this.data + nonce;
    return crypto.createHash('sha256').update(hash).digest('hex');
  }

  async mineBlock() {
    while (!this.hash.startsWith('0000')) {
      this.nonce++;
      this.hash = await this.calculateHash(this.nonce);
    }
  }
}
