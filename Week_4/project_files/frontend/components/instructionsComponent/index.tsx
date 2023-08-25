import { useEffect, useState } from 'react'
import styles from './instructionsComponent.module.css'
import { useAccount, useNetwork, useBalance, useSignMessage, useContractRead } from 'wagmi'
import * as myTokenJson from '@/assets/MyToken.json'

export default function InstructionsComponent() {
    return (
        <div className={styles.container}>
            <header className={styles.header_container}>
                <div className={styles.header}>
                    <h1>My App</h1>
                </div>
            </header>
            <p className={styles.get_started}>
                <PageBody></PageBody>
            </p>
        </div>
    )
}

function PageBody() {
    return (
        <div>
            <WalletInfo></WalletInfo>
        </div>
    )
}

function WalletInfo() {
    const { address, isConnecting, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    if (address)
        return (
            <div>
                <p>Your account address is {address}</p>
                <p>Connected to the network {chain?.name}</p>
                <WalletBalance address={address}></WalletBalance>
                <RequestTokens address={address}></RequestTokens>
            </div>
        )
    if (isConnecting)
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    if (isDisconnected)
        return (
            <div>
                <p>Wallet disconnected. Connect wallet to continue</p>
            </div>
        )
    return (
        <div>
            <p>Connect wallet to continue</p>
        </div>
    )
}

function WalletBalance(params: { address: any }) {
    const { data, isError, isLoading } = useBalance({ address: params.address })
    if (isLoading) return <div>Fetching balance...</div>
    if (isError) return <div>Error fetching balance</div>
    return (
        <>
            <div>
                Balance: {data?.formatted} {data?.symbol}
            </div>
        </>
    )
}

// function WalletAction() {
//     const [signatureMessage, setSignatureMessage] = useState('')

//     const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage()
//     return (
//         <div>
//             <form>
//                 <label>
//                     Enter the message to be signed:
//                     <input
//                         type="text"
//                         value={signatureMessage}
//                         onChange={(e) => setSignatureMessage(e.target.value)}
//                     />
//                 </label>
//             </form>
//             <button
//                 disabled={isLoading}
//                 onClick={() =>
//                     signMessage({
//                         message: signatureMessage,
//                     })
//                 }
//             >
//                 Sign message
//             </button>
//             {isSuccess && <div>Signature: {data}</div>}
//             {isError && <div>Error signing message</div>}
//         </div>
//     )
// }

function RequestTokens(params: { address: string }) {
    const [data, setData] = useState<{
        result: string
        tx: string
        to: string
        from: string
        gasUsed: string
    }>()
    const [isLoading, setLoading] = useState(false)

    const body = { address: params.address }

    if (isLoading) return <p>Requesting tokens from API...</p>
    if (!data)
        return (
            <button
                onClick={() => {
                    setLoading(true)
                    fetch('http://localhost:3001/mint-tokens', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            setData(data)
                            setLoading(false)
                        })
                }}
            >
                Request tokens
            </button>
        )

    if (!data.result) {
        return (
            <div>
                <p>Result from API: FAILED!</p>
            </div>
        )
    }
    return (
        <div>
            <p>Result from API: WORKED!</p>
            <p>Transaction Hash: {data.tx}</p>
            <p>Mint Tokens to: {data.to}</p>
            <p>Mint Tokens from: {data.from}</p>
            <p>Gas Used: {data.gasUsed}</p>
        </div>
    )
}
