import { useBalance } from 'wagmi'

export default function WalletBalance(params: { address: any }) {
    const { data, isError, isLoading } = useBalance({ address: params.address })
    if (isLoading) return <div>Fetching balance…</div>
    if (isError) return <div>Error fetching balance</div>
    return (
        <div>
            Balance: {data?.formatted} {data?.symbol}
        </div>
    )
}
