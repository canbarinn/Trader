import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY: string = "069cfb1fc7fd2bf7172ee9694669fdc008435c1034038e14c2628c321b85b70f";
const INFURA_SEPOLIA_ENDPOINT: string = "https://eth-sepolia.g.alchemy.com/v2/X9PMG99a0meKRcgnfiH44TUWvPQslYgV"

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.7.6"
      },
      {
        version: "0.8.18"
      }
    ]
  },
  networks: {
    sepolia: {
      url: INFURA_SEPOLIA_ENDPOINT,
      accounts: [PRIVATE_KEY]
    }
  }
};


export default config;
