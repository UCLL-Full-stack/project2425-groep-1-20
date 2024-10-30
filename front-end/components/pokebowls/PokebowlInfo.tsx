import React from 'react';
import { Pokebowl } from '@/types';

type Props = {
    pokebowl: Pokebowl | null;
};

const PokebowlInfo: React.FC<Props> = ({ pokebowl }: Props) => {
    return (
        <>
            {pokebowl && (
                <ul>
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