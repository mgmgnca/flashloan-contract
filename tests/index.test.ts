import { ethers } from 'ethers';
import hh from 'hardhat'
import { deployDodoFlashloan } from '../scripts/deployDodoFlashloan';
import { FlashLoanParams } from '../types';
import { Protocols, dodoV2Pool } from '../constants';
import { findRouterFromProtocol } from '../utils/findRouterByProtocol';
import { ERC20Token } from '../constants/tokens';
import { executeFlashloan } from '../scripts/executeFlashloan';
import wethAbi from '../abis/wethAbi.json';

import { impersonateFundERC20 } from '../utils/funding';
import { expect } from 'chai';

  
describe("DODO Flashloan", () => {
    it("Execute flashloan", async () => {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
        // const privateKey = provider.getSigner(0);//process.env.PRIVATE_KEY;

        // const wallet = new ethers.Wallet(privateKey!, provider);
        const wallet = await provider.getSigner(0);
        const Flashloan = await deployDodoFlashloan({
            wallet
        });

        const tokenContract = new ethers.Contract(ERC20Token.WETH?.address, wethAbi, provider);
        // // export const WETH_WHALE = "0x0298B2eCdef68BC139B098461217a5B3161B69C8";

        const mrWhale = "0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8";
        const whalebal = await tokenContract.balanceOf(mrWhale);
        console.log('whalebal', whalebal);
        const flashLoanAddress = await Flashloan.getAddress();
        // console.log('flashLoanAddress:', flashLoanAddress);
        // // // tokenContract.connect('').transfer
        // await impersonateFundERC20({
        //     sender: mrWhale,
        //     tokenContract,
        //     recipient: flashLoanAddress,
        //     decimals: 18,
        //     amount: "1"
        // });
        await hh.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [mrWhale],
        });
        
          // fund baseToken to the contract
          // await fundErc20(fundingParams);
          let bal = await hh.ethers.provider.getBalance(mrWhale)
        
          console.log("acc0 bal:", bal.toString());
        
        
          const signer = await hh.ethers.getSigner(mrWhale)
          await signer.sendTransaction({
            to: flashLoanAddress,
            value: "1", // Sends exactly 1.0 ether,
            gasLimit: 30000000,
          })
          const balance = await tokenContract.balanceOf(flashLoanAddress);
          console.log('FlashLoan Balance', balance);
  
          await hh.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [mrWhale],
          });
        
        
        const balancef = await tokenContract.balanceOf(flashLoanAddress);
        console.log('FlashLoan Balance', balancef);
        // let bal2 = await provider.getBalance(flashLoanAddress)

        // console.log("acc0 bal2:", bal2.toString());

        // expect(await tokenContract.balanceOf(flashLoanAddress)).to.equal(ethers.parseEther('1'));




        // const params: FlashLoanParams = {
        //     flashLoanContractAddress: Flashloan.target.toString(),
        //     flashLoanPool: dodoV2Pool.WETH_USDC,
        //     loanAmount: ethers.parseEther("0.01"),
        //     loanAmountDecimals: 18,
        //     hops: [
        //         {
        //             protocol: Protocols.UNISWAP_V2,
        //             data: ethers.AbiCoder.defaultAbiCoder().encode(
        //                 ["address"],
        //                 [findRouterFromProtocol(Protocols.UNISWAP_V2)]
        //             ),
        //             path: [ ERC20Token.WETH?.address, ERC20Token.USDC?.address]
        //         },
        //         {
        //             protocol: Protocols.SUSHISWAP,
        //             data: ethers.AbiCoder.defaultAbiCoder().encode(
        //                 ["address"],
        //                 [findRouterFromProtocol(Protocols.UNISWAP_V2)]
        //             ),
        //             path: [ ERC20Token.USDC?.address, ERC20Token.WETH?.address]
        //         }
        //     ],
        //     gasLimit: 3_000_000,
        //     gasPrice: ethers.parseUnits("300", "gwei"),
        //     singer: wallet,
        // }

        // const tx = await executeFlashloan(params);
        // console.log("Tx hash", tx.hash);
    })
})