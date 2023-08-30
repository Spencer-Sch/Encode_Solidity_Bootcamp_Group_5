import {
    sepolia,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi'
import * as ballotJson from '@/assets/TokenizedBallot.json'
import { useState } from 'react'
import { parseUnits, hexToString } from 'viem'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './styles/vote.module.css'

const ballotABI = ballotJson.abi

export default function Vote(params: { address: string }) {
    const [proposition, setProposition] = useState<number>(0)
    const [amount, setAmount] = useState<bigint>(parseUnits('1', 18))

    const debouncedProposition = useDebounce(proposition)
    const debouncedAmount = useDebounce(amount)

    const {
        data: proposals,
        isError: readPropNamesError,
        isLoading: propNamesIsLoading,
    }: {
        data: Array<{ name: `0x${string}`; voteCount: bigint }> | undefined
        isError: boolean
        isLoading: boolean
    } = useContractRead({
        address:
            (process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_CONTRACT_ADDRESS as `0x${string}`) ?? '',
        abi: ballotABI,
        functionName: 'getProposals',
        chainId: sepolia.id,
        onError(error) {
            console.log('useRead PROPOSALS Error: ', error)
        },
        onSuccess(data) {
            console.log('useRead PROPOSALS Error: ', data)
        },
    })

    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite({
        address:
            (process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_CONTRACT_ADDRESS as `0x${string}`) ?? '',
        abi: ballotABI,
        functionName: 'vote',
        args: [debouncedProposition, debouncedAmount],
        chainId: sepolia.id,
        account: params.address as `0x${string}`,
        onError(error) {
            console.log('usePrepare VOTE Error: ', error)
        },
        onSuccess(data) {
            console.log('usePrepare VOTE Success: ', data)
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
            default:
                amountBN = parseUnits('1', 18)
        }
        setAmount(amountBN)
    }

    function formatOptions(value: `0x${string}`) {
        return hexToString(value, { size: 32 })
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
                {!proposals && <option value="0">Loading Proposal Names...</option>}
                {proposals &&
                    proposals.map((item, idx) => (
                        <option key={hexToString(item.name, { size: 32 })} value={idx}>
                            {formatOptions(item.name)}
                        </option>
                    ))}
            </select>
            <label htmlFor="amount">Choose an amount to vote:</label>
            <select
                disabled={awaitingTX}
                required
                name="amount"
                id="amount"
                onChange={(e) => handleAmountConversion(e.target.value)}
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
                        <a target="_blank" href={`https://etherscan.io/tx/${data?.hash}`}>
                            View On Etherscan
                        </a>
                    </div>
                </div>
            )}
            {isError && <div>Error: {error?.message}</div>}
        </form>
    )
}
