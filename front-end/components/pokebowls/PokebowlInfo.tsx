import React from 'react';
import { Pokebowl } from '@/types';
import styles from '@/styles/Ingredienten.module.css';
import { useTranslation } from 'next-i18next';

type Props = {
    pokebowl: Pokebowl | null;
};

const PokebowlInfo: React.FC<Props> = ({ pokebowl }: Props) => {
    const { t } = useTranslation();
    return (
        <>
            {pokebowl && (
                <ul className={styles.pokebowlInfo}>
                    <li>Naam: {pokebowl.naam}</li>
                    <li>Type: {pokebowl.type}</li>
                    <li>Prijs: €{pokebowl.prijs}</li>
                    <li>{pokebowl.beschrijving}</li>
                    <li>Ingredienten:</li>
                    <ul>
                        {
                            pokebowl.ingredienten.map((ingredient, key) => (
                                <li key={key}>{ingredient.naam}</li>
                            ))
                        }
                    </ul>
                </ul>
            )}
        </>
    );
};

export default PokebowlInfo;
