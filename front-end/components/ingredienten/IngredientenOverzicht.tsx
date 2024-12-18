import { Ingredient } from "@/types"
import router from "next/router";
import styles from '@/styles/Ingredienten.module.css';


type Props = {
    ingredienten: Array<Ingredient>;
    selectIngredient: (ingredient: Ingredient) => void;
}

const IngredientenOverzicht: React.FC<Props> = ({ ingredienten, selectIngredient }: Props) => {
    return (
        <>
            {ingredienten && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Naam</th>
                            <th>Type</th>
                            <th>Aantal</th>
                            <th>Prijs</th>
                            <th>Limit</th>
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