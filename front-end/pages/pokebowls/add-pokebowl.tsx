import Header from "@/components/header";
import PokebowlAanmaken from "@/components/pokebowls/PokebowlAanmaken";
import IngredientenService from "@/services/IngredientService";
import Head from "next/head";
import useSWR from "swr";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from "react";

const AddNewPokebowl: React.FC = () => {
    const [error, setError] = useState<String | null>(null);
    const { t } = useTranslation();

    const getIngredienten = async () => {
        const responses = await Promise.all([
            IngredientenService.getAllIngredienten()
        ]);

        const [ingredientResponse] = responses;

        if (ingredientResponse.ok) {
            const ingredienten = await ingredientResponse.json();
            return { ingredienten }
        } else {
            setError("You aren't authorized to view this page");
        }
    }

    const { data, isLoading } = useSWR(
        "ingredienten",
        getIngredienten
    );

    return (
        <>
            <Head>
                <title>Add new pokebowl</title>
                <meta name="description" content="BowlBuddies Pokebowl Ingredienten" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>
            <Header />
            <main>
                <h1>{t("pokebowl.pokebowl")}</h1>
                <section>
                    {error && <div className="error-field">{error}</div>}
                    {isLoading && <p className="text-green-800">Loading...</p>}
                    {data && <PokebowlAanmaken ingredienten={data.ingredienten} />}
                </section>
            </main>
        </>
    )
}

export const getServerSideProps = async (context: { locale: any; }) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default AddNewPokebowl;