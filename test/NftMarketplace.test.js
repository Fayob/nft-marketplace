const { network, ethers, getNamedAccounts, deployments } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NFT Marketplace Tests", function () {
    let nftMarketplace, basicNft,deployer, player
    const PRICE = ethers.parseEther("0.1")
    const TOKEN_ID = 0;

    beforeEach(async function () {
      // deployer = (await getNamedAccounts()).deployer
      // player = (await getNamedAccounts()).player
      const accounts = await ethers.getSigners()
      deployer = accounts[0]
      player = accounts[1]
      await deployments.fixture(["all"])
      const nftMarketplaceAddress = (await deployments.get("NFTMarketplace")).address
      // const nftMarketplaceAddress = nftMarketplaceInfo.address
      nftMarketplace = await ethers.getContractAt("NFTMarketplace", nftMarketplaceAddress, deployer)
      const basicNftAddress = (await deployments.get("BasicNft")).address
      // const basicNftAddress = basicNftInfo.address
      basicNft = await ethers.getContractAt("BasicNft", basicNftAddress, deployer)
      await basicNft.mintNft()
      await basicNft.approve(nftMarketplace, TOKEN_ID)
    })

    it("lists and can be bought", async function () {
      await nftMarketplace.listItem(basicNft, TOKEN_ID, PRICE);
      const playerConnectedNftMarketplace = nftMarketplace.connect(player)
      playerConnectedNftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: PRICE })
      const newOwner = await basicNft.ownerOf(TOKEN_ID)
      const deployerProceeds = await nftMarketplace.getProceeds(deployer)
      console.log(newOwner.toString(), player.address);
      console.log(deployerProceeds.toString(), PRICE.toString());
      
      // assert.equal(newOwner.toString(), player.address)
      assert.equal(deployerProceeds.toString(), PRICE.toString())
    })
  });
