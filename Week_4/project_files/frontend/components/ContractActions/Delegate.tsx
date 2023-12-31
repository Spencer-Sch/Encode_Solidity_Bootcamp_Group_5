import { sepolia, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import * as myTokenJSON from '@/assets/MyToken.json'
import styles from './styles/delegate.module.css'

const myTokenABI = myTokenJSON.abi

export default function Delegate(params: { address: string }) {
    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address: (process.env.NEXT_PUBLIC_MY_TOKEN_CONTRACT_ADDRESS as `0x${string}`) ?? '',
        abi: myTokenABI,
        functionName: 'delegate',
        args: [params.address],
        chainId: sepolia.id,
        account: params.address as `0x${string}`,
        onError(error) {
            // console.log('usePrepare DELEGATE Error: ', error)
        },
        onSuccess(data) {
            // console.log('usePrepare DELEGATE Success: ', data)
        },
    })

    const { data, isLoading: loadingWrite, error, isError, write } = useContractWrite(config)
    const { isLoading: awaitingTX, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    return (
        <form
            className={styles.form}
            onSubmit={(e) => {
                e.preventDefault()
                write?.()
            }}
        >
            <button type="submit" disabled={!write || awaitingTX}>
                {awaitingTX ? 'Delegating...' : 'Self Delegate'}
            </button>
            {loadingWrite && <div>Sign Transaction...</div>}
            {isSuccess && (
                <div>
                    <p>Delegation Succesful!</p>
                    <p>Hash: {JSON.stringify(data?.hash)}</p>
                    <div>
                        <a target="_blank" href={`https://sepolia.etherscan.io/tx/${data?.hash}`}>
                            View On Etherscan
                        </a>
                    </div>
                </div>
            )}
            {isError && (
                <div>
                    Error:{' '}
                    {error?.message.toLowerCase().includes('user rejected')
                        ? 'User rejected request'
                        : error?.message}
                </div>
            )}
            {/* {(isPrepareError || isError) && <div>Error: {(prepareError || error)?.message}</div>} */}
        </form>
    )
}
