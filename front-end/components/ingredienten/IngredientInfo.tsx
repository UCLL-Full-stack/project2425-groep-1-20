import React, { FormEvent, useState } from 'react';
import { Ingredient, StatusMessage } from '@/types';
import IngredientenService from '@/services/IngredientService';
import router from 'next/router';
import classNames from 'classnames';
import styles from '@/styles/Ingredienten.module.css';


type Props = {
    ingredient: Ingredient | null;
};

const IngredientInfo: React.FC<Props> = ({ ingredient }: Props) => {
    const [limit, setLimit] = useState<number>(ingredient?.ingredientLimit as number);
    const [aantalError, setAantalError] = useState<String | null>(null);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

    const clearErrors = () => {
        setAantalError(null);
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;
        clearErrors();

        if (!limit || limit < 0) {
            setAantalError("Aantal cannot be empty or cannot be a negative number");
            result = false;
        }

        return result;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();

        if (!validate()) {
            return;
        }

        const response = await IngredientenService.updateIngredient(ingredient?.id ?? 0, { naam: ingredient?.naam ?? '', type: ingredient?.type ?? "Topping", aantal: ingredient?.aantal ?? 0, prijs: ingredient?.prijs ?? 0, ingredientLimit: limit });
        const result = response.json();

        if (response.status === 200) {
            setStatusMessages([{ message: `Ingredient ${ingredient?.naam} is aangepast`, type: "success" }]);
            setTimeout(() => {
                router.push("/ingredienten");
            }, 2000);
        } else {
            setStatusMessages([{ message: "Error", type: "error" }])
        }


    };

    return (
        <>
            {statusMessages && (
                <div className="status">
                    {statusMessages.map(({ message, type }, index) => (
                        <p key={index} className={classNames({
                            "error-field": type === "error",
                            "ok-field": type === "success",
                        })}>
                            {message}
                        </p>
                    ))}
                </div>
            )}
            {ingredient && (
                <ul className={styles.ingredientInfo}>
                    <li>ID: {ingredient.id}</li>
                    <li>Naam: {ingredient.naam}</li>
                    <li>Type: {ingredient.type}</li>
                    <li>Aantal: {ingredient.aantal}</li>
                    <li>Prijs: {ingredient.prijs}</li>
                    <form onSubmit={handleSubmit}>
                        {aantalError && <p className="error-field">{aantalError}</p>}
                        <li>Ingredienten limit:</li>
                        <input type='number' placeholder={ingredient.ingredientLimit?.toString()} value={limit} onChange={(event) => setLimit(parseInt(event.target.value))} />
                        <input type='submit' value="Update aantal" />
                    </form>
                </ul>
            )}
        </>
    );
};

export default IngredientInfo;
