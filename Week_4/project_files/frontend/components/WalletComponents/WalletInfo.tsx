import { useAccount, useNetwork } from 'wagmi'
import WalletBalance from './WalletBalance'

export default function WalletInfo() {
    const { address, isConnecting, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    if (address)
        return (
            <>
                <p>Connected to the network {chain?.name}</p>
                <WalletBalance address={address}></WalletBalance>
            </>
        )
    if (isConnecting)
        return (
            <>
                <p> Loading Wallet Info...</p>
            </>
        )
    if (isDisconnected)
        return (
            <>
                <p>Wallet Disconnected</p>
            </>
        )
    return (
        <div>
            <p>Please connect your wallet</p>
        </div>
    )
}
