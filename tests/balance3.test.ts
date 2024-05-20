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
        const wallet = await provider.getSigner(0);
        const Flashloan = await deployDodoFlashloan({
            wallet
        });

        const mrWhale = "0x62ac55b745f9b08f1a81dcbbe630277095cf4be1";
        const flashLoanAddress = await Flashloan.getAddress();


        // Fund ERC 20 
        const impersonatedSigner = await hh.ethers.getImpersonatedSigner(mrWhale);
        
        const signer1 = await hh.ethers.provider.getSigner(mrWhale);
        const tokenContract = new hh.ethers.Contract(ERC20Token.WETH?.address, wethAbi, impersonatedSigner);
        const tokenContract2 = new hh.ethers.Contract(ERC20Token.WETH?.address, wethAbi, provider);

        const amount = ethers.parseUnits("1.0", 18);
        await tokenContract.connect(impersonatedSigner)
        await tokenContract.transfer(flashLoanAddress, amount);
        // const tx2 = await impersonatedSigner.sendTransaction({
        //     to: flashLoanAddress,
        //     value: amount,
        // });
        // const hash2 = await tx2.wait();

        // await hh.ethers.getImpersonatedSigner(mrWhale);

            
        const afterWethBal = await tokenContract2.balanceOf(flashLoanAddress);
        console.log("after weth bal:", afterWethBal.toString());



        ////////////////////////////////////////////////////////
        const params: FlashLoanParams = {
            flashLoanContractAddress: flashLoanAddress,
            flashLoanPool: dodoV2Pool.WETH_USDC,
            loanAmount: ethers.parseUnits("1", 18),
            loanAmountDecimals: 18,
            hops: [
                {
                    protocol: Protocols.UNISWAP_V2,
                    data: ethers.AbiCoder.defaultAbiCoder().encode(
                        ["address"],
                        [findRouterFromProtocol(Protocols.UNISWAP_V2)]
                    ),
                    path: [ ERC20Token.WETH?.address, ERC20Token.USDC?.address]
                },
                {
                    protocol: Protocols.SUSHISWAP,
                    data: ethers.AbiCoder.defaultAbiCoder().encode(
                        ["address"],
                        [findRouterFromProtocol(Protocols.UNISWAP_V2)]
                    ),
                    path: [ ERC20Token.USDC?.address, ERC20Token.WETH?.address]
                }
            ],
            gasLimit: 3_000_000,
            gasPrice: ethers.parseUnits("300", "gwei"),
            singer: wallet,
        }

        const tx = await executeFlashloan(params);
        console.log("Tx hash", tx.hash);
   
    })
})