import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export const validatorAddr = (privateKey: string) => {
    try {
        const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
        return walletKeypair.publicKey.toString();
    } catch (e) {
        return ''
    }
}

export const waitFor = (delay: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, delay));
};
