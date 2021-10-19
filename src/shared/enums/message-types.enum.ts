export enum MessageTypes {
  GET_LONGEST_CHAIN_REQUEST = 'GET_LONGEST_CHAIN_REQUEST', // ask to get the longest chain from the network
  GET_LONGEST_CHAIN_RESPONSE = 'GET_LONGEST_CHAIN_RESPONSE', // the longest chain response
  NEW_BLOCK_REQUEST = 'NEW_BLOCK_REQUEST', // notify everyone that you`ve started mining
  NEW_BLOCK_ANNOUNCEMENT = 'NEW_BLOCK_ANNOUNCEMENT', // notify everyone that you`ve finished mininig
}
