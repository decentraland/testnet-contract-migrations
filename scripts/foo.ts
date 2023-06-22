import {
  Abi,
  createClient,
  createPublicClient,
  createTestClient,
  createWalletClient,
  custom,
  getContract,
  http,
  parseAbi,
  parseGwei,
} from "viem";
import { mainnet, localhost } from "viem/chains";
import fetch, { Headers, Request, Response } from "node-fetch";
import fs from "fs";
import path from "path";
import { outputPath } from "./utils/paths";
import ganache, { EthereumProvider } from "ganache";

async function main() {
  // @ts-ignore
  globalThis.fetch = fetch;
  // @ts-ignore
  globalThis.Headers = Headers;
  // @ts-ignore
  globalThis.Request = Request;
  // @ts-ignore
  globalThis.Response = Response;

  const server = ganache.server();

  const provider = await new Promise<EthereumProvider>((resolve, reject) => {
    server.listen(8545, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(server.provider);
    });
  });

  const files = fs.readdirSync(path.join(outputPath, "getContractCreationDataFromEtherscan"));

  for (const file of [files.find((file) => file.includes("MANAToken"))!]) {
    const filePath = path.join(outputPath, "getContractCreationDataFromEtherscan", file);

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))[0];

    const mainnetPublicClient = createPublicClient({
      transport: http(),
      chain: mainnet,
    });

    const originalCreationTransaction = await mainnetPublicClient.getTransaction({ hash: data.txHash });

    const walletClient = createWalletClient({
      transport: custom(provider),
    });

    const publicClient = createPublicClient({
      transport: custom(provider),
    });

    const testClient = createTestClient({
      transport: custom(provider),
      mode: "ganache",
    });

    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.sendTransaction({
      account,
      chain: localhost,
      data: originalCreationTransaction.input,
      gas: originalCreationTransaction.gas,
    });

    const newCreationTransactionReceipt = await publicClient.waitForTransactionReceipt({ hash });

    await testClient.mine({ blocks: 1 });

    // console.log(newCreationTransactionReceipt);

    await publicClient.simulateContract({
      abi: JSON.parse(
        JSON.parse(fs.readFileSync(path.join(outputPath, "getContractSourceCodeFromEtherscan", file), "utf-8"))[0].ABI
      ),
      address: newCreationTransactionReceipt.contractAddress!,
      functionName: 'balanceOf',
      args: [account]
    })

    // const contract = getContract({
    //   address: newCreationTransaction.contractAddress!,
    //   abi: JSON.parse(
    //     JSON.parse(fs.readFileSync(path.join(outputPath, "getContractSourceCodeFromEtherscan", file), "utf-8"))[0].ABI
    //   ),
    //   publicClient,
    //   walletClient,
    // });

    // console.log(contract)

    // console.log(contract);

    // console.log(contract.read);

    // console.log(transaction2);
  }

  server.close();
}

main();
