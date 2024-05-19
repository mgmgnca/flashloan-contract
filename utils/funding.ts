import { network, ethers } from 'hardhat';
import { FundingParams } from '../types';
import { Contract } from 'ethers';

export const fundErc20 = async (fundingParams: FundingParams) => {
  const { sender, tokenContract, amount, decimals, recipient } = fundingParams;
  const FUND_AMOUNT = ethers.parseUnits(amount, decimals);

  // fund erc20 token to the contract
  const MrWhale = await ethers.getSigner(sender);

  // const contractSigner = tokenContract.connect(MrWhale);
  // console.log("contractSigner:", contractSigner);
  // await contractSigner.transfer(recipient, FUND_AMOUNT);

  await MrWhale.sendTransaction({
    to: recipient,
    value: FUND_AMOUNT, // Sends exactly 1.0 ether
  });

}


export const impersonateFundERC20 = async (fundingParams: FundingParams) => {
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [fundingParams.sender],
  });

  // fund baseToken to the contract
  // await fundErc20(fundingParams);
  let bal = await ethers.provider.getBalance(fundingParams.sender)

  // console.log("acc0 bal:", bal.toString());


  const signer = await ethers.getSigner(fundingParams.sender)
  await signer.sendTransaction({
    to: fundingParams.recipient,
    value: ethers.parseEther(fundingParams.amount), // Sends exactly 1.0 ether
    gasLimit: 3_000_000
  })
  
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [fundingParams.sender],
  });

  let bal2 = await ethers.provider.getBalance(fundingParams.recipient)
        const balance = await fundingParams.tokenContract.balanceOf(fundingParams.recipient);

  console.log("acc0 bal2:", bal2.toString(),"|", balance);


}