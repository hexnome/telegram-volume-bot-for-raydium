export const commandList = [
    { command: 'start', description: 'Start the bot' },
];

import { ComputeBudgetProgram, Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { ADDITIONAL_FEE, BUY_INTERVAL_MAX, BUY_INTERVAL_MIN, BUY_LOWER_AMOUNT, BUY_UPPER_AMOUNT, CONFIRM_FEE, DISTRIBUTE_WALLET_NUM, DISTRIBUTION_AMOUNT, LAMPORTS_PER_SOL, OWNER_PUBLIC_KEY, RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT, SELL_ALL_BY_TIMES, SLIPPAGE, solanaConnection, webSite } from "../config";
import { validatorAddr } from "../utils";
import * as helper from "./helper"
import * as solanaWeb3 from "@solana/web3.js"
import { handleBot, startVolumeBot } from "../volume-bot";
import User from "../model/User";
import base58 from "bs58";

export const welcome = async (chatId: number, username?: string) => {

    const userInfo = await helper.findOfUser(chatId, username);

    console.log("------", userInfo?.publicKey)
    if (userInfo?.publicKey) {
        const publicKey: PublicKey = new PublicKey(userInfo.publicKey);
        const solAmount = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
        const title = `You are already registered in Volume Booster
    💹 Your Publickey: ${userInfo.publicKey}
    💰 Your Ballence: ${solAmount} sol`
        const content = [[
            { text: '✏️ Boost Volume', callback_data: 'boostVolume' },
            // { text: 'Reset wallet 🚀', callback_data: 'setWallet' }
        ]]

        return { title, content }
    } else {
        const title = `👨‍💻 Welcome to Radium Trading Volumn Bot!
        Experience the unique power of Radium Trading Volumn Bot, designed to attract new organic investors.

        Here's How:
        🔄 Volume Generation: Continuous trading volume for 24 hours.
        📦 Package Selection: Various packages tailored to your needs.
        🚀 Multiple Transactions: Adding VolumnBots, you get up to 130tx per minute, each from a unique wallet showcasing new holders.
        🌟 Organic Trending: High transaction rates and volume naturally improve visibility on various crypto platforms.

        Get Started! Reply with your adddress to receive tokens`
        const content = [[{ text: 'Set wallet 🚀', callback_data: 'newWallet' }]]
        return { title, content }
    }
}
export const walletOption = async (chatId: number, username?: string) => {
    const title = `⚠️ You can set deposting wallet for trading volumn Bot ⚠️`
    const content = [[{ text: 'New Wallet🚀', callback_data: 'newWallet' }, { text: 'Your Wallet 🚈', callback_data: 'customWallet' }]]
    return { title, content }
}
export const newWallet = async (chatId: number, username?: string) => {
    const keypair = solanaWeb3.Keypair.generate();

    // Encode public key in Base58
    const publicKey = keypair.publicKey.toBase58();
    // Encode private (secret) key in Base58
    const privateKey = base58.encode(keypair.secretKey);
    const newUser = {
        username: username,
        userId: chatId,
        publicKey,
        privateKey,
        distributionAmount: DISTRIBUTION_AMOUNT,
        buyUpperAmount: BUY_UPPER_AMOUNT,
        buyLowerAmount: BUY_LOWER_AMOUNT,
        buyIntervalMax: BUY_INTERVAL_MAX,
        buyIntervalMin: BUY_INTERVAL_MIN,
        distributeWalletNum: DISTRIBUTE_WALLET_NUM,
        sellAllByTimes: SELL_ALL_BY_TIMES
    }
    const data = await helper.saveInfo(chatId, newUser);
    const title = `This is your wallet public key, you should save this wallet address.
    this would be colleted wallet after finished volumn bot
    publickey = ${publicKey}
    
    You can select any options to run volume booster`
    const content = [[{ text: '✏️ Boost Volume', callback_data: 'boostVolume' }]]

    return { title, content }
}
export const customWallet = async (chatId: number, customKey: string, username: string) => {
    try {
        // Convert hex string to Uint8Array
        const secretKeyUint8Array = Uint8Array.from(Buffer.from(customKey, 'hex'));

        // Validate the length of the key, Solana secret keys should be 64 bytes long
        if (secretKeyUint8Array.length !== 64) {
            const title = 'Invalid key format'
            const content = [[{ text: '✏️ Input correct PrivateKey', callback_data: 'customWallet' }]];
            return { title, content }
        } else {
            const keypair = Keypair.fromSecretKey(secretKeyUint8Array);
            const isNew = await User.findOne({ chatId })
            if (isNew) {
                const data = await helper.addWallet(chatId, keypair);
            } else {
                const newUser = {
                    username: username,
                    userId: chatId,
                    publicKey: keypair.publicKey,
                    privateKey: keypair.secretKey,
                    distributionAmount: DISTRIBUTION_AMOUNT,
                    buyUpperAmount: BUY_UPPER_AMOUNT,
                    buyLowerAmount: BUY_LOWER_AMOUNT,
                    buyIntervalMax: BUY_INTERVAL_MAX,
                    buyIntervalMin: BUY_INTERVAL_MIN,
                    distributeWalletNum: DISTRIBUTE_WALLET_NUM,
                    sellAllByTimes: SELL_ALL_BY_TIMES
                }
                const data = await helper.saveInfo(chatId, newUser);
            }
            // Attempt to create a Keypair using the secret key
            const title = 'Wallet is set for to run bolume booster'
            const content = [[{ text: '✏️ Boost Volume', callback_data: 'boostVolume' }]]
            return { title, content }
        }
    } catch (error) {
        const title = `Invalid key format or error in key validation`;
        const content = [[{ text: '✏️ Input correct PrivateKey', callback_data: 'customWallet' }]];
        return { title, content }
    }
}
export const selectOption = async (chatId: number) => {
    const title = `⚠️ You can select any options to run volume booster ⚠️`
    const content = [[{ text: 'Package 1 🚀', callback_data: 'package1' }, { text: 'Custom Option 🚈', callback_data: 'customOption' }]]
    return { title, content }
}
export const customOption = async (chatId: number, username?: string) => {
    const userData = {
        username: username,
        distributionAmount: DISTRIBUTION_AMOUNT,
        buyUpperAmount: BUY_UPPER_AMOUNT,
        buyLowerAmount: BUY_LOWER_AMOUNT,
        buyIntervalMax: BUY_INTERVAL_MAX,
        buyIntervalMin: BUY_INTERVAL_MIN,
        distributeWalletNum: DISTRIBUTE_WALLET_NUM,
        sellAllByTimes: SELL_ALL_BY_TIMES
    }
    const userInfo = await helper.findOfUser(chatId, username);

    if (userInfo) {
        const title = `Variables for Trading
    Amount of SOL to distribute to each wallet: ${userInfo.distributionAmount}
    Number of wallets to distribute SOL to: ${userInfo.distributeWalletNum}

    Upper amount for Buying per Transaction: ${userInfo.buyUpperAmount} 
    Lower amount for Buying per Transaction: ${userInfo.buyLowerAmount}

    Maximum interval between buys in milliseconds: ${userInfo.buyIntervalMax}
    Minimum interval between buys in milliseconds: ${userInfo.buyIntervalMin}

    Number of times to sell all tokens in sub-wallets gradually: ${userInfo.sellAllByTimes}
    Slipage: ${userInfo.slippage}
       `
        const content = [[{ text: 'DISTRIBUTION_AMOUNT', callback_data: 'setDistributionAmt' }, { text: 'DISTRIBUTE_WALLET_NUM', callback_data: 'setDistributionWalletNum' }],
        [{ text: 'BUY_UPPER_AMOUNT', callback_data: 'setBuyUpperAmount' }, { text: 'BUY_LOWER_AMOUNT', callback_data: 'setBuyLowerAmount' }],
        [{ text: 'BUY_INTERVAL_MAX', callback_data: 'setBuyIntervalMax' }, { text: 'BUY_INTERVAL_MIN', callback_data: 'setBuyIntervalMin' }],
        [{ text: 'SELL_ALL_BY_TIMES', callback_data: 'setSellAllByTimes' }, { text: 'SLIPPAGE', callback_data: 'setSlippage' }],
        [{ text: 'FINISH', callback_data: 'sendTokenAddr' }]]

        return { title, content };
    } else {
        const userInfo = await helper.saveInfo(chatId, userData);
        const title = `Variables for Trading
        Amount of SOL to distribute to each wallet: ${DISTRIBUTION_AMOUNT}
        Number of wallets to distribute SOL to: ${DISTRIBUTE_WALLET_NUM}

        Upper amount for Buying per Transaction: ${BUY_UPPER_AMOUNT} 
        Lower amount for Buying per Transaction: ${BUY_LOWER_AMOUNT}

        Maximum interval between buys in milliseconds: ${BUY_INTERVAL_MAX}
        Minimum interval between buys in milliseconds: ${BUY_INTERVAL_MIN}

        Number of times to sell all tokens in sub-wallets gradually: ${SELL_ALL_BY_TIMES}
        Slippage: ${SLIPPAGE}
           `
        const content = [[{ text: 'DISTRIBUTION_AMOUNT', callback_data: 'setDistributionAmt' }, { text: 'DISTRIBUTE_WALLET_NUM', callback_data: 'setDistributionWalletNum' }],
        [{ text: 'BUY_UPPER_AMOUNT', callback_data: 'setBuyUpperAmount' }, { text: 'BUY_LOWER_AMOUNT', callback_data: 'setBuyLowerAmount' }],
        [{ text: 'BUY_INTERVAL_MAX', callback_data: 'setBuyIntervalMax' }, { text: 'BUY_INTERVAL_MIN', callback_data: 'setBuyIntervalMin' }],
        [{ text: 'SELL_ALL_BY_TIMES', callback_data: 'setSellAllByTimes' }, { text: 'SLIPPAGE', callback_data: 'setSlippage' }],
        [{ text: 'FINISH', callback_data: 'sendTokenAddr' }]]

        return { title, content };
    }

}
export const displaySettings = async (chatId: number, username?: string) => {
    const userInfo = await helper.findOfUser(chatId, username);
    if (userInfo) {
        await helper.updateDistributionAmt(chatId, DISTRIBUTION_AMOUNT);
        await helper.updateDistributionWalletNum(chatId, DISTRIBUTE_WALLET_NUM);
        await helper.updateBuyIntervalMax(chatId, BUY_INTERVAL_MAX);
        await helper.updateBuyIntervalMin(chatId, BUY_INTERVAL_MIN)
        await helper.updateBuyUpperAmount(chatId, BUY_UPPER_AMOUNT);
        await helper.updateBuyLowerAmount(chatId, BUY_LOWER_AMOUNT);
        await helper.updateSellAllByTimes(chatId, SELL_ALL_BY_TIMES);
    } else {
        throw new Error("user not found");
    }

    const title = `Variables for Trading
    Amount of SOL to distribute to each wallet: ${DISTRIBUTION_AMOUNT}   
    Number of wallets to distribute SOL to: ${DISTRIBUTE_WALLET_NUM}

    Upper amount for Buying per Transaction: ${BUY_UPPER_AMOUNT} 
    Lower amount for Buying per Transaction: ${BUY_LOWER_AMOUNT}
    
    Maximum interval between buys in milliseconds: ${BUY_INTERVAL_MAX}
    Minimum interval between buys in milliseconds: ${BUY_INTERVAL_MIN}
    Number of times to sell all tokens in sub-wallets gradually: ${SELL_ALL_BY_TIMES}
       `
    const content = [[{ text: ' Send Token Address 📨', callback_data: 'sendTokenAddr' }]]
    return { title, content }
}
export const sendTokenAddr = async (chatId: number, tokenAddr: String) => {
    await helper.updateTokenAddr(chatId, tokenAddr);
    const title = `💵 Token address for volume market making is set correctly: ${tokenAddr}
            
        👨‍💼 Please Input PoolId of token.`
    const content = [[{ text: `Input PoolID`, callback_data: `sendPoolId` }, { text: `Reset`, callback_data: `sendTokenAddr` }]]

    return { title, content };
}
export const sendPoolId = async (chatId: number, poolId: String) => {
    await helper.updatePoolId(chatId, poolId);
    const title = `💵 Token address for volume market making is set correctly: ${poolId}
            
        👨‍💼 Press button Continue`
    const content = [[{ text: `Continue`, callback_data: `makeVolumeWallet` }, { text: `Reset`, callback_data: `sendPoolId` }]]


    return { title, content };
}
export const makeVolumeWallet = async (chatId: number, username?: string) => {
    const userData = await helper.findOfUser(chatId);
    if (!userData) {
        throw new Error('user not found');
    }
    const publicKey: PublicKey | undefined = userData?.publicKey ? new PublicKey(userData.publicKey) : undefined;
    if (publicKey) {
        const solBalance = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
        const volumeAmt = userData.distributeWalletNum * userData.distributionAmount * (100 + CONFIRM_FEE) / 100;
        if (solBalance >= volumeAmt) {
            const title = `Volume bot Publick Key: 
            ${publicKey}
    sol Balance in wallets: ${solBalance}
    sol amount for volume booster: ${volumeAmt}
    Your wallet Sol balance is enough for trading`
            const content = [[{ text: '🏆 OK', callback_data: 'confirmWallet' }]]
            return { title, content }
        } else {
            const depositAmt = volumeAmt - solBalance;
            const title = `Volume bot Publick Key: 
                ${publicKey}
        sol Balance in wallets: ${solBalance}
        sol amount for volume booster: ${volumeAmt}
        💹 Please Deposit ${depositAmt} sol for volume booster:`
            const content = [[{ text: '💰 Deposit Sol', callback_data: 'deposit' }]]
            return { title, content }
        }
    } else {
        const wallet = Keypair.generate();
        const newpublicKey = await helper.addWallet(chatId, wallet);
        const volumeAmt = userData.distributionAmount * userData.distributeWalletNum * (100 + CONFIRM_FEE) / 100;

        const title = `Volume bot Publick Key: 
            ${newpublicKey}
    💹 Please input ${volumeAmt} sol for volume booster:`
        const content = [[{ text: '💰 Deposit Sol', callback_data: 'deposit' }]]
        return { title, content }
    }
}

export const checkDeposit = async (chatId: number) => {
    const title = `Did you deposit sol for volume booster?`
    const content = [[{ text: '🏆 OK', callback_data: 'confirmWallet' }, { text: '❌ CANCEL', callback_data: 'deposit' }]]
    return { title, content }
}

export const confirmWallet = async (chatId: number) => {
    try {
        const userData = await helper.findOfUser(chatId);
        if (userData == null) {
            const title = 'User not found';
            const content = [[{ text: 'User not found', callback_data: 'setWallet' }]]
            return { title, content }
        };
        const solAmount = (await solanaConnection.getBalance(new PublicKey(userData.publicKey))) / LAMPORTS_PER_SOL;
        const volumeAmt = userData.distributeWalletNum * userData.distributionAmount * (100 + CONFIRM_FEE) / 100;
        if (solAmount > volumeAmt) {
            const title = `Let's run volumn bot`;
            const content = [[{ text: 'Start', callback_data: 'start' }]];
            return { title, content }
        } else {
            const title = `Volume bot Publick Key:
            ${userData.publicKey}
            Please input ${volumeAmt - solAmount} for volumn booster`;
            const content = [[{ text: '💰 Deposit Sol', callback_data: 'deposit' }]];
            return { title, content }
        }
    } catch (error) {
        console.error("Error confirming wallet:", error);
        const title = `An error occurred`;
        const content = [[{ text: '🔁 Retry', callback_data: 'confirmWallet' }]];
        return { title, content };
    }

}

export const setDistributionAmt = async (chatId: number, distributionAmt: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateDistributionAmt(chatId, distributionAmt);
    const title = `💵 Amount of SOL to distribute to each wallet is set correctly: ${distributionAmt} sol
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setDistributionAmt` }]]


    return { title, content };
}

