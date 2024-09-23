
import { Keypair } from "@solana/web3.js";
import User from "../model/User"
import base58 from "bs58";

// export const start = async (userId: number, username?: string) => {
//   try {
//     const amount = userData[userId] ?? 0
//     const info = await User.findOneAndUpdate({ userId }, { userId, username, amount }, { upsert: true })
//     return amount
//   } catch (e) {
//     return 0
//   }
// }


export const saveInfo = async (userId: number, userData: any) => {
  try {
    const newData = new User({ userId, ...userData })
    await newData.save();
  } catch (e) {
    return null
  }
}

export const addWallet = async (userId: number, wallet: Keypair) => {
  try {
    const privateKey = base58.encode(wallet.secretKey);
    const publicKey = wallet.publicKey.toBase58()
    const data = await User.findOneAndUpdate({ userId }, { userId, privateKey, publicKey }, { new: true, upsert: true });
    console.log("123131================", data);
    return data.publicKey;
  } catch (e) {
    return undefined
  }
}

export const findOfUser = async (userId: number, username?: string) => {
  try {
    const user = await User.findOne({ userId })
    return user;
  } catch (e) {
    return null
  }
}

export const addressAddDB = async (userId: number, privateKey: string, publicKey: string) => {
  try {
    const data = await User.findOneAndUpdate({ userId }, { userId, privateKey, publicKey }, { new: true, upsert: true });
    console.log("123131================", data);
    return data.publicKey;
  } catch (e) {
    return undefined
  }
}
export const updateSolAmount = async (userId: number, solAmount: number) => {
  try {
    console.log("121111111")
    const data = await User.findOneAndUpdate({ userId }, { solAmount }, { new: true });
    console.log("data")
    if (data) {
      console.log("123131================", data);
      return data.publicKey;
    }
  } catch (e) {
    return undefined
  }
}
export const updateWalletNum = async (userId: number, walletNum: number) => {
  try {
    const data = await User.findOneAndUpdate({ userId }, { walletNum }, { new: true });
    console.log("123131================", data);
    if (data) {
      return data.publicKey;
    }
  } catch (e) {
    return undefined
  }
}

export const updateDistributionAmt = async (userId: number, distributionAmt: number) => {
  try {
    const distributionAmount = distributionAmt;
    const data = await User.findOneAndUpdate({ userId }, { userId, distributionAmount }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateTokenAddr = async (userId: number, tokenAddr: String) => {
  try {
    const data = await User.findOneAndUpdate({ userId }, { userId, tokenAddr }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updatePoolId = async (userId: number, poolId: String) => {
  try {
    const data = await User.findOneAndUpdate({ userId }, { userId, poolId }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateDistributionWalletNum = async (userId: number, distributeWalletNum: number) => {
  try {
    const data = await User.findOneAndUpdate({ userId }, { userId, distributeWalletNum }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateBuyUpperAmount = async (userId: number, buyUpperAmount: number) => {
  try {
    const data = await User.findOneAndUpdate({ userId }, { userId, buyUpperAmount }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateBuyLowerAmount = async (userId: number, buyLowerAmount: number) => {
  try {
    const data = await User.findOneAndUpdate({ userId }, { userId, buyLowerAmount }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateBuyIntervalMax = async (userId: number, buyIntervalMax: number) => {
  try {
    const data = await User.findOneAndUpdate({ userId }, { userId, buyIntervalMax }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateBuyIntervalMin = async (userId: number, buyIntervalMin: number) => {
  try {
    const data = await User.findOneAndUpdate({ userId }, { userId, buyIntervalMin }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateSellAllByTimes = async (userId: number, sellAllByTimes: number) => {
  try {
    const data = await User.findOneAndUpdate({ userId }, { userId, sellAllByTimes }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateSlippage = async (userId: number, slippage: number) => {
  try {
    const data = await User.findOneAndUpdate({ userId }, { userId, slippage }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}
// export const addressCheckDB = async (userId: number) => {
//   try {
//     const data = await User.findOne({ userId }).select('address')
//     if (data) return data.address
//     else return ''
//   } catch (e) {
//     return ''
//   }
// }

// export const amountAddDB = async (userId: number, amount: number) => {
//   const data = await User.findOneAndUpdate({ userId }, { amount }, { upsert: true, new: true }).select('amount')
//   return data.amount
// }

// export const amountCheckDB = async (userId: number) => {
//   const data = await User.findOne({ userId })
//   return data
// }

// export const airdrop = async (userId: number) => {
//   // web3 airdrop -> get txhash -> check if tx success
//   const origin = await User.findOne({ userId })
//   if (origin?.claimable) return { error: 'you have alredy claimed' }
//   // make tx
//   const data = '0xae833772b424beb49d987af5f8dd6049cf5bb57d272e319577b31c0ef63d1643'
//   const result = await User.findOneAndUpdate({ userId }, { claimable: true, claimTime: new Date() }, { new: true })
//   return { tx: data }
// }
