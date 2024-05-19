import { ethers } from "ethers";
import quoter1Abi from '../abis/quoterAbi.json'
import quoter2Abi from '../abis/quoter2Abi.json'
import { QUOTER_ADDRESS, QUOTER_ADDRESS2 } from "../constants";

const provider = new ethers.JsonRpcProvider('https:/rpc.ankr.com/eth');

const tokenIn = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" // WETH
const tokenOut = "0xdac17f958d2ee523a2206206994597c13d831ec7" // USDT
const fee = 3000;
const amountIn = ethers.parseEther("1");
const sqritePriceLimitX96 = ethers.parseEther("0");

const quoter = new ethers.Contract(
    QUOTER_ADDRESS,
    quoter1Abi,
    provider
)

const quoter2 = new ethers.Contract(
    QUOTER_ADDRESS2,
    quoter2Abi,
    provider
)

const main = async () => {
    const quote1 = await quoter.quoteExactInputSingle.staticCall(
        tokenIn,
        tokenOut,
        fee,
        amountIn,
        sqritePriceLimitX96
    );

    console.log("Amount out from Qouter1", ethers.formatUnits(quote1.toString(), 6));

    const params = {
        tokenIn,
        tokenOut,
        fee,
        amountIn,
        sqritePriceLimitX96
    }
    const quote2 = await quoter2.quoteExactInputSingle.staticCall(params);

    console.log("Amount out from Qouter2", ethers.formatUnits(quote2.amountOut.toString(), 6));
    console.log('sqrtPriceX96After', quote2.sqrtPriceX96After.toString());
    console.log("gasEstimate", quote2.gasEstimate.toString());

}

main();