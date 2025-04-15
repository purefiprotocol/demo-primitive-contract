import hre from "hardhat";

import {TransparentUpgradeableProxy__factory, PrimitiveWhitelist__factory, ProxyAdmin__factory} from "../typechain-types";


const VERIFIER = "0xA76EB19EE74b7A69D2549E92764947AdeA3be714"

const ruleID = 731;

async function main() {
    const [owner, ...others] = await hre.ethers.getSigners();
    console.log("deployer = ",owner.address);
    if(true){
        //enable this section when you need to deploy or upgrade contract
        // console.log("balance = ",await hre.ethers.provider.getBalance(owner.address));
        let proxyAddress = await deployPrimitiveContract(owner, VERIFIER);
        console.log("contract address = ",proxyAddress);
    }
    
    if(true){
        //enable this section when you need to call a contract with PureFi credentials.
        const contractAddress = "0x7064B092aD2e2DD98d830E885B7F4E8c53BA4AC4";
        const primitiveContract = PrimitiveWhitelist__factory.connect(contractAddress, hre.ethers.provider);

        const owner2 = await primitiveContract.owner();
        console.log("owner2,",owner2);

        const isWhitelisted = await primitiveContract.whitelistData("0xAcEB91bE7482897595768D573DB6b49820DaEF46");
        console.log("isWhitelisted,",isWhitelisted);
        // console.log("ruleID",await primitiveContract.ruleID());
        // const pureFiData = "0x0000000000000000000000000000000000000000000000000000000067fd0df4000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000411ea9b643806e089eae6f3d3c4e330324bd2659f97abc96da622b6104b9468772529c96372f62c19cb0203dc709bafb3918c3c9fbff49262dade76c9e33ffccd51b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000c441985b25d443098a3b3335cf00e37f00000000000000000000000000000000000000000000000000000000000693ca0000000000000000000000003a0706b882b4ad4aaf3a5c2d26888e41bc8895970000000000000000000000000b02e1dfdf9c222b8f4ee207bd656d5612f0332600000000000000000000000000000000000000000000003635c9adc5dea00000";
        // const addressTo = owner2;
        // const amount = hre.ethers.parseEther("100");
        // await(await primitiveContract.connect(owner).callWithPurefi(addressTo,amount,pureFiData));
    }


    

}

async function deployPrimitiveContract(deployer: any, verifier: string) {
    if(true){
        //deploy
        const implementation = await hre.ethers.deployContract("PrimitiveWhitelist", {
            signer: deployer
        });
        await implementation.waitForDeployment();
        console.log(`[impl] PrimitiveWhitelist deployed to ${implementation.target.toString()}`);
        const calldata = PrimitiveWhitelist__factory.createInterface().encodeFunctionData("initialize", [verifier, ruleID]);
        console.log(`[calldata] ${calldata}`);
        const proxy = await hre.ethers.deployContract("TransparentUpgradeableProxy", [implementation.target.toString(), deployer.address, calldata], {
            signer: deployer
        });
        let proxData = await proxy.waitForDeployment();
        return proxData.target.toString();
    }
    else {
        //upgrade
        const contractAddress = "0xD9AbC9c120a2672ad9f8AF03f0A87b67AB04b70B";

        const proxyAdminSlot = await hre.ethers.provider.getStorage(contractAddress,"0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103");
        const proxyAdminAddress = hre.ethers.AbiCoder.defaultAbiCoder().decode(["address"], proxyAdminSlot);
        const proxyAdmin = ProxyAdmin__factory.connect(proxyAdminAddress[0], hre.ethers.provider);

        const implementation = await hre.ethers.deployContract("PrimitiveWhitelist", {
            signer: deployer
        });
        await implementation.waitForDeployment();

        const implementationAddress = implementation.target.toString();
        console.log("implementationAddress",implementationAddress);

        await proxyAdmin.connect(deployer).upgradeAndCall(contractAddress,implementationAddress,"0x");
        console.log("upgraded");
        return contractAddress;
    }
}
main().catch(e => {
    console.log(e);
    process.exitCode = 1;
});