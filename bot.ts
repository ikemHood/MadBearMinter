import config, { publicClient } from "./config";
import abi from "./abi.json";
import { arbitrum } from "viem/chains";
import { http } from "viem";
import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient } from "viem";
import 'dotenv/config';

async function checkMintLive() {
    const mintLive = await publicClient.readContract({
        address: config.contractAddress as `0x${string}`,
        abi: abi,
        functionName: "presaleScheduledStartTimestamp",
        args: [config.mintId]
    })

    const now = Math.floor(Date.now() / 1000);

    console.log(now, mintLive)

    return now >= Number(mintLive);
}

async function canMINTCheck() {
    const canMINT = await publicClient.readContract({
        address: config.contractAddress as `0x${string}`,
        abi: abi,
        functionName: "canMintCheck",
        args: [config.mintId, config.mintAmount, config.address.address]
    })

    console.log(canMINT)

    return canMINT;
}

async function mint() {
    const account = privateKeyToAccount(config.address.privateKey as `0x${string}`)
    const accountClient = createWalletClient({
        chain: arbitrum,
        transport: http(),
        account: account
    })

    const mintValue = await publicClient.readContract({
        address: config.contractAddress as `0x${string}`,
        abi: abi,
        functionName: "quoteBatchMint",
        args: [config.mintAmount, config.mintId]
    })

    console.log(mintValue)

    const mint = await accountClient.writeContract({
        address: config.contractAddress as `0x${string}`,
        abi: abi,
        functionName: "mint",
        args: [config.mintAmount, config.mintId],
        value: (mintValue as any).totalCostWithFee as bigint
    })

    console.log(mint)
}

async function startBot() {
    const interval = setInterval(async () => {
        const isMintLive = await checkMintLive();
        console.log("Mint Status: ", isMintLive)
        if (isMintLive) {
            clearInterval(interval);
            const canMint = await canMINTCheck();
            if (canMint) {
                const mintPromises = Array.from({ length: 10 }, () => mint());
                await Promise.all(mintPromises);
            }
        }
    }, 1000); // Check every 1 seconds
}

startBot();
