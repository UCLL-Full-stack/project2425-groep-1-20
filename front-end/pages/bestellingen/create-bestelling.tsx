import BestellingAanmaken from "@/components/bestellingen/BestellingAanmaken";
import Header from "@/components/header";
import PokebowlService from "@/services/PokebowlService";
import UserService from "@/services/UserService";
import { Pokebowl, User } from "@/types";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '@/styles/Bestellingen.module.css';

const createNewBestelling: React.FC = () => {
    const [error, setError] = useState<String | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);


    const fetchUserWithBestellingen = async () => {
        if (loggedInUser != undefined) {
            if (loggedInUser.rol == "Klant") {
                const [userResponses, pokebowlResponses] = await Promise.all([
                    UserService.getUserById(loggedInUser.id as unknown as string),
                    PokebowlService.getAllPokebowls()
                ]);

                if (userResponses.ok && pokebowlResponses.ok) {
                    const [user, pokebowl] = await Promise.all([
                        userResponses.json(),
                        pokebowlResponses.json(),
                    ]);
                    return { user, pokebowl };
                }
            } else {
                setError("Only the customer can create orders");
            }
        }
    }

    const { data, isLoading } = useSWR(
        loggedInUser ? "users" : null,
        fetchUserWithBestellingen);

    useEffect(() => {
        const getUser = sessionStorage.getItem("loggedInUser")
        if (getUser) {
            const parsedUser = JSON.parse(getUser);
            setLoggedInUser(parsedUser as User);
        }
    }, []);

    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>Create bestelling</title>
                <meta name="description" content="BowlBuddies Pokebowl Ingredienten" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>{t("order.order")}</h1>
                <section className={styles.section}>
                    {error && <p className="error-field">{error}</p>}
                    {isLoading && <p>Loading...</p>}
                    {!error && data?.user && data.pokebowl &&
                        <BestellingAanmaken user={data.user} pokebowls={data.pokebowl} />
                    }
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

export default createNewBestelling;