export const setDistributionWalletNum = async (chatId: number, distributionWalletNum: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateDistributionWalletNum(chatId, distributionWalletNum);
    const title = `💵 Number of wallets for trading is set correctly: ${distributionWalletNum}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setDistributionWalletNum` }]]


    return { title, content };
}

export const setBuyUpperAmount = async (chatId: number, buyUpperAmount: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateBuyUpperAmount(chatId, buyUpperAmount);
    const title = `💵 Upper limit for random buy amount is set correctly: ${buyUpperAmount}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setBuyUpperAmount` }]]

    return { title, content };
}

export const setBuyLowerAmount = async (chatId: number, buyLowerAmount: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateBuyLowerAmount(chatId, buyLowerAmount);
    const title = `💵 Lower limit for random buy amount is set correctly: ${buyLowerAmount}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setBuyLowerAmount` }]]


    return { title, content };
}

export const setBuyIntervalMax = async (chatId: number, buyIntervalMax: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateBuyIntervalMax(chatId, buyIntervalMax);
    const title = `💵 Maximum interval between buys in milliseconds is set correctly: ${buyIntervalMax}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setBuyIntervalMax` }]]


    return { title, content };
}

export const setBuyIntervalMin = async (chatId: number, buyIntervalMin: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateBuyIntervalMin(chatId, buyIntervalMin);
    const title = `💵lMinimum interval between buys in milliseconds is set correctly: ${buyIntervalMin}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setBuyIntervalMlMin` }]]


    return { title, content };
}

