import { useState } from 'react'

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
