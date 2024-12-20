import UserService from "@/services/UserService";
import { Rol, StatusMessage } from "@/types";
import classNames from "classnames";
import Link from "next/link";
import router from "next/router";
import { FormEvent, useState } from "react";
import { useTranslation } from 'next-i18next';

const LoginForm: React.FC = () => {
    const [gebruikersnaam, setGebruikersnaam] = useState("");
    const [password, setPassword] = useState("");

    const [loginError, setLoginError] = useState<String | null>(null);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const { t } = useTranslation();

    const clearErrors = () => {
        setLoginError(null);
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;
        clearErrors();

        if (!gebruikersnaam || gebruikersnaam.trim() === "") {
            setLoginError("Username cannot be empty");
            result = false;
        }
        if (!password || password.trim() === "") {
            setLoginError("Password cannot be empty");
            result = false;
        }
        return result;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();

        if (!validate()) {
            return;
        }

        const response = await UserService.login({ gebruikersnaam: gebruikersnaam, wachtwoord: password });
        const result = await response.json();
        console.log(result);

        if (response.status === 200) {
            setStatusMessages([{ message: "Login succesfull", type: "success" }]);

            const user = {
                token: result.token,
                id: result.id,
                gebruikersnaam: result.gebruikersnaam,
                volledigenaam: result.volledigenaam,
                rol: result.rol,
            };

            sessionStorage.setItem("loggedInUser", JSON.stringify(user));

            setTimeout(() => {
                router.push("/users/" + result.id);
            }, 2000);
        } else {
            setStatusMessages([{ message: result.message, type: "error" }])
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
                <form onSubmit={(event) => handleSubmit(event)}>
                    {loginError && <p className="error-field">{loginError}</p>}
                    <label>{t("user.username")}:</label>
                    <input type="text" name="name" value={gebruikersnaam} onChange={(event) => setGebruikersnaam(event.target.value)} />
                    <label>{t("user.password")}:</label>
                    <input type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <input type="submit" value="Login" />
                </form>
                <p>Nog geen account? <Link href="/login/register">{t("user.register")}</Link></p>
            </div>
        </>
    );
}

export default LoginForm