import IngredientenService from "@/services/IngredientService";
import { StatusMessage, Type } from "@/types";
import classNames from "classnames";
import router from "next/router";
import { FormEvent, useState } from "react";
import { useTranslation } from 'next-i18next';

const AddIngredient: React.FC = () => {

    const [naam, setNaam] = useState("");
    const [type, setType] = useState<Type>();
    const [aantal, setAantal] = useState("");
    const [prijs, setPrijs] = useState("");

    const [naamError, setNaamError] = useState<String | null>(null);
    const [aantalError, setAantalError] = useState<String | null>(null);
    const [prijsError, setPrijsError] = useState<String | null>(null);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const { t } = useTranslation();

    const clearErrors = () => {
        setNaamError(null);
        setAantalError(null);
        setPrijsError(null);
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;
        clearErrors();

        if (!naam && naam.trim() === "") {
            setNaamError("Naam cannot be empty");
            result = false;
        }
        if (!aantal || parseInt(aantal) < 0) {
            setAantalError("Aantal cannot be empty or cannot be a negative number");
            result = false;
        }
        if (!prijs || parseFloat(prijs) < 0) {
            setPrijsError("Prijs cannot be empty or cannot be a negative number");
        }

        return result;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();

        if (!validate()) {
            return;
        }

        const response = await IngredientenService.addIngredient({ naam: naam, type: type as Type, aantal: parseInt(aantal), prijs: parseFloat(prijs) });
        const result = await response.json();

        if (response.status === 200) {
            setStatusMessages([{ message: `Ingredient ${naam} was added`, type: "success" }]);
            setTimeout(() => {
                router.push("/ingredienten");
            }, 2000);
        } else {
            setStatusMessages([{ message: result.message, type: "error" }])
        }


    };

    return (
        <>
            <div className="addForms">
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
                <form onSubmit={handleSubmit}>
                    <label>{t("ingredient.name")}:</label>
                    {naamError && <p className="error-field">{naamError}</p>}
                    <input type="text" name="name" value={naam} onChange={(event) => setNaam(event.target.value)} />
                    <label>Type:</label>
                    <select id="ingredient" name="ingredient" value={type} onChange={(event) => setType(event.target.value as Type)}>
                        <option>-- Kies een type --</option>
                        <option value="Protein">Protein</option>
                        <option value="Topping">Topping</option>
                        <option value="Sauce">Sauce</option>
                    </select>
                    <label>{t("ingredient.stock")}:</label>
                    {aantalError && <p className="error-field">{aantalError}</p>}
                    <input type="number" name="aantal" value={aantal} onChange={(event) => setAantal(event.target.value)} />
                    <label>{t("ingredient.price")}:</label>
                    {prijsError && <p className="error-field">{prijsError}</p>}
                    <input type="number" name="prijs" value={prijs} onChange={(event) => setPrijs(event.target.value)} />
                    <input type="submit" value={t("ingredient.add")} />
                </form>
            </div>
        </>
    );
}

export default AddIngredient