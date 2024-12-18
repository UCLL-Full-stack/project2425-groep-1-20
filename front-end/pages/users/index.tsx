import Header from "@/components/header";
import UserOverzicht from "@/components/users/UserOverzicht";
import UserService from "@/services/UserService";
import { User } from "@/types";
import Head from "next/head";
import React, { use, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '@/styles/Users.module.css';

const Users: React.FC = () => {
    const { t } = useTranslation();
    const [error, setError] = useState<String | null>(null);
    const [selectedUser, setSelectedUser] = useState<User>();

    const getUsers = async () => {
        const response = await Promise.all([
            UserService.getAllUsers()
        ]);
        const [userResponse] = response;

        if (userResponse.ok) {
            const users = await userResponse.json();
            return { users };
        } else {
            setError("You aren't authorized to view this page");
        }
    };

    const { data, isLoading } = useSWR("users", getUsers);

    useInterval(() => {
        mutate("users", getUsers());
    }, 5000);

    return (
        <>
            <Head>
                <title>Users</title>
                <meta name="description" content="BowlBuddies Pokebowl Users" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>Users</h1>
                <p className={styles.description}>Lijst van alle gebruikers</p>
                <section className={styles.section}>
                    {error && <p className="error-field">{error}</p>}
                    {isLoading && <p className="text-green-800">Loading...</p>}
                    {data && (
                        <UserOverzicht users={data.users} selectUser={setSelectedUser} />
                    )}
                </section>
            </main>
        </>
    )

};

export const getServerSideProps = async (context: { locale: any; }) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default Users