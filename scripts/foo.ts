import fs from "fs";
import path from "path";
import { outputPath } from "./utils/paths";
import ganache, { EthereumProvider } from "ganache";
import { ethers } from "ethers";

async function main() {
  const server = ganache.server();

  const ganacheProvider = await new Promise<EthereumProvider>((resolve, reject) => {
    server.listen(8545, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(server.provider);
    });
  });

  const fileNames = fs.readdirSync(path.join(outputPath, "getContractCreationDataFromEtherscan"));

  for (const fileName of [fileNames.find((file) => file.includes("MANAToken"))!]) {
    const file = path.join(outputPath, "getContractCreationDataFromEtherscan", fileName);

    const contractCreationData = JSON.parse(fs.readFileSync(file, "utf-8"))[0];

    const mainnetProvider = ethers.getDefaultProvider(1);

    const transaction = await mainnetProvider.getTransaction(contractCreationData.txHash);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const { data } = transaction;

    const abiPath = path.join(outputPath, "getContractAbiFromEtherscan", fileName);

    const abi = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

    const provider = new ethers.BrowserProvider(ganacheProvider);

    const [account1, _account2, _account3] = await provider.listAccounts();

    console.log(account1)

    const factory = new ethers.ContractFactory(abi, data, account1);

    const contract = await factory.deploy();

    await contract.waitForDeployment();

    

    // const walletClient = createWalletClient({
    //   transport: custom(mainnetProvider),
    // });

    // const publicClient = createPublicClient({
    //   transport: custom(mainnetProvider),
    // });

    // const testClient = createTestClient({
    //   transport: custom(mainnetProvider),
    //   mode: "ganache",
    // });

    // const [account] = await walletClient.getAddresses();

    // const hash = await walletClient.sendTransaction({
    //   account,
    //   chain: localhost,
    //   data: originalCreationTransaction.input,
    //   gas: originalCreationTransaction.gas,
    // });

    // const newCreationTransactionReceipt = await publicClient.waitForTransactionReceipt({ hash });

    // await testClient.mine({ blocks: 1 });

    // // console.log(newCreationTransactionReceipt);

    // await publicClient.simulateContract({
    //   abi: JSON.parse(
    //     JSON.parse(fs.readFileSync(path.join(outputPath, "getContractSourceCodeFromEtherscan", file), "utf-8"))[0].ABI
    //   ),
    //   address: newCreationTransactionReceipt.contractAddress!,
    //   functionName: "balanceOf",
    //   args: [account],
    // });

    // // const contract = getContract({
    // //   address: newCreationTransaction.contractAddress!,
    // //   abi: JSON.parse(
    // //     JSON.parse(fs.readFileSync(path.join(outputPath, "getContractSourceCodeFromEtherscan", file), "utf-8"))[0].ABI
    // //   ),
    // //   publicClient,
    // //   walletClient,
    // // });

    // // console.log(contract)

    // // console.log(contract);

    // // console.log(contract.read);

    // // console.log(transaction2);
  }

  server.close();
}

main();
