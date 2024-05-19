import { ethers, Contract } from 'ethers';

export type FlashLoanParams = {
    flashLoanContractAddress: string;
    singer: any;
    flashLoanPool: string;
    loanAmount: bigint;
    loanAmountDecimals: number;
    hops: Hop[],
    gasLimit: number,
    gasPrice: bigint
}


export type Hop = {
    protocol: number,
    data: string,
    path: string[],
}

export type Protocol = {

}

export type DeployDODOFlashLoanParams = {
    // providerUrl: string;
    wallet: ethers.Wallet | ethers.JsonRpcSigner
}

export type IToken = {
    symbol: string;
    name: string;
    decimals: number;
    address: string;
    logoURI: string;
}


export type FundingParams = {
    tokenContract: Contract,
    sender: string,
    recipient: string,
    amount: string,
    decimals: number 

}
export type erc20Token = { [erc20: string]: IToken };

export type RouterMap = { [protocol: string]: string};