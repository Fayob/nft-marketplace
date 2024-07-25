const { ethers } = require("hardhat");

const PRICE = ethers.parseEther("0.1")

async function mintAndList() {
    const nftMarketplace = await ethers.getContractAtFromArtifact("NFTMarketplace")
    const basicNft = await ethers.getContractAtFromArtifact("BasicNft")
    console.log("Minting...");
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = mintTx.wait(1)
    console.log(mintTxReceipt);
    const tokenId = mintTxReceipt.events[0].args.tokenId;
    console.log("Approving NFT...");
    
    const approveTx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approveTx.wait(1)
    console.log("Listing NFT...");
    const tx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE)
    await tx.wait(1)
    console.log("Listed");
}