import hh from 'hardhat'
import { ethers } from "ethers"
import { Flashloan } from "../typechain-types";

export const deployContract = async (
  factoryType: any,
  args: Array<any> = [],
  wallet: ethers.Wallet | any
) : Promise<Flashloan> => {

  const factory = new hh.ethers.ContractFactory(
    factoryType.abi,
    factoryType.bytecode,
    wallet
  );

  const contract = await factory.deploy(...args);
  await contract.waitForDeployment();

  return contract as Flashloan;
}