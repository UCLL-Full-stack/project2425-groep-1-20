import Ingredienten from "@/pages/ingredienten";
import PokebowlService from "@/services/PokebowlService";
import { Ingredient, Pokebowl, StatusMessage } from "@/types";
import classNames from "classnames";
import router from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from 'next-i18next';

type Props = {
    ingredienten: Array<Ingredient>;
};


const PokebowlAanmaken: React.FC<Props> = ({ ingredienten }: Props) => {
    const [naam, setNaam] = useState("");
    const [type, setType] = useState("");
    const [beschrijving, setBeschrijving] = useState("");
    const [maxAantalIngredienten, setMaxAantalIngredienten] = useState("");
    const [prijs, setPrijs] = useState<number | undefined>(undefined);
    const [selectedIngredienten, setSelectedIngredienten] = useState<Array<Ingredient>>([]);

    const [naamError, setNaamError] = useState<String | null>(null);
    const [typeError, setTypeError] = useState<String | null>(null);
    const [beschrijvingError, setBeschrijvingError] = useState<String | null>(null);
    const [maxAantalIngredientenError, setMaxAantalIngredientenError] = useState<String | null>(null);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const { t } = useTranslation();

    const clearErrors = () => {
        setNaamError(null);
        setBeschrijvingError(null);
        setTypeError(null);
        setMaxAantalIngredientenError(null);
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;
        clearErrors();

        if (!naam && naam.trim() === "") {
            setNaamError("Naam cannot be empty");
            result = false;
        }
        if (!type && type.trim() === "") {
            setTypeError("Type cannot be empty");
            result = false;
        }
        if (!beschrijving || naam.trim() === "") {
            setBeschrijvingError("Beschrijving cannot be empty");
            result = false;
        }
        if (!maxAantalIngredienten || parseInt(maxAantalIngredienten) < 0) {
            setMaxAantalIngredientenError("Max aantal ingredienten cannot be empty or cannot be a negative number");
            result = false;
        }

        return result;
    };

    const handleIngredientenChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedIngredient = parseInt(event.target.value);
        const ingredient = ingredienten.find(ingr => ingr.id === selectedIngredient);
        if (!ingredient) return;
        const updatedIngredienten = event.target.checked ? [...selectedIngredienten, ingredient] : selectedIngredienten.filter(ingr => ingr.id !== selectedIngredient);
        setSelectedIngredienten(updatedIngredienten);
        console.log(updatedIngredienten);
    }

    const handlePrijs = (event: ChangeEvent<HTMLInputElement>) => {
        const prijs = event.target.value;
        if (!prijs) {
            setPrijs(undefined);
        } else {
            setPrijs(parseFloat(prijs));
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();

        if (!validate()) {
            return;
        }

        const response = await PokebowlService.createPokebowl({ naam: naam, type: type, beschrijving: beschrijving, maxAantalIngredienten: parseInt(maxAantalIngredienten), prijs: prijs, ingredienten: selectedIngredienten });
        const result = await response.json();
        console.log(result);
        console.log({ naam: naam, type: type, beschrijving: beschrijving, maxAantalIngredienten: parseInt(maxAantalIngredienten), prijs: prijs, ingredienten: selectedIngredienten });

        if (response.status === 200) {
            setStatusMessages([{ message: `Pokebowl ${naam} is aangemaakt`, type: "success" }]);
            setTimeout(() => {
                router.push("/pokebowls");
            }, 2000);
        } else {
            setStatusMessages([{ message: result.message || "Error", type: "error" }])
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
                    <label>Pokebowl {t("pokebowl.name")}:</label>
                    {naamError && <p className="error-field">{naamError}</p>}
                    <input type="text" name="name" value={naam} onChange={(event) => setNaam(event.target.value)} />
                    <label>Pokebowl type:</label>
                    {typeError && <p className="error-field">{typeError}</p>}
                    <input type="text" name="type" value={type} onChange={(event) => setType(event.target.value)} />
                    <label>Pokebowl {t("pokebowl.description")}:</label>
                    {beschrijvingError && <p className="error-field">{beschrijvingError}</p>}
                    <input type="text" name="beschrijving" value={beschrijving} onChange={(event) => setBeschrijving(event.target.value)} />
                    <label>{t("pokebowl.max")}:</label>
                    {maxAantalIngredientenError && <p className="error-field">{maxAantalIngredientenError}</p>}
                    <input type="number" name="maxAantalIngredienten" value={maxAantalIngredienten} onChange={(event) => setMaxAantalIngredienten(event.target.value)} />
                    <label>{t("pokebowl.price")}:</label>
                    <input type="number" name="prijs" value={prijs} onChange={handlePrijs} />
                    <label>Pokebowl {t("pokebowl.ingredients")}</label>
                    {ingredienten && ingredienten.map((ingr) => (
                        <div key={ingr.id}>
                            {ingr.aantal != 0 && (
                                <input type="checkbox" value={ingr.id} onChange={handleIngredientenChange} />
                            )}
                            <label htmlFor={`ingredient-${ingr.id}`}>{ingr.naam} - {ingr.type}</label>
                        </div>
                    ))}
                    <input type="submit" value="Add Pokebowl" />
                </form>
            </div>
        </>
    );
}


export default PokebowlAanmaken;