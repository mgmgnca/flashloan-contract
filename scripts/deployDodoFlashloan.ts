import { Flashloan, Flashloan__factory } from "../typechain-types";
import { DeployDODOFlashLoanParams } from "../types";
import { deployContract } from "../utils/deployContract";

export async function deployDodoFlashloan(params: DeployDODOFlashLoanParams) {
    const Flashloan: Flashloan = await deployContract(
        Flashloan__factory,
        [],
        params.wallet
    );

    const deployed = await Flashloan.waitForDeployment();

    console.log("Contract deployed to:", deployed.target);

    return deployed;
}