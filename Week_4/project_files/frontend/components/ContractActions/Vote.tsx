import { sepolia, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import * as ballotJson from '@/assets/TokenizedBallot.json'
import { useState } from 'react'
import { parseUnits } from 'viem'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './styles/vote.module.css'

const ballotABI = ballotJson.abi

export default function Vote(params: { address: string; proposals: string[] | undefined }) {
    const [proposition, setProposition] = useState<number>(0)
    const [amount, setAmount] = useState<bigint>(parseUnits('1', 18))

    const debouncedProposition = useDebounce(proposition)
    const debouncedAmount = useDebounce(amount)

    const { config } = usePrepareContractWrite({
        address:
            (process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_CONTRACT_ADDRESS as `0x${string}`) ?? '',
        abi: ballotABI,
        functionName: 'vote',
        args: [debouncedProposition, debouncedAmount],
        chainId: sepolia.id,
        account: params.address as `0x${string}`,
        onError(error) {
            // console.log('usePrepare VOTE Error: ', error)
        },
        onSuccess(data) {
            // console.log('usePrepare VOTE Success: ', data)
        },
    })

    const { data, isLoading: loadingWrite, error, isError, write } = useContractWrite(config)
    const { isLoading: awaitingTX, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    function handleAmountConversion(value: string) {
        let amountBN
        switch (value) {
            case 'one':
                amountBN = parseUnits('1', 18)
                break
            case 'half':
                amountBN = parseUnits('0.5', 18)
                break
            default:
                amountBN = parseUnits('1', 18)
        }
        return amountBN
    }

    function formatOptions(value: string) {
        return value
            .split('-')
            .map((word) => word[0].toUpperCase().concat(word.slice(1)))
            .join(' ')
    }

    return (
        <form
            className={styles.form}
            onSubmit={(e) => {
                e.preventDefault()
                write?.()
            }}
        >
            <label htmlFor="proposals">Choose a proposal:</label>
            <select
                disabled={awaitingTX}
                required
                name="proposals"
                id="proposals"
                onChange={(e) => setProposition(Number(e.target.value))}
            >
                {!params.proposals && <option value="0">Loading Proposal Names...</option>}
                {params.proposals &&
                    params.proposals.map((item, idx) => (
                        <option key={item} value={idx}>
                            {formatOptions(item)}
                        </option>
                    ))}
            </select>
            <label htmlFor="amount">Choose an amount to vote:</label>
            <select
                disabled={awaitingTX}
                required
                name="amount"
                id="amount"
                onChange={(e) => setAmount(handleAmountConversion(e.target.value))}
            >
                <option value="one">Full Coin</option>
                <option value="half">Half Coin</option>
            </select>
            <button type="submit" disabled={!write || awaitingTX}>
                {awaitingTX ? 'Voting...' : 'Vote'}
            </button>
            {loadingWrite && <div>Sign Transaction...</div>}
            {isSuccess && (
                <div>
                    <p>Vote Succesful!</p>
                    <p>Hash: {JSON.stringify(data?.hash)}</p>
                    <div>
                        <a target="_blank" href={`https://sepolia.etherscan.io/tx/${data?.hash}`}>
                            View On Etherscan
                        </a>
                    </div>
                </div>
            )}
            {isError && <div>Error: {error?.message}</div>}
        </form>
    )
}
