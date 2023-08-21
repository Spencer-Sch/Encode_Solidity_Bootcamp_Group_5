import { useAccount } from 'wagmi'
import RequestTokens from './RequestTokens'

export default function () {
    const { address, isConnecting, isDisconnected } = useAccount()

    if (address) return <RequestTokens address={{ address }}></RequestTokens>

    if (isConnecting)
        return (
            <>
                <p>Loading...</p>
            </>
        )
    if (isDisconnected)
        return (
            <>
                <p>Wallet Disconnected</p>
            </>
        )
}
