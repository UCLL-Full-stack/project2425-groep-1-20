import BestellingenOverzicht from "@/components/bestellingen/BestellingOverzicht";
import Header from "@/components/header";
import BestellingService from "@/services/BestellingService";
import { Bestelling } from "@/types";
import Head from "next/head";
import router from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { useTranslation } from 'next-i18next';
import styles from '@/styles/Bestellingen.module.css';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Bestellingen: React.FC = () => {
    const [error, setError] = useState<String | null>(null);
    const [selectedBestelling, setSelectedBestelling] = useState<Bestelling>();
    const { t } = useTranslation();

    const getBestellingen = async () => {
        const responses = await Promise.all([
            BestellingService.getAllBestellingen()
        ]);

        const [bestellingResponses] = responses;

        if (bestellingResponses.ok) {
            const bestellingen = await bestellingResponses.json();
            return { bestellingen }
        } else {
            setError("You aren't authorized to view this page");
        }
    }

    const { data, isLoading } = useSWR(
        "bestellingen",
        getBestellingen
    );

    useInterval(() => {
        mutate("bestellingen", getBestellingen());
    }, 5000);

    return (
        <>
            <Head>
                <title>Bestellingen</title>
                <meta name="description" content="BowlBuddies Pokebowl BEstellingen" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>Bestellingen</h1>
                <p className={styles.description}>Lijst van alle bestellingen</p>
                <section className={styles.section}>
                    {error && <p className="error-field">{error}</p>}
                    {isLoading && <p>Loading...</p>}
                    {data && (
                        <BestellingenOverzicht bestellingen={data.bestellingen} selectBestelling={setSelectedBestelling} />
                    )}
                    {!error && <button className={styles.createButton} onClick={() => { router.push(`/bestellingen/create-bestelling`); }}>Create new bestelling</button>}
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

export default Bestellingen