import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Pokebowl } from '@/types';
import PokebowlService from '@/services/PokebowlService';
import Header from '@/components/header';
import PokebowlInfo from '@/components/pokebowls/PokebowlInfo';
import useSWR from 'swr';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '@/styles/Ingredienten.module.css';


const PokebowlId: React.FC = () => {
    const [error, setError] = useState<String | null>(null);
    const router = useRouter();
    const { pokebowlId } = router.query;
    const { t } = useTranslation();


    const getPokebowlById = async () => {
        const responses = await Promise.all([PokebowlService.getPokebowlById(pokebowlId as string)]);
        const [pokebowlResponses] = responses;

        if (pokebowlResponses.ok) {
            const pokebowl = await pokebowlResponses.json();
            return { pokebowl }
        } else {
            setError("You aren't authorized to view this page");
        }
    }

    const { data, isLoading } = useSWR(
        pokebowlId ? `pokebowl-${pokebowlId}` : null,
        getPokebowlById
    );


    return (
        <>
            <Head>
                <title>{t("pokebowl.pokebowl")} info</title>
                <meta name="description" content="BowlBuddies Pokebowl Ingredienten" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>{t("pokebowl.pokebowl")}</h1>
                <section className={styles.section}>
                    {error && <p className="error-field">{error}</p>}
                    {isLoading && <p>Loading pokebowl info...</p>}
                    {data && <PokebowlInfo pokebowl={data.pokebowl} />}
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

export default PokebowlId;