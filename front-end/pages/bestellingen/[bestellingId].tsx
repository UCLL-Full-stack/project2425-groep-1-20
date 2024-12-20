import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import BestellingService from '@/services/BestellingService';
import BestellingInfo from '@/components/bestellingen/BestellingInfo';
import useSWR from 'swr';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '@/styles/Bestellingen.module.css';

const BestellingId: React.FC = () => {
    const [error, setError] = useState<String | null>(null);
    const router = useRouter();
    const { bestellingId } = router.query;
    const { t } = useTranslation();

    const getBestellingById = async () => {
        const responses = await Promise.all([BestellingService.getBestellingentById(bestellingId as string)]);
        const [bestellingResponses] = responses;

        if (bestellingResponses.ok) {
            const bestelling = await bestellingResponses.json();
            return { bestelling }
        } else {
            setError("You aren't authorized to view this page");
        }
    }

    const { data, isLoading } = useSWR(
        bestellingId ? `bestelling-${bestellingId}` : null,
        getBestellingById
    );

    return (
        <>
            <Head>
                <title>{t("order.order")} info </title>
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>{t("order.order")}</h1>
                <section className={styles.section}>
                    {error && <p className="error-field">{error}</p>}
                    {isLoading && <p>Loading bestelling info...</p>}
                    {bestellingId && <BestellingInfo bestelling={data?.bestelling} />}
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


export default BestellingId;