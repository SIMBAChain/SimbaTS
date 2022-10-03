export const baseApiUrl = "https://simba-dev-api.platform.simbachain.com/";
export const orgName = "brendan_birch_simbachain_com";
export const appName = "BrendanTestApp";
export const contractName = "test_contract_vds5";
export const mumbaiWallet = "0x59D859Da04439AE87Afd689A4CA89C354CB93532";
export const userEmail = "brendan.birch@simbachain.com";
export const bundleHash = "57f6ef0fcc97614f899af3f165cabbaec9632b95fc89906837f474a6a2c8a184";
export const solContractName = "TestContractChanged";
export const Quorum = "Quorum";
export const mumbai = "mumbai";
export const ethereum = "ethereum";
export const transactionHash = "0x2b05a28c90283011054f9299e92b80f045ff3d454f87008c8b67e767393b7d14";
export const solidity = "solidity";
export const deploymentID = "37cb8577-65bd-4669-8380-b0a3ba93e718";
export const designID = "5114c41b-c03a-4674-b348-a0cd73d2c0d6";
export const artifactID = "4b80be26-c6a3-4aa6-82d1-f94925e5da2b";
export const transactionID = "7eb73229-b1f8-4aa4-af4b-37f79c1df6bb";
export const sourceCode = "// SPDX-License-Identifier: UNLICENSED\npragma solidity ^0.8.3;\n\ncontract EventContract {\n    \n    event Log(address indexed sender, string message);\n    mapping(string => uint) public userBalances;\n\n    function addMapping(string memory userId) public {\n        userBalances[userId]++;\n        emit Log(msg.sender, \"Data reported\");\n        return;\n    }\n\n    function getBalance(string memory userId) public view returns (uint) {\n        return userBalances[userId];\n    }\n\n}"