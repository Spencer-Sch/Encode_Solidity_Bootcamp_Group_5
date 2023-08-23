import { sepolia, useContractWrite, usePrepareContractWrite } from 'wagmi'
import * as ballotJson from '@/assets/TokenizedBallot.json'
import { useState } from 'react'
import { parseUnits } from 'viem'
import { useDebounce } from '@/hooks/useDebounce'

const ballotABI = ballotJson.abi

export default function Vote(params: { address: string }) {
    const [proposition, setProposition] = useState<number>(0)
    const [amount, setAmount] = useState<bigint>(parseUnits('1', 18))

    const debouncedProposition = useDebounce(proposition)
    const debouncedAmount = useDebounce(amount)

    // function callContract() {
    const { config } = usePrepareContractWrite({
        address: '0x672721258028a7d1BB302dfBE91eEaa8Ec848Ea3',
        // address: (process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS as `0x${string}`) ?? '',
        abi: ballotABI,
        functionName: 'vote',
        // args: [0, parseUnits('1', 18)],
        args: [debouncedProposition, debouncedAmount],
        chainId: sepolia.id,
        account: params.address as `0x${string}`,
        onError(error) {
            console.log('usePrepare Error: ', error)
        },
        onSuccess(data) {
            console.log('usePrepare Success: ', data)
        },
    })

    const { data, isLoading, isSuccess, write } = useContractWrite(config)
    // }

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
        setAmount(amountBN)
    }

    return (
        <form>
            <p>Write is: {write ? 'true' : 'false'}</p>
            <p>{isLoading}</p>
            <button disabled={!write} onClick={() => write?.()}>
                Vote
            </button>
            <label htmlFor="proposals">Choose a proposal:</label>
            <select
                required
                name="proposals"
                id="proposals"
                onChange={(e) => setProposition(Number(e.target.value))}
            >
                {/* <option value="">--Choose Proposal to Vote For</option> */}
                <option value="0">Prop 0</option>
                <option value="1">Prop 1</option>
                <option value="2">Prop 2</option>
            </select>
            <label htmlFor="amount">Choose an amount to vote:</label>
            <select
                required
                name="amount"
                id="amount"
                onChange={(e) => handleAmountConversion(e.target.value)}
            >
                {/* <option value="">--Choose Vote Amount</option> */}
                <option value="one">Full Coin</option>
                <option value="half">Half Coin</option>
            </select>
            {isLoading && <div>Check Wallet</div>}
            {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
        </form>
    )
}
