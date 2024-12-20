import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Ingredient } from '@/types';
import Header from '@/components/header';
import IngredientenService from '@/services/IngredientService';
import IngredientInfo from '@/components/ingredienten/IngredientInfo';
import useSWR from 'swr';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '@/styles/Ingredienten.module.css';

const IngredientId: React.FC = () => {
    const [error, setError] = useState<String | null>(null);
    const router = useRouter();
    const { ingredientId } = router.query;
    const { t } = useTranslation();

    const getIngredientById = async () => {
        setError("");
        const responses = await Promise.all([IngredientenService.getIngredientById(ingredientId as string)]);
        const [ingredientResponses] = responses;

        if (ingredientResponses.ok) {
            const ingredient = await ingredientResponses.json();
            return { ingredient }
        } else {
            setError("You aren't authorized to view this page");
        }
    }

    const { data, isLoading } = useSWR(
        ingredientId ? `ingredient-${ingredientId}` : null,
        getIngredientById
    );

    return (
        <>
            <Head>
                <title>{t("ingredient.ingredient")} info </title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>{t("ingredient.ingredient")}</h1>
                <section className={styles.section}>
                    {error && <p className="error-field">{error}</p>}
                    {isLoading && <p>Loading ingredient info...</p>}
                    {data && <IngredientInfo ingredient={data.ingredient} />}
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


export default IngredientId;