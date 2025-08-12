import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "solana-wallets-db";

const walletSchema = new mongoose.Schema({
    publicKey: { type: String, required: true },
    privateKey: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const RandomGeneratedWallet = mongoose.model("RandomGeneratedWallet", walletSchema);
const PumpFunKeypair = mongoose.model("PumpFunKeypair", walletSchema);
const LetBonkKeypair = mongoose.model("LetBonkKeypair", walletSchema);

export const init = () => {
    return new Promise(async (resolve: any, reject: any) => {
        mongoose
            .connect(`${dbUrl}/${dbName}`)
            .then(() => {
                console.log(`Connected to MongoDB "${dbName}"...`);

                resolve(true);
            })
            .catch((err) => {
                console.error("Could not connect to MongoDB...", err);
                reject(false);
            });
    });
};


export const createRandomGeneratedWallet = async (publicKey: string, privateKey: string) => {
    const wallet = new RandomGeneratedWallet({ publicKey, privateKey });
    await wallet.save();
    console.log(`🔄 Created random generated wallet: ${publicKey}`);
    return wallet;
};

export const getRandomGeneratedWallets = async (limit: number = 100) => {
    // Select wallets randomly from the database
    const wallets = await RandomGeneratedWallet.aggregate([{ $sample: { size: limit } }]);
    // Remove wallets from the database
    await RandomGeneratedWallet.deleteMany({ publicKey: { $in: wallets.map((wallet) => wallet.publicKey) } });
    return wallets;
};

export const createPumpFunKeypair = async (publicKey: string, privateKey: string) => {
    const wallet = new PumpFunKeypair({ publicKey, privateKey });
    await wallet.save();
    return wallet;
};

export const getPumpFunKeypairs = async (limit: number = 100) => {
    const wallets = await PumpFunKeypair.find().limit(limit);
    // Remove wallets from the database
    await PumpFunKeypair.deleteMany({ publicKey: { $in: wallets.map((wallet) => wallet.publicKey) } });
    return wallets;
};

export const createLetBonkKeypair = async (publicKey: string, privateKey: string) => {
    const wallet = new LetBonkKeypair({ publicKey, privateKey });
    await wallet.save();
    return wallet;
};

export const getLetBonkKeypairs = async (limit: number = 100) => {
    const wallets = await LetBonkKeypair.find().limit(limit);
    // Remove wallets from the database
    await LetBonkKeypair.deleteMany({ publicKey: { $in: wallets.map((wallet) => wallet.publicKey) } });
    return wallets;
};