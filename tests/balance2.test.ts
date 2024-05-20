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

        // // export const WETH_WHALE = "0x0298B2eCdef68BC139B098461217a5B3161B69C8";

        // const mrWhale = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
        const mrWhale = "0x62ac55b745f9b08f1a81dcbbe630277095cf4be1";
        const flashLoanAddress = await Flashloan.getAddress();

        const signer1 = await hh.ethers.provider.getSigner(mrWhale);

        const tokenContract = new hh.ethers.Contract(ERC20Token.WETH?.address, wethAbi, signer1);

        const mrWhaleWethBal = await tokenContract.balanceOf(mrWhale);
        console.log("before mrwhale weth bal:", mrWhaleWethBal.toString());

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


        const impersonatedSigner = await hh.ethers.getImpersonatedSigner(mrWhale);

        const amount = ethers.parseUnits("1.0", 18);
        const data = tokenContract.interface.encodeFunctionData("transfer", [add2, amount] )
        await tokenContract.connect(impersonatedSigner);
        await tokenContract.transfer(flashLoanAddress, amount)
        // Approve and transfer WETH
        // const tx2 = await impersonatedSigner.sendTransaction({
        //     to: add2,
        //     value: ethers.parseEther("200"),
        //     data: data
        // });
          
        // const txHash: string = (await hh.network.provider.request({
        //     method: "eth_sendTransaction",
        //     params: [{
        //         to: add2,
        //         value: ethers.parseEther("200"),
        //         data: data
        //     }],
        //   })) as string;

          
        // const hash2 = await tx2.wait();
        await hh.ethers.getImpersonatedSigner(mrWhale);


        const afterEthBal = await hh.ethers.provider.getBalance(flashLoanAddress);
        console.log("after eth bal:", afterEthBal.toString());
            
        const afterWethBal = await tokenContract.balanceOf(flashLoanAddress);
        console.log("after weth bal:", afterWethBal.toString());



    })
})