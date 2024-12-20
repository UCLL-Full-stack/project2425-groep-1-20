import Header from "@/components/header";
import RegisterForm from "@/components/users/RegisterForm";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import React from "react";

const Register: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t("user.register")}</title>
                <meta name="description" content="BowlBuddies Pokebowl Register" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <RegisterForm />
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

export default Register;