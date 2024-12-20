import { Ingredient } from "@/types"
import router from "next/router";
import styles from '@/styles/Ingredienten.module.css';
import { useTranslation } from 'next-i18next';


type Props = {
    ingredienten: Array<Ingredient>;
    selectIngredient: (ingredient: Ingredient) => void;
}

const IngredientenOverzicht: React.FC<Props> = ({ ingredienten, selectIngredient }: Props) => {
    const { t } = useTranslation();
    return (
        <>
            {ingredienten && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>{t("ingredient.name")}</th>
                            <th>Type</th>
                            <th>{t("ingredient.stock")}</th>
                            <th>{t("ingredient.price")}</th>
                            <th>{t("ingredient.limit")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredienten.map((ingredient, key) => (
                            <tr key={key} onClick={() => { router.push(`/ingredienten/${ingredient.id}`); selectIngredient(ingredient) }} role="button">
                                <td>{ingredient.id}</td>
                                <td>{ingredient.naam}</td>
                                <td>{ingredient.type}</td>
                                <td>{ingredient.aantal}</td>
                                <td>{ingredient.prijs}</td>
                                <td>{ingredient.ingredientLimit}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
            )}
        </>
    );
};

export default IngredientenOverzicht;