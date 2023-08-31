import { useState } from 'react'
import styles from './styles/requestToken.module.css'

export default function RequestTokens(params: { address: any }) {
    const [data, setData] = useState<{
        result: string
        tx: string
        to: string
        from: string
        gasUsed: string
    }>()
    const [isLoading, setLoading] = useState(false)

    const body = { address: params.address }

    if (isLoading) return <p className={styles.container}>Requesting tokens from API...</p>
    if (!data)
        return (
            <div className={styles.container}>
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
            </div>
        )

    if (!data.result) {
        return (
            <div className={styles.container}>
                <p>Result from API: FAILED!</p>
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <p>Result from API: WORKED!</p>
            <p>Transaction Hash: {data.tx}</p>
            <p>Mint Tokens to: {data.to}</p>
            <p>Mint Tokens from: {data.from}</p>
            <p>Gas Used: {data.gasUsed}</p>
            <a target="_blank" href={`https://etherscan.io/tx/${data?.tx}`}>
                View On Etherscan
            </a>
        </div>
    )
}
