export const Protocols = {
    UNISWAP_V3: 0,
    UNISWAP_V2: 1,
    SUSHISWAP: 2,
    QUICKSWAP: 3,
    JETSWAP: 4,
    POLYCAT: 5,
    APESWAP: 6,
    WAULTSWAP: 7,
    DODO: 9
  }
  
  export type RouterMap = { [protocol: string]: string };
  
  export const Routers: RouterMap = {
    POLYGON_UNISWAP_V3: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    POLYGON_SUSHISWAP: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    POLYGON_QUICKSWAP: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    POLYGON_JETSWAP: "0x5C6EC38fb0e2609672BDf628B1fD605A523E5923",
    POLYGON_POLYCAT: "0x94930a328162957FF1dd48900aF67B5439336cBD",
    POLYGON_APESWAP: "0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607",
    POLYGON_WAULTSWAP: "0x3a1D87f206D12415f5b0A33E786967680AAb4f6d",
  };
  
  export type PoolMap = { [pair: string]: string };
  
  // https://info.dodoex.io/all
  export const dodoV2Pool: PoolMap = {
    WETH_USDC: "0x5333Eb1E32522F1893B7C9feA3c263807A02d561",// "0x4b543e89351faa242cb0172b2da0cdb52db699b4", //"0x5333Eb1E32522F1893B7C9feA3c263807A02d561",
    WMATIC_USDC: "0x1093ced81987bf532c2b7907b2a8525cd0c17295",//"0x10Dd6d8A29D489BEDE472CC1b22dc695c144c5c7",
    WMATIC_WETH: "0x80db8525F61e8C3688DBb7fFa9ABcae05Ae8a90A",
    WBTC_USDC: "0x3d9d58cf6b1dd8be3033ce8865f155fac16186cc",//"0xe020008465cD72301A18b97d33D73bF44858A4b7",
  };
  
  
  // Uniswap V3: Quoter https://etherscan.io/address/0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6
  export const QUOTER_ADDRESS = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
  // Uniswap: Quoter V2 https://etherscan.io/address/0x61ffe014ba17989e743c5f6cb21bf9697530b21e
  export const QUOTER_ADDRESS2 = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"