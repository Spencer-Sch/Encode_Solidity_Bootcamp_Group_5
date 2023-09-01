import { useAccount, useContractRead, sepolia } from 'wagmi'
import { hexToString } from 'viem'
import RequestTokens from './RequestTokens'
import Vote from './Vote'
import Delegate from './Delegate'
import styles from './styles/myTokenContractActions.module.css'
import VoteLog from './VoteLog'
import GetWinner from './GetWinner'
import * as ballotJson from '@/assets/TokenizedBallot.json'

const ballotABI = ballotJson.abi

export default function () {
    const { address, isConnecting, isDisconnected } = useAccount()

    const {
        data,
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
            // console.log('useRead PROPOSALS Error: ', error)
        },
        onSuccess(data) {
            // console.log('useRead PROPOSALS Error: ', data)
        },
    })

    const proposals = data?.map((item) => hexToString(item.name, { size: 32 }))

    if (address)
        return (
            <div className={styles.container}>
                <RequestTokens address={address}></RequestTokens>
                <Delegate address={address}></Delegate>
                <Vote address={address} proposals={proposals}></Vote>
                <GetWinner></GetWinner>
                <VoteLog proposals={proposals}></VoteLog>
            </div>
        )

    if (isConnecting)
        return (
            <>
                <p>Loading Contract Actions...</p>
            </>
        )
    if (isDisconnected)
        return (
            <>
                <p>No Contract Actions Available</p>
            </>
        )
}
