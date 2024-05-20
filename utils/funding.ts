import { network, ethers } from 'hardhat';
import { FundingParams } from '../types';

export const fundErc20 = async (fundingParams: FundingParams) => {
  const { sender, tokenContract, amount, decimals, recipient } = fundingParams;

  // const signer = await ethers.getSigner(sender);
  // const add = await signer.getAddress();
  // const bal = await ethers.provider.getBalance(add);
  // // console.log("signer.getAddress()",bal);

  // // Define and parse token amount. Each token has 18 decimal places. In this example we will send 1 LINK token
  // // const FUND_AMOUNT = ethers.parseUnits(amount, decimals);

  // //   create  transaction
  // const data = tokenContract.interface.encodeFunctionData("transfer", [recipient, ethers.parseEther("0.01")] )

  // const recieptTx = await signer.sendTransaction({
  //   to: ethers.getAddress(recipient),
  //   value: ethers.parseUnits('0.001', 'ether'),
  //   data: data,
  // });

  // await recieptTx.wait();


  // //Define the data parameter
  // const data = tokenContract.interface.encodeFunctionData("transfer", [recipient, FUND_AMOUNT] )


  // // // Creating and sending the transaction object
  // // const tx = await signer.sendTransaction({
  // //   to: tokenContract,
  //   from: sender,
  //   value: ethers.parseUnits("0.000", "ether"),
  //   data: data  
  // });

  // console.log(`Mining transaction...${tx.hash}`);

  // // Waiting for the transaction to be mined
  // const receipt = await tx.wait();

  // // The transaction is now on chain!
  // console.log(`Mined in block ${receipt!.blockNumber}`);

}


export const impersonateFundERC20 = async (fundingParams: FundingParams) => {
  const impersonatedSigner = await ethers.getImpersonatedSigner(fundingParams.sender);

  await fundErc20(fundingParams)

  await ethers.getImpersonatedSigner(fundingParams.sender);
}