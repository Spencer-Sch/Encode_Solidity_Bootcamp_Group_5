import styles from './instructionsComponent.module.css'
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
