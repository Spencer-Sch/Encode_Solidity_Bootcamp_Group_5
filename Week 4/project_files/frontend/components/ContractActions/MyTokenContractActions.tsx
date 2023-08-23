import { useAccount } from 'wagmi'
import RequestTokens from './RequestTokens'
import Vote from './Vote'

export default function () {
    const { address, isConnecting, isDisconnected } = useAccount()

    if (address)
        return (
            <>
                <RequestTokens address={{ address }}></RequestTokens>
                <Vote address={address}></Vote>
            </>
        )

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
