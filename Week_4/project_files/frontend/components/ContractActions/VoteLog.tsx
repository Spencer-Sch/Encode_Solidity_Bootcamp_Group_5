import { sepolia, useContractEvent, useContractRead } from 'wagmi'
import * as ballotJson from '@/assets/TokenizedBallot.json'
import { Log } from 'viem'
import styles from './styles/voteLog.module.css'
import { useCallback, useEffect, useState } from 'react'

const ballotABI = ballotJson.abi

type voteLog = { proposal: bigint; voter: `0x${string}`; amount: bigint; blockNumber: bigint }

export default function VoteLog(params: { proposals: string[] | undefined }) {
    const [, updateState] = useState<Log[]>([])
    const forceUpdate = useCallback((log: Log[]) => updateState(log), [])

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

    // const unwatch = useContractEvent({
    useContractEvent({
        address:
            (process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_CONTRACT_ADDRESS as `0x${string}`) ?? '',
        abi: ballotABI,
        eventName: 'Vote',
        listener(log) {
            console.log('VOTE EVENT LOG: ', log)
            forceUpdate(log)
        },
        chainId: sepolia.id,
    })

    // useEffect(() => {
    //     // remove event listener on component unmount
    //     return unwatch && unwatch()
    // })

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

    if (isLoading) {
        return (
            <div className={styles.container}>
                <p>Loading Previous Votes...</p>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className={styles.container}>
                <p>Previous votes:</p>
                {voteLogs.length === 0 ? (
                    <p>No votes yet. Cast your vote now!</p>
                ) : (
                    voteLogs.map((item: voteLog, idx: number) => (
                        <div className={styles.voteLog} key={`${item.blockNumber}${idx}`}>
                            <div>
                                Proposal name:{' '}
                                {formatOptions(proposalMap.get(Number(item.proposal)))}
                            </div>
                            <div>Voter Address: {item.voter}</div>
                            <div>Vote Amount: {item.amount.toString()}</div>
                            <div>Block Number: {item.blockNumber.toString()}</div>
                        </div>
                    ))
                )}

                {/* {voteLogs.map((item: voteLog, idx: number) => (
                    <div className={styles.voteLog} key={`${item.blockNumber}${idx}`}>
                        <div>
                            Proposal name: {formatOptions(proposalMap.get(Number(item.proposal)))}
                        </div>
                        <div>Voter Address: {item.voter}</div>
                        <div>Vote Amount: {item.amount.toString()}</div>
                        <div>Block Number: {item.blockNumber.toString()}</div>
                    </div>
                ))} */}
            </div>
        )
    }

    if (isError) {
        {
            console.log('VOTE_LOG ERROR: ', error?.message)
        }
        return (
            <div className={styles.container}>
                {isError && <div>An error has occurred. Wait a moment for votes to load.</div>}
            </div>
        )
    }
}
