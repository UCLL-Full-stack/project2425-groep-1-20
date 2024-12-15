import Header from "@/components/header";
import IngredientenOverzicht from "@/components/ingredienten/IngredientenOverzicht";
import IngredientenService from "@/services/IngredientService";
import { Ingredient, User } from "@/types";
import Head from "next/head";
import router from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Ingredienten: React.FC = () => {
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>();
    const [error, setError] = useState<String | null>(null);

    const getIngredienten = async () => {
        setError("");
        const responses = await Promise.all([IngredientenService.getAllIngredienten()]);
        const [ingredientResponses] = responses;

        if (ingredientResponses.ok) {
            const ingredienten = await ingredientResponses.json();
            return ingredienten
        } else {
            setError("You aren't authorized to view this page");
        }
    }
    const { data, isLoading } = useSWR(
        "ingredienten",
        getIngredienten
    );

    useInterval(() => {
        mutate("ingredienten", getIngredienten());
        console.log(error + " Mooie error");
    }, 5000);

    return (
        <>
            <Head>
                <title>Ingredienten</title>
                <meta name="description" content="BowlBuddies Pokebowl Ingredienten" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>
            <Header />
            <main>
                <h1>Ingredienten</h1>
                <p>Lijst van alle ingredienten</p>
                <section>
                    <>
                        {error && <p className="error-field">{error}</p>}
                        {isLoading && <p>Loading...</p>}
                        {data && (
                            <IngredientenOverzicht ingredienten={data.ingredienten} selectIngredient={setSelectedIngredient} />
                        )}
                        {!error && (<button onClick={() => { router.push(`/ingredienten/add-ingredient`); }}>Add new ingredient</button>)}
                    </>
                </section>
            </main>
        </>
    );
};

export default Ingredienten