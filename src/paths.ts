import path from "path";

export const rootDir = path.resolve(__dirname, "..");
export const outputDir = path.resolve(rootDir, "output");
export const sourceCodesDir = path.resolve(outputDir, "sourceCodes");
export const creationDataDir = path.resolve(outputDir, "creationData");
export const creationTransactionsDir = path.resolve(outputDir, "creationTransactions");
export const creationCodesDir = path.resolve(outputDir, "creationCodes");
