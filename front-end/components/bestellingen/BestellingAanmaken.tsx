import BestellingService from "@/services/BestellingService";
import { Pokebowl, StatusMessage, User } from "@/types";
import classNames from "classnames";
import router from "next/router";
import { FormEvent, useState } from "react";
import styles from '@/styles/Bestellingen.module.css';
type Props = {
    user: User;
    pokebowls: Array<Pokebowl>;
};


const BestellingAanmaken: React.FC<Props> = ({ user: user, pokebowls: pokebowls }: Props) => {
    let [standardPrijs, setStandardPrijs] = useState<number>(0);
    const [totaalPrijs, setTotaalPrijs] = useState<number>();
    const [selectedPokebowls, setSelectedPokebowls] = useState<Array<Pokebowl>>([]);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

    const clearErrors = () => {
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;
        clearErrors();

        return result;
    };

    const handlePokebowls = (event: any) => {
        console.log(user.id);
        const selectedPokebowl = parseInt(event.target.value);
        const pokebowl = pokebowls.find(pokebowl => pokebowl.id === selectedPokebowl);

        console.log(pokebowl);

        if (!pokebowl) return;

        const getAllPokebowls = [...selectedPokebowls, pokebowl];
        setSelectedPokebowls(getAllPokebowls);
        setTotaalPrijs(standardPrijs += pokebowl.prijs || 0);
        setStandardPrijs(standardPrijs += pokebowl.prijs || 0);
        console.log(getAllPokebowls);
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();

        if (!validate()) {
            return;
        }

        const response = await BestellingService.createBestelling({ user: user, pokebowls: selectedPokebowls });
        const result = await response.json();
        console.log(result);
        console.log({ user: user, pokebowls: selectedPokebowls });

        if (response.status === 200) {
            setStatusMessages([{ message: `Bestelling is aangemaakt`, type: "success" }]);
            setTimeout(() => {
                router.push("/bestellingen");
            }, 2000);
        } else {
            setStatusMessages([{ message: result.message, type: "error" }])
        }


    };
    
    return (
        <>
            {statusMessages.length > 0 && (
                <div className={styles.statusMessages}>
                    {statusMessages.map(({ message, type }, index) => (
                        <p 
                            key={index} 
                            className={classNames(styles.statusMessage, {
                                [styles.errorField]: type === "error",
                                [styles.successField]: type === "success",
                            })}
                        >
                            {message}
                        </p>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                <p className={styles.userName}>{user.gebruikersnaam}</p>
                <div className={styles.formGroup}>
                    <label htmlFor="pokebowls">Pokebowls</label>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Naam</th>
                                <th>Actie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pokebowls.map((pokebowl) => (
                                <tr key={pokebowl.id}>
                                    <td>{pokebowl.naam}</td>
                                    <td>
                                        <button 
                                            type="button" 
                                            value={pokebowl.id} 
                                            onClick={handlePokebowls}
                                            className={styles.addButton}
                                        >
                                            Toevoegen
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className={styles.totalPrice}>Totaal prijs: {totaalPrijs?.toFixed(2) || 0}</p>
                <div className={styles.formGroup}>
                    <label htmlFor="selectedPokebowls">Bestelling:</label>
                    <table className={styles.table}>
                        <tbody>
                            {selectedPokebowls && selectedPokebowls.map((pokebowl) => (
                                <tr key={pokebowl.id}>
                                    <td>{pokebowl.naam}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <input 
                    type="submit" 
                    value="Bestelling plaatsen" 
                    className={styles.submitButton} 
                />
            </form>
        </>
    ); 
};


export default BestellingAanmaken;