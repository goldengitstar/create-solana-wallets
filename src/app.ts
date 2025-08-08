import { Keypair } from "@solana/web3.js";
import * as db from "./db";
import bs58 from "bs58";

export function generateSpecificKeypair(target: string = "dmo") {
    while (true) {
        const pair = Keypair.generate();
        if (pair.publicKey.toBase58().endsWith(target)) {
            return pair;
        }
    }
}

export const saveRandomWallets = async () => {
    try {
        const keypairs = Keypair.generate();
        await db.createRandomGeneratedWallet(
            keypairs.publicKey.toBase58(),
            bs58.encode(keypairs.secretKey)
        );
        console.log(`✅ Generated random wallet: ${keypairs.publicKey.toBase58()}`);
    } catch (error) {
        console.error("❌ Error generating random wallet:", error);
    }
};

export const app = async () => {
    try {
        await db.init();

        // Generate wallets with random interval between 1 minute to 5 minutes
        const generateRandomInterval = () => {
            const minInterval = 1 * 60 * 1000; // 1 minute in milliseconds
            const maxInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
            return Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
        };

        const scheduleNextWallet = () => {
            const interval = generateRandomInterval();
            const minutes = (interval / (60 * 1000)).toFixed(2);
            console.log(`⏰ Next random wallet will be generated in ${minutes} minutes`);
            
            setTimeout(async () => {
                await saveRandomWallets();
                scheduleNextWallet(); // Schedule the next wallet
            }, interval);
        };

        // Start all wallet generation cycles
        console.log("🚀 Starting wallet generation services");
        
        // Start random wallet generation
        scheduleNextWallet();
        
        // Start PumpFun wallet generation
        setTimeout(async() => {
            const keypair = generateSpecificKeypair("pump");
            await db.createPumpFunKeypair(keypair.publicKey.toBase58(), bs58.encode(keypair.secretKey));
            console.log(`✅ Generated PumpFun Keypair: ${keypair.publicKey.toBase58()}`);
        }, 1000);
        
        // Start LetBonk wallet generation
        setTimeout(async() => {
            const keypair = generateSpecificKeypair("bonk");
            await db.createLetBonkKeypair(keypair.publicKey.toBase58(), bs58.encode(keypair.secretKey));
            console.log(`✅ Generated LetBonk Keypair: ${keypair.publicKey.toBase58()}`);
        }, 1000);
        
        console.log("✅ All wallet generation services started successfully");
        
    } catch (error) {
        console.error("❌ Failed to start wallet generation services:", error);
        process.exit(1);
    }
};

app();
