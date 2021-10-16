import { Transaction } from '../interfaces/transaction.interface';
import { Block } from './block.model';

export class Blockchain {
  private readonly _blockchain: Block[] = [];
  private _pendingTransactions: Transaction[] = [];

  private get latestBlock(): Block {
    return this._blockchain[this._blockchain.length - 1];
  }

  get chain(): Block[] {
    return [...this._blockchain];
  }

  get pendingTransactions(): Transaction[] {
    return [...this._pendingTransactions];
  }

  constructor() {}

  /**
   * First block should be named Genesis block
   * @memberof Blockchain
   */
  async createGenesisBlock(): Promise<void> {
    const genesisBlock = new Block('0', Date.now(), []);
    await genesisBlock.mineBlock();

    this._blockchain.push(genesisBlock);
  }

  createTransaction(transaction: Transaction): void {
    this._pendingTransactions.push(transaction);
  }

  async minePendingTransactions(): Promise<void> {
    const block = new Block(this.latestBlock.hash, Date.now(), this._pendingTransactions);

    await block.mineBlock();

    this._blockchain.push(block);
    this._pendingTransactions = [];
  }
}
