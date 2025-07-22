import { formatAmount } from '../lib/utils'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const BankCard = ({ account, userName }: CreditCardProps) => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <div className="flex flex-col">
            <Link to="/" className="bank-card">
                <div className="bank-card_content">
                    <div>
                        <h1 className="text-16 font-semibold text-white">
                            {account.name || userName}
                        </h1>
                        <p className="font-ibm-plex-serif font-black text-white">
                            {isClient ? formatAmount(account.currentBalance, navigator.language) : '...'}
                        </p>
                    </div>

                    <article className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <h1 className="text-12 font-semibold text-white">
                                {userName}
                            </h1>
                            <h2 className="text-12 font-semibold text-white">
                                ●● / ●●
                            </h2>
                        </div>
                        <p className="text-14 font-semibold tracking-[1.1px] text-white">
                            ●●●● ●●●● ●●●● <span className="text-16">{account.mask || 1234}</span>
                        </p>
                    </article>
                </div>

                <div className="bank-card_icon">
                    <img
                        src="/icons/Paypass.svg"
                        width={20}
                        height={24}
                        alt="pay"
                    />
                    <img
                        src="/icons/mastercard.svg"
                        width={45}
                        height={32}
                        alt="mastercard"
                        className="ml-5"
                    />
                </div>

                <img
                    src="/icons/lines.png"
                    width={316}
                    height={190}
                    alt="lines"
                    className="absolute top-0 left-0"
                />
            </Link>
        </div>
    )
}

export default BankCard