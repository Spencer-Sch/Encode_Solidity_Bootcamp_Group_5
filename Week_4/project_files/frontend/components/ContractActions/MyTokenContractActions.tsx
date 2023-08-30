import { useAccount } from 'wagmi'
import RequestTokens from './RequestTokens'
import Vote from './Vote'
import Delegate from './Delegate'
import styles from './styles/myTokenContractActions.module.css'

export default function () {
    const { address, isConnecting, isDisconnected } = useAccount()

    if (address)
        return (
            <div className={styles.container}>
                <RequestTokens address={address}></RequestTokens>
                <Delegate address={address}></Delegate>
                <Vote address={address}></Vote>
            </div>
        )

    if (isConnecting)
        return (
            <>
                <p>Loading Contract Actions...</p>
            </>
        )
    if (isDisconnected)
        return (
            <>
                <p>No Contract Actions Available</p>
            </>
        )
}
