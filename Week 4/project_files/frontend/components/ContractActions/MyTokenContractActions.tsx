import { useAccount } from 'wagmi'
import RequestTokens from './RequestTokens'
import Vote from './Vote'
import Delegate from './Delegate'

export default function () {
    const { address, isConnecting, isDisconnected } = useAccount()

    if (address)
        return (
            <>
                <RequestTokens address={address}></RequestTokens>
                <Delegate address={address}></Delegate>
                {/* <Vote address={address}></Vote> */}
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