export const setSellAllByTimes = async (chatId: number, sellAllByTimes: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateSellAllByTimes(chatId, sellAllByTimes);
    const title = `💵Number of times to sell all tokens in sub-wallets gradually is set correctly: ${sellAllByTimes}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setSellAllByTimes` }]]


    return { title, content };
}

export const setSlippage = async (chatId: number, slippage: number) => {
    const userInfo = await helper.findOfUser(chatId);
    // const totalAmount = await solanaconnection.getbalalcne(new PublicKey(userInfo.publicKey))

    await helper.updateSlippage(chatId, slippage);
    const title = `💵Number of times to sell all tokens in sub-wallets gradually is set correctly: ${slippage}
        👨‍💼 Presss Continue button`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setSlippage` }]]

    return { title, content };
}

export const start = async (chatId: number) => {
    console.log("========================userInfo==============", chatId)
    try {
        startVolumeBot(chatId);
    }
    catch (error) {
        console.log("error----->", error)
    }
    const title = `💵Now Trading.....`
    const content = [[{ text: `✏️Cancel`, callback_data: `cancel` }]]

    return { title, content };
}

export const cancel = async (chatId: number) => {
    console.log("========================userInfo==============", chatId)
    const result = await handleBot(chatId);
    const title = `💵 ${result}`
    const content = [[{ text: `✏️ Start`, callback_data: `makeVolumeWallet` }]]

    return { title, content };
}

