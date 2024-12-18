import Header from "@/components/header";
import IngredientenOverzicht from "@/components/ingredienten/IngredientenOverzicht";
import IngredientenService from "@/services/IngredientService";
import { Ingredient, User } from "@/types";
import Head from "next/head";
import router from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '@/styles/Ingredienten.module.css';

const Ingredienten: React.FC = () => {
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>();
    const [error, setError] = useState<String | null>(null);
    const { t } = useTranslation();

    const getIngredienten = async () => {
        setError("");
        const responses = await Promise.all([IngredientenService.getAllIngredienten()]);
        const [ingredientResponses] = responses;

        if (ingredientResponses.ok) {
            const ingredienten = await ingredientResponses.json();
            return { ingredienten }
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
        console.log(data);
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
            <main className={styles.main}>
                <h1 className={styles.title}>Ingredienten</h1>
                <p className={styles.description}>Lijst van alle ingredienten</p>
                <section className={styles.section}>
                    <>
                        {error && <p className="error-field">{error}</p>}
                        {isLoading && <p>Loading...</p>}
                        {data && (
                            <IngredientenOverzicht ingredienten={data.ingredienten} selectIngredient={setSelectedIngredient} />
                        )}
                        {!error && (<button className={styles.createButton} onClick={() => { router.push(`/ingredienten/add-ingredient`); }}>Add new ingredient</button>)}
                    </>
                </section>
            </main>
        </>
    );
};

export const getServerSideProps = async (context: { locale: any; }) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default Ingredienten