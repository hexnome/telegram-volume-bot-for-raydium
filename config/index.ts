import dotenv from "dotenv";
import { connectMongoDB } from "./db";
import { Connection } from "@solana/web3.js";
dotenv.config();

export const botToken = process.env.TOKEN!
export const mongoUrl = process.env.MONGO_URL!
export const webSite = process.env.WEB_SITE_URL!
export const OWNER_PUBLIC_KEY = process.env.OWNER_PUBLIC_KEY!

export const DISTRIBUTION_AMOUNT = Number(process.env.DISTRIBUTION_AMOUNT!)
export const BUY_AMOUNT = Number(process.env.BUY_AMOUNT!)
export const BUY_UPPER_AMOUNT = Number(process.env.BUY_UPPER_AMOUNT!)
export const BUY_LOWER_AMOUNT = Number(process.env.BUY_LOWER_AMOUNT!)
export const BUY_INTERVAL_MAX = Number(process.env.BUY_INTERVAL_MAX!)
export const BUY_INTERVAL_MIN = Number(process.env.BUY_INTERVAL_MIN!)
export const CHECK_BAL_INTERVAL = process.env.CHECK_BAL_INTERVAL!
export const DISTRIBUTE_WALLET_NUM = Number(process.env.DISTRIBUTE_WALLET_NUM!)
export const ADDITIONAL_FEE = Number(process.env.ADDITIONAL_FEE!)

export const SELL_ALL_BY_TIMES = Number(process.env.SELL_ALL_BY_TIMES!)
export const SELL_PERCENT = Number(process.env.SELL_PERCENT!)
export const CONFIRM_FEE = Number(process.env.CONFIRM_FEE!)

export const SLIPPAGE = Number(process.env.SLIPPAGE)

export const RPC_ENDPOINT = process.env.RPC_ENDPOINT!
export const RPC_WEBSOCKET_ENDPOINT = process.env.RPC_WEBSOCKET_ENDPOINT!

export const solanaConnection = new Connection(RPC_ENDPOINT, {
    wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
})
export const LAMPORTS_PER_SOL = 1000000000;

export const init = async () => {
    connectMongoDB()
}