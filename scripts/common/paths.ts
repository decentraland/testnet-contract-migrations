import path from "path";

export const rootDir = path.resolve(__dirname, "../..");
export const prepareDownloadsDir = path.join(rootDir, "scripts/prepare/downloads");
export const sourceCodesDir = path.join(prepareDownloadsDir, "source");
export const creationCodesDir = path.join(prepareDownloadsDir, "creation");
