import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as db from "./db";
import { startServer } from "./server";

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateSpecificKeypair(target: string = "dmo") {
    let iterations = 0;
    // Yield to the event loop periodically to avoid blocking I/O (e.g., MongoDB writes)
    while (true) {
        const pair = Keypair.generate();
        if (pair.publicKey.toBase58().endsWith(target)) {
            return pair;
        }
        iterations += 1;
        if (iterations % 1000 === 0) {
            await new Promise<void>((resolve) => setImmediate(resolve));
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

        // Start the API server
        startServer();

        // Generate wallets with random interval between 1 minute to 5 minutes
        const generateRandomInterval = () => {
            const minInterval = 1 * 60 * 1000; // 1 minute in milliseconds
            const maxInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
            return Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
        };

        // Start all wallet generation cycles
        console.log("🚀 Starting wallet generation services");

        // Random wallet generation using a self-scheduling timer (avoids overlapping intervals)
        const runRandomWallets = async () => {
            try {
                console.log("🔄 Generating random wallet");
                await saveRandomWallets();
                console.log("✅ Random wallet generated");
            } catch (err) {
                console.error("❌ Error in random wallet generation:", err);
            } finally {
                const interval = generateRandomInterval();
                console.log(`🔄 Waiting for ${interval} milliseconds`);
                setTimeout(runRandomWallets, interval);
            }
        };
        runRandomWallets();

        // Continuous PumpFun keypair generation (non-blocking, yields to event loop)
        const runPumpFun = async () => {
            try {
                const keypair = await generateSpecificKeypair("pump");
                await db.createPumpFunKeypair(
                    keypair.publicKey.toBase58(),
                    bs58.encode(keypair.secretKey)
                );
                console.log(`✅ Generated PumpFun Keypair: ${keypair.publicKey.toBase58()}`);
            } catch (err) {
                console.error("❌ Error generating PumpFun keypair:", err);
            } finally {
                setImmediate(runPumpFun);
            }
        };
        runPumpFun();

        // Continuous LetBonk keypair generation (non-blocking, yields to event loop)
        const runLetBonk = async () => {
            try {
                const keypair = await generateSpecificKeypair("bonk");
                await db.createLetBonkKeypair(
                    keypair.publicKey.toBase58(),
                    bs58.encode(keypair.secretKey)
                );
                console.log(`✅ Generated LetBonk Keypair: ${keypair.publicKey.toBase58()}`);
            } catch (err) {
                console.error("❌ Error generating LetBonk keypair:", err);
            } finally {
                setImmediate(runLetBonk);
            }
        };
        runLetBonk();

        console.log("✅ All wallet generation services started successfully");
        
    } catch (error) {
        console.error("❌ Failed to start wallet generation services:", error);
        process.exit(1);
    }
};

app();
