import React from 'react';
import { Bestelling, User } from '@/types';
import router from 'next/router';
import styles from '@/styles/Users.module.css';

type Props = {
    user: User | null;
    bestellingen: Array<Bestelling>;
    //selectBestelling: (bestelling: Bestelling) => void;
};

const UserInfo: React.FC<Props> = ({ user, bestellingen }: Props) => {
    return (
        <>
            <h2 className={styles.title} >Contact info</h2>
            {user && (
                <ul className={styles.userInfo}>
                    <li>Voornaam: {user.voornaam}</li>
                    <li>Achternaam: {user.naam}</li>
                    <li>Adres: {user.adres}</li>
                    <li>Email: {user.email}</li>
                    <li>Bestellingen:</li>
                    <li>
                        {bestellingen && (
                            bestellingen.map((bestelling, key) => (
                                <li key={key} onClick={() => { router.push(`/bestellingen/${bestelling.id}`) }} role='button'>{bestelling.datum ? new Date(bestelling.datum).toLocaleDateString('nl-BE', { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : bestelling.id}</li>
                            )))
                        }
                    </li>
                </ul>
            )}
        </>
    );
};

export default UserInfo;
