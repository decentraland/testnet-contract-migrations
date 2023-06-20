import hre, { ethers } from "hardhat";
import { mkdir, writeFile, readFile, rm } from "fs/promises";
import { addresses } from "./constants";

const { ETHERSCAN_API_KEY, FROM_NETWORK } = process.env;

const pragmaVersions: string[] = []; // To change hardhat.config.ts solidity compilers versions

type EtherscanResult = {
  ContractName: string;
  SourceCode: string;
  ABI: string;
  ConstructorArguments: string;
};

function getConstructorArgs({
  ABI: abi,
  ConstructorArguments: constructorArguments,
}: Pick<EtherscanResult, "ABI" | "ConstructorArguments">) {
  const parsedABI: { type: string; inputs: any[] }[] = JSON.parse(abi);
  const constructor = parsedABI.find(
    ({ type }: { type: string }) => type === "constructor"
  );

  if (constructor) {
    const { inputs } = constructor;
    console.log(
      "Trying to decode the constructor arguments with the following inputs...",
      inputs
    );
    const args = ethers.utils.defaultAbiCoder.decode(
      inputs,
      `0x${constructorArguments}`
    );

    return (
      args.length && inputs.map((input, i) => ({ ...input, value: args[i] }))
    );
  }
}

async function getContract(address: string) {
  const etherscan = new ethers.providers.EtherscanProvider(
    FROM_NETWORK,
    ETHERSCAN_API_KEY
  );

  const [
    { ContractName: contractName, SourceCode: sourceCode, ...options },
  ]: EtherscanResult[] = await etherscan.fetch("contract", {
    action: "getsourcecode",
    address,
  });

  if (sourceCode.indexOf('"sources":') !== -1) {
    const sources = JSON.parse(sourceCode.slice(1, -1)).sources;
    const contractFiles: string[] = [];

    await Promise.all(
      Object.keys(sources).map(async (source) => {
        const path = source.slice(0, source.lastIndexOf("/"));
        const dirPath = `./contracts/${contractName}/${path}`;

        await mkdir(dirPath, {
          recursive: true,
        });

        const sourceName = source
          .slice(source.lastIndexOf("/") + 1)
          .replace(/^\d+_/, "");
        const content: string = sources[source].content;

        const distanceToContractRoot = path.split("/").length; // The number of slashes in the path plus the one added in the dirPath (length - 1) + 1
        const pathToContractRoot = Array(distanceToContractRoot)
          .fill("..")
          .join("/");

        // Replace imports to external libs with local imports
        const contextWithLocalImports = content.replace(
          /import\s+["']([^./].*)["'];/g,
          `import "${pathToContractRoot}/$1";`
        );
        await writeFile(`${dirPath}/${sourceName}`, contextWithLocalImports);

        contractFiles.push(`${dirPath}/${sourceName}`);

        // Take the pragma version from the first files
        const pragmaVersion = content.match(
          /pragma solidity \^?(\d+\.\d+\.\d+);/
        )?.[1];
        if (pragmaVersion) pragmaVersions.push(pragmaVersion);

        console.log(
          `The file ${sourceName} was saved under the dir '${dirPath}'.`
        );
      })
    );

    // try {
    //   console.log(`About to flatten the contract ${contractName}...`);
    //   await hre.run("flatten", {
    //     files: contractFiles,
    //     output: `contracts/${contractName}.sol`,
    //   });
    //   console.log(`The contract ${contractName} was flattened!`);
    // } catch (error) {
    //   console.error(`Failure when flattening ${contractName}`, error);
    // }
  } else if (sourceCode.indexOf('.sol":{"content":') !== -1) {
    console.warn("Case that I couldn't reproduce yet");
    JSON.parse(sourceCode);
  } else {
    await writeFile(`./contracts/${contractName}.sol`, sourceCode);
  }

  console.log(`The contract ${contractName} was saved!`);

  await createDeployScript(contractName, options);
}

async function createDeployScript(
  contractName: string,
  options: Pick<EtherscanResult, "ABI" | "ConstructorArguments">
) {
  // Check if already exists
  try {
    await readFile(`./scripts/deploy${contractName}.ts`, "utf-8");
    console.log(
      `The deploy script for the ${contractName} already exists. Skipping...`
    );
    return;
  } catch (error) {
    console.log(`Creating the deploy script for the ${contractName}...`);
    const deployTemplate = await readFile("./templates/deploy.ts", "utf-8");
    const constructorArgs = getConstructorArgs(options);

    const deployScript = deployTemplate
      .replaceAll("CONTRACT_NAME", contractName)
      // Replace the constructor arguments comment with the actual arguments
      .replace(
        "// CONSTRUCTOR_ARGUMENTS",
        constructorArgs
          ? `// Constructor args: ${JSON.stringify(constructorArgs)}`
          : ""
      );

    await writeFile(`./scripts/deploy${contractName}.ts`, deployScript);
    console.log(
      `Deploy script created for the ${contractName} as './scripts/deploy${contractName}.ts'!`
    );
  }
}

async function updatePragmaVersions() {
  const hardhatConfig = await readFile("./hardhat.config.ts", "utf-8");

  const compilers = Array.from(new Set(pragmaVersions))
    .sort()
    .map((version) => ({
      version,
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    }));

  await writeFile(
    "./hardhat.config.ts",
    hardhatConfig.replace(
      /compilers: \[.*\]/,
      `compilers: ${JSON.stringify(compilers, null, 2)}`
    )
  );
}

async function main() {
  // try {
  //   await mkdir("./tmp", {
  //     recursive: true,
  //   });
  // } catch (error) {
  //   console.log(error);
  // }

  await Promise.all(addresses.map(getContract));

  await updatePragmaVersions();

  // await rm("./tmp", {
  //   recursive: true,
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
