import Header from "@/components/header";
import PokebowlOverzicht from '@/components/pokebowls/PokebowlOverzicht';
import PokebowlService from "@/services/PokebowlService";
import { Pokebowl } from "@/types";
import Head from "next/head";
import router from "next/router";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '@/styles/Pokebowls.module.css';

const Pokebowls: React.FC = () => {
    const [error, setError] = useState<String | null>(null);
    const [selectedPokebowl, setSelectedPokebowl] = useState<Pokebowl>();
    const { t } = useTranslation();


    const getPokebowls = async () => {
        const responses = await Promise.all([
            PokebowlService.getAllPokebowls()
        ]);

        const [pokebowlResponse] = responses;

        if (pokebowlResponse.ok) {
            const pokebowls = await pokebowlResponse.json();
            return { pokebowls }
        } else {
            setError("You aren't authorized to view this page");
        }

    }
    const { data, isLoading } = useSWR(
        "pokebowls",
        getPokebowls
    );

    useInterval(() => {
        mutate("pokebowls", getPokebowls());
    }, 5000);

    return (
        <>
            <Head>
                <title>Pokebowls</title>
                <meta name="description" content="BowlBuddies Pokebowl Ingredienten" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>Pokebowls</h1>
                <p className={styles.description}>Lijst van alle pokebowls</p>
                <section className={styles.description}>
                    {error && <div className="error-field">{error}</div>}
                    {isLoading && <p className="text-green-800">Loading...</p>}
                    {data && (
                        <PokebowlOverzicht pokebowls={data.pokebowls} selectPokebowl={setSelectedPokebowl} />
                    )}
                </section>
                {!error && <button className={styles.createButton} onClick={() => { router.push(`/pokebowls/add-pokebowl`); }}>Create new pokebowl</button>}
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


export default Pokebowls