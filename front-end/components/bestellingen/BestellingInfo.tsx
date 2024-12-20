import React from 'react';
import { Bestelling } from '@/types';
import { useTranslation } from 'next-i18next';

type Props = {
    bestelling: Bestelling | null;
};

const BestellingInfo: React.FC<Props> = ({ bestelling }: Props) => {
    const { t } = useTranslation();
    return (
        <>
            {bestelling && (
                <ul>
                    <li>{t("order.ordernumber")}: {bestelling.id}</li>
                    <li>{t("order.name")}: {bestelling.user.voornaam + " " + bestelling.user.naam}</li>
                    <li>{t("order.date")}: {bestelling.datum ? new Date(bestelling.datum).toLocaleDateString('nl-BE', { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : 'null'}</li>
                    <li>{t("order.orders")}:</li>
                    {
                        bestelling.pokebowls.map((pokebowl) => (
                            <ul key={pokebowl.id}>
                                <li>{pokebowl.naam} - €{pokebowl.prijs}</li>
                            </ul>
                        ))
                    }
                    <li className='totaalPrijs'>{t("order.total")}: €{bestelling.totaalPrijs}</li>
                </ul>
            )}
        </>
    );
};

export default BestellingInfo;
