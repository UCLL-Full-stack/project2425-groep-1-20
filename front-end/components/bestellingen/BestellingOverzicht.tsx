import { Bestelling, Ingredient } from "@/types"
import { useRouter } from "next/router";
import styles from '@/styles/Bestellingen.module.css';
import { useTranslation } from 'next-i18next';
type Props = {
    bestellingen: Array<Bestelling>;
    selectBestelling: (bestelling: Bestelling) => void;
}
const BestellingenOverzicht: React.FC<Props> = ({ bestellingen, selectBestelling }: Props) => {
    const router = useRouter();
    const { t } = useTranslation();
    return (
        <>
            {bestellingen && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t("order.ordernumber")}</th>
                            <th>{t("order.name")}</th>
                            <th>{t("order.date")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bestellingen.map((bestelling, index) => (
                            <tr key={index} onClick={() => { router.push(`/bestellingen/${bestelling.id}`); selectBestelling(bestelling) }} role="button">
                                <td>#{bestelling.id}</td>
                                <td>{bestelling.user.voornaam + " " + bestelling.user.naam}</td>
                                <td>{bestelling.datum ? new Date(bestelling.datum).toLocaleDateString('nl-BE', { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : 'null'}</td>
                            </tr>
                        ))
                        }

                    </tbody>
                </table>
            )}
        </>
    );
};

export default BestellingenOverzicht;