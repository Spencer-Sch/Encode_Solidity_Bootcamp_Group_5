import styles from './instructionsComponent.module.css'
import { useAccount, useBalance, useNetwork, useSignMessage } from 'wagmi'
import { useState, useEffect } from 'react'
import * as myTokenJson from '@/assets/MyToken.json'
import WalletInfo from '../WalletComponents/WalletInfo'
import MyTokenContractActions from '../ContractActions/MyTokenContractActions'

export default function InstructionsComponent() {
    return (
        <div className={styles.container}>
            <header className={styles.header_container}>
                <div className={styles.header}>
                    <h1>VoteDapp</h1>
                </div>
            </header>
            <div className={styles.get_started}>
                <PageBody></PageBody>
            </div>
        </div>
    )
}

function PageBody() {
    return (
        <div>
            <WalletInfo></WalletInfo>
            <MyTokenContractActions></MyTokenContractActions>
        </div>
    )
}

// function WalletAction() {
//   const [signatureMessage, setSignatureMessage] = useState("");

//   const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
//   return (
//     <div>
//       <form>
//         <label>
//           Enter the message to be signed:
//           <input
//             type="text"
//             value={signatureMessage}
//             onChange={(e) => setSignatureMessage(e.target.value)}
//           />
//         </label>
//       </form>
//       <button
//         disabled={isLoading}
//         onClick={() =>
//           signMessage({
//             message: signatureMessage,
//           })
//         }
//       >
//         Sign Message
//       </button>
//       {isSuccess && <div>Signature: {data}</div>}
//       {isError && <div>Error signing message</div>}
//     </div>
//   );
// }
