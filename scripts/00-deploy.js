const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying smart contract...");

  const Medical = await ethers.getContractFactory("MedicalRecord");
  const account = await ethers.getSigners();

  const medical = await Medical.connect(account[0]).deploy();
  await medical.deploymentTransaction().wait();

  console.log(
    `medical is deployed in address ${(await medical.getAddress()).toString()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
