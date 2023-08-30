import { sepolia, useContractRead } from 'wagmi'
import * as ballotJson from '@/assets/TokenizedBallot.json'
import { hexToString } from 'viem'
import styles from './styles/voteLog.module.css'

const ballotABI = ballotJson.abi

type voteLog = { proposal: bigint; voter: `0x${string}`; amount: bigint; blockNumber: bigint }

// Array<{ proposal: bigint; voter: `0x${string}`, amount: bigint, blockNumber: bigint }> | undefined
// Array<{ proposal: bigint; voter: `0x${string}`, amount: bigint, blockNumber: bigint }> | []

export default function VoteLog(params: { proposals: string[] | undefined }) {
    const { data, isError, error, isLoading, isSuccess } = useContractRead({
        address:
            (process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_CONTRACT_ADDRESS as `0x${string}`) ?? '',
        abi: ballotABI,
        functionName: 'getVoteLog',
        chainId: sepolia.id,
        onError(error) {
            console.log('useRead VOTE_LOG Error: ', error)
        },
        onSuccess(data) {
            console.log('useRead VOTE_LOG Error: ', data)
        },
    })

    const proposalMap = new Map()
    params.proposals?.forEach((item, idx) => {
        proposalMap.set(idx, item)
    })

    function formatOptions(value: string) {
        return value
            .split('-')
            .map((word) => word[0].toUpperCase().concat(word.slice(1)))
            .join(' ')
    }

    const voteLogs: any = data ? data : []

    if (isSuccess) {
        return (
            <div className={styles.container}>
                <p>Previous votes:</p>
                {voteLogs.map((item: voteLog, idx: number) => (
                    <div className={styles.voteLog} key={`${item.blockNumber}${idx}`}>
                        <div>
                            Proposal name: {formatOptions(proposalMap.get(Number(item.proposal)))}
                        </div>
                        <div>Voter Address: {item.voter}</div>
                        <div>Vote Amount: {item.amount.toString()}</div>
                        <div>Block Number: {item.blockNumber.toString()}</div>
                    </div>
                ))}
            </div>
        )
    }

    if (isError) {
        return <div>{isError && <div>Error: {error?.message}</div>}</div>
    }
}
