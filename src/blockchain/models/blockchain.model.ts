import { Block } from './block.model';

export class Blockchain {
  private readonly blockchain: Block[] = [];
  private pendingTransactions: any[] = [];

  private get latestBlock(): Block {
    return this.blockchain[this.blockchain.length - 1];
  }

  constructor() {
    this.createGenesisBlock();
  }

  /**
   * First block should be named Genesis block
   * @memberof Blockchain
   */
  async createGenesisBlock() {
    const genesisBlock = new Block('0', Date.now(), []);
    await genesisBlock.mineBlock();
    this.blockchain.push(genesisBlock);
  }
}
