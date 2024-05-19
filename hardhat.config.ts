import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.6.12",
      },
      {
        version: "0.8.19",
      },
      {
        version: "0.8.20",
      },
    ]
  },
  networks: {
    hardhat: {
      forking: {
        url: 'https://polygon-mainnet.g.alchemy.com/v2/EBtkjz43U_zCbSqCAPteyKYTNSfoVnBu'
        // polygon
        // url: 'https://rpc.ankr.com/polygon',
        // blockNumber: 28583600,

        // bsc
        // url: process.env.BSC_RPC_URL,
        // blockNumber: 17988430,
      },
    },
    localhost: {
      url: 'http://localhost:8545',
    },
    polygon: {
      url: "https://rpc.ankr.com/polygon",
    }
  }
};

export default config;
