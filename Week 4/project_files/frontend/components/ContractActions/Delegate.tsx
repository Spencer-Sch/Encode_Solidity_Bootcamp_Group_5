import { sepolia, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import * as myTokenJSON from '@/assets/MyToken.json'

const myTokenABI = myTokenJSON.abi

export default function Delegate(params: { address: string }) {
    const { config } = usePrepareContractWrite({
        address: '0xbBAfa95dF21F2AD94f65A71DF988a4284E5E08dD',
        // address: (process.env.MY_TOKEN_CONTRACT_ADDRESS as `0x${string}`) ?? '',
        abi: myTokenABI,
        functionName: 'delegate',
        args: [params.address],
        chainId: sepolia.id,
        account: params.address as `0x${string}`,
        onError(error) {
            console.log('usePrepare Error: ', error)
        },
        onSuccess(data) {
            console.log('usePrepare Success: ', data)
        },
    })

    const { data, isLoading: loadingWrite, write } = useContractWrite(config)
    const { isLoading: awaitingTX, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                write?.()
            }}
        >
            <button type="submit" disabled={!write || awaitingTX}>
                {awaitingTX ? 'Delegating...' : 'Self Delegate'}
            </button>
            {loadingWrite && <div>Sign Transaction...</div>}
            {isSuccess && <div>Transaction: {JSON.stringify(data?.hash)}</div>}
        </form>
    )
}
