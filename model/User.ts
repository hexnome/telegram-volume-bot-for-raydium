import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, default: '' },
    userId: { type: Number, required: true, unique: true },
    publicKey: { type: String, default: '' },
    privateKey: { type: String, default: '' },
    tokenAddr: { type: String, default: '' },
    poolId: {type: String, default: ''},
    solAmount: { type: Number, default: 0 },
    distributionAmount: { type: Number, default: 0 },
    buyUpperAmount: { type: Number, default: 0 },
    buyLowerAmount: { type: Number, default: 0 },
    buyIntervalMax: { type: Number, default: 0 },
    buyIntervalMin: { type: Number, default: 0 },
    distributeWalletNum: { type: Number, default: 0 },
    subWallets: [{ type: String, required: true }],
    sellAllByTimes: { type: Number, default: 0 },
    slippage: { type: Number, default: 0 }
});

const User = mongoose.model("User", UserSchema);

export default User;