import express from 'express';
import { getRandomGeneratedWallets, getPumpFunKeypairs, getLetBonkKeypairs } from './db';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Wallet generation service is running' });
});

// API endpoint to get random wallets
app.get('/api/wallets/random', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const wallets = await getRandomGeneratedWallets(limit);
        
        res.json({
            success: true,
            count: wallets.length,
            keypairs: wallets.map(wallet => ({
                publicKey: wallet.publicKey,
                privateKey: wallet.privateKey
            }))
        });
    } catch (error) {
        console.error('Error fetching random wallets:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch random wallets'
        });
    }
});

// API endpoint to get PumpFun keypairs
app.get('/api/wallets/pumpfun', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const keypairs = await getPumpFunKeypairs(limit);
        
        res.json({
            success: true,
            count: keypairs.length,
            keypairs: keypairs.map(keypair => ({
                publicKey: keypair.publicKey,
                privateKey: keypair.privateKey
            }))
        });
    } catch (error) {
        console.error('Error fetching PumpFun keypairs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch PumpFun keypairs'
        });
    }
});

// API endpoint to get LetBonk keypairs
app.get('/api/wallets/letbonk', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const keypairs = await getLetBonkKeypairs(limit);
        
        res.json({
            success: true,
            count: keypairs.length,
            keypairs: keypairs.map(keypair => ({
                publicKey: keypair.publicKey,
                privateKey: keypair.privateKey
            }))
        });
    } catch (error) {
        console.error('Error fetching LetBonk keypairs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch LetBonk keypairs'
        });
    }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

export const startServer = () => {
    app.listen(PORT, () => {
        console.log(`🚀 API server running on port ${PORT}`);
        console.log(`📖 API Documentation:`);
        console.log(`   GET /health - Health check`);
        console.log(`   GET /api/wallets/random?limit=10 - Get random wallets`);
        console.log(`   GET /api/wallets/pumpfun?limit=10 - Get PumpFun keypairs`);
        console.log(`   GET /api/wallets/letbonk?limit=10 - Get LetBonk keypairs`);
    });
};
