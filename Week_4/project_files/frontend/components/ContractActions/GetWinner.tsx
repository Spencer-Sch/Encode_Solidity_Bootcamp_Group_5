import { sepolia, useContractRead } from 'wagmi'
import { hexToString } from 'viem'
import { useState } from 'react'
import styles from './styles/getWinner.module.css'
import * as ballotJson from '@/assets/TokenizedBallot.json'

const ballotABI = ballotJson.abi

export default function GetWinner() {
    const [winnerName, setWinnerName] = useState<`0x${string}`>()

    const { data, isError, error, isLoading, refetch } = useContractRead({
        address:
            (process.env.NEXT_PUBLIC_TOKENIZED_BALLOT_CONTRACT_ADDRESS as `0x${string}`) ?? '',
        abi: ballotABI,
        functionName: 'winnerName',
        chainId: sepolia.id,
        onError(error) {
            // console.log('useRead WINNER_NAME Error: ', error)
        },
        onSuccess(data: `0x${string}`) {
            // console.log('useRead WINNER_NAME Error: ', data)
        },
    })

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
                refetch()
                    .then((res) => typeof res.data === 'string' && setWinnerName(res.data))
                    .catch((error) => console.log('GetWinner refetch error: ', error))
            }}
        >
            <button type="submit" disabled={isLoading}>
                Get Winner Name
            </button>
            {winnerName && (
                <div>
                    <p>The Winning Proposal Is:</p>
                    <p>
                        &#127881;
                        {winnerName && formatOptions(hexToString(winnerName!, { size: 32 }))}
                        &#127881;
                    </p>
                </div>
            )}
            {isError && <div>Error: {error?.message}</div>}
        </form>
    )
}
