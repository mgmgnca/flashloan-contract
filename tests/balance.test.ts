import { ethers } from 'ethers';
import hh from 'hardhat'
import { deployDodoFlashloan } from '../scripts/deployDodoFlashloan';
import { FlashLoanParams } from '../types';
import { Protocols, dodoV2Pool } from '../constants';
import { findRouterFromProtocol } from '../utils/findRouterByProtocol';
import { ERC20Token } from '../constants/tokens';
import { executeFlashloan } from '../scripts/executeFlashloan';
import wethAbi from '../abis/wethAbi.json';
import usdcAbi from '../abis/usdcAbi.json';

import { impersonateFundERC20 } from '../utils/funding';
import { expect } from 'chai';

  
describe("DODO Flashloan", () => {
    it("Execute flashloan", async () => {
        const provider = new hh.ethers.JsonRpcProvider("http://127.0.0.1:8545/");
        // const privateKey = provider.getSigner(0);//process.env.PRIVATE_KEY;

        // const wallet = new ethers.Wallet(privateKey!, provider);
        const wallet = await provider.getSigner(0);
        const Flashloan = await deployDodoFlashloan({
            wallet
        });

        const tokenContract = new hh.ethers.Contract(ERC20Token.WETH?.address, wethAbi, provider);
        // // export const WETH_WHALE = "0x0298B2eCdef68BC139B098461217a5B3161B69C8";

        // const mrWhale = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
        const mrWhale = "0x62ac55b745f9b08f1a81dcbbe630277095cf4be1";
        const flashLoanAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" //await Flashloan.getAddress();

        // const bal = await provider.getBalance(mrWhale);
        // console.log("signer.getAddress()",b,",",bal);
      

        // await impersonateFundERC20({
        //   sender: mrWhale,
        //   tokenContract,
        //   recipient: flashLoanAddress,
        //   decimals: 18,
        //   amount: "1.0"
        // });
        // const c = await tokenContract.balanceOf(flashLoanAddress);
        // console.log('b', c)
        // const balc = await provider.getBalance(flashLoanAddress);
        // console.log("signer.getAddress()",balc);

        // // let bal2 = await provider.getBalance(flashLoanAddress)

        // // console.log("acc0 bal2:", bal2.toString());

        // // expect(await tokenContract.balanceOf(flashLoanAddress)).to.equal(ethers.parseEther('1'));




        const add1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        const add2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
        const beforeBal = await hh.ethers.provider.getBalance(add2);
        console.log("before bal:", beforeBal.toString());

        //888888888888888888888888888
        // await hh.network.provider.request({
        //     method: "hardhat_impersonateAccount",
        //     params: [mrWhale],
        //   });
      
          const signer = await hh.ethers.provider.getSigner(add1);
        
          const tx = await signer.sendTransaction({
            to: add2,
            value: ethers.parseEther("200"),
          });
          
          const hash = await tx.wait();

          const afterBal = await hh.ethers.provider.getBalance(add2);
          console.log("after bal:", afterBal.toString());
            
        // await hh.network.provider.request({
        //     method: "hardhat_stopImpersonatingAccount",
        //     params: [mrWhale],
        // });
        // const b = await tokenContract.balanceOf(flashLoanAddress);
        // const c = await provider.getBalance(flashLoanAddress);
        // console.log('b', b);
        // console.log('c', c);






    })
})