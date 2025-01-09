import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'

export const publicClient = createPublicClient({
    chain: arbitrum,
    transport: http()
})

export default {
    address: {
        privateKey: Bun.env.PRIVATE_KEY,
        address: '0x916a9691dA928d91E27DDA6D34DD5aE7eD1F206B'
    },
    contractAddress: "0x283C7732DB776B3537385ec0c25878A02d79f4e5",
    mintId: 2,
    mintAmount: 1,
    spamTimes: 10
}
