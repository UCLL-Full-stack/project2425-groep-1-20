import UserService from "@/services/UserService";
import { StatusMessage } from "@/types";
import classNames from "classnames";
import router from "next/router";
import { useState } from "react";
import { useTranslation } from 'next-i18next';

const RegisterForm: React.FC = () => {
    const [naam, setNaam] = useState("");
    const [voornaam, setVoornaam] = useState("");
    const [adres, setAdres] = useState("");
    const [email, setEmail] = useState("");
    const [gebruikersnaam, setGebruikersnaam] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const { t } = useTranslation();

    const clearErrors = () => {
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;
        clearErrors();

        if (!naam || naam.trim() === "") {
            setStatusMessages([{ message: "Naam mag niet leeg zijn", type: "error" }]);
            result = false;
        }

        if (!voornaam || voornaam.trim() === "") {
            setStatusMessages([{ message: "Voornaam mag niet leeg zijn", type: "error" }]);
            result = false;
        }

        if (!adres || adres.trim() === "") {
            setStatusMessages([{ message: "Adres mag niet leeg zijn", type: "error" }]);
            result = false;
        }

        if (!email || email.trim() === "" || !/\S+@\S+\.\S+/.test(email)) {
            setStatusMessages([{ message: "Ongeldig email address", type: "error" }]);
            result = false;
        }

        if (!gebruikersnaam || gebruikersnaam.trim() === "") {
            setStatusMessages([{ message: "Gebruikersnaam mag niet leeg zijn", type: "error" }]);
            result = false;
        }

        if (!password || password.length < 8) {
            setStatusMessages([{ message: "Wachtwoord moet op zijn minst 8 karakters lang zijn", type: "error" }]);
            result = false;
        }

        if (password !== passwordRepeat) {
            setStatusMessages([{ message: "Wachtwoorden komen niet overeen", type: "error" }]);
            result = false;
        }

        return result;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();

        if (!validate()) {
            return;
        }

        const response = await UserService.register({
            naam: naam,
            voornaam: voornaam,
            adres: adres,
            email: email,
            gebruikersnaam: gebruikersnaam,
            wachtwoord: password,
        });

        const result = await response.json();
        console.log(result);

        if (response.status === 200) {
            setStatusMessages([{ message: "Registratie succesvol, log in om verder te gaan", type: "success" }]);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } else {
            setStatusMessages([{ message: result.message, type: "error" }]);
        }
    };

    return (
        <>
            <div className="addForms">
                {statusMessages && (
                    <div className="status">
                        {statusMessages.map(({ message, type }, index) => (
                            <p key={index} className={classNames({
                                "error-field": type === "error",
                                "ok-field": type === "success",
                            })}>
                                {message}
                            </p>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <label>{t("user.lastname")}:</label>
                    <input type="text" name="naam" value={naam} onChange={(event) => setNaam(event.target.value)} />
                    <label>{t("user.firstname")}:</label>
                    <input type="text" name="voornaam" value={voornaam} onChange={(event) => setVoornaam(event.target.value)} />
                    <label>{t("user.address")}:</label>
                    <input type="text" name="adres" value={adres} onChange={(event) => setAdres(event.target.value)} />
                    <label>Email:</label>
                    <input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <label>{t("user.username")}:</label>
                    <input type="text" name="gebruikersnaam" value={gebruikersnaam} onChange={(event) => setGebruikersnaam(event.target.value)} />
                    <label>{t("user.password")}:</label>
                    <input type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <label>Herhaal {t("user.password")}:</label>
                    <input type="password" name="passwordRepeat" value={passwordRepeat} onChange={(event) => setPasswordRepeat(event.target.value)} />
                    <input type="submit" value={t("user.register")} />
                </form>
            </div>
        </>
    );
}

export default RegisterForm;
