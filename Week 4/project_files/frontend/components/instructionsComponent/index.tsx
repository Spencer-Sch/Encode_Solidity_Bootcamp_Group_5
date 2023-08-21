import styles from "./instructionsComponent.module.css";
import { useAccount, useBalance, useNetwork, useSignMessage } from 'wagmi'
import { useState, useEffect } from 'react'
 
export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>VoteDapp</h1>
        </div>
      </header>
      <p className={styles.get_started}>
        <PageBody></PageBody>
      </p>
    </div>
  );
}
 
function PageBody() {
  return <div>
    <WalletInfo></WalletInfo>
  </div>;
  
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected} = useAccount();
  const { chain } = useNetwork();
  if (address)
  return (
    <>
    <p>Your account address is {address}</p>
    <p>Connected to the network {chain?.name}</p>
    <WalletBalance address={address}></WalletBalance>
    <WalletAction></WalletAction>
    </>  
  );  
  if (isConnecting) 
    return (
      <>
      <p> Loading...</p>
      </>
    );
  if (isDisconnected) 
    return (
      <>
      <p> Wallet Disconnected</p>
      </>
    );
  return (
    <div>
      <p>Please connect your wallet</p>
    </div>
  );
}

function WalletBalance(params: {address: any}) {
  const { data, isError, isLoading } = useBalance({ address: params.address})
  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}
function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
  return (
    <div>
      <form>
        <label>
          Enter the message to be signed:
          <input
            type="text"
            value={signatureMessage}
            onChange={(e) => setSignatureMessage(e.target.value)}
          />
        </label>
      </form>
      <button
        disabled={isLoading}
        onClick={() =>
          signMessage({
            message: signatureMessage,
          })
        }
      >
        Sign Message
      </button>
      {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </div>
  );
}
