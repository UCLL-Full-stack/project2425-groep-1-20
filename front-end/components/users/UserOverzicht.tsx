import UserService from "@/services/UserService";
import { User } from "@/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from '@/styles/Users.module.css';
type Props = {
    users: Array<User>;
    selectUser: (user: User) => void;
}

const UserOverzicht: React.FC<Props> = ({ users, selectUser }: Props) => {
    const [userList, setUserList] = useState(users);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            setLoggedInUser(JSON.parse(user));
        }
    }, []);

    const handleDelete = async (id: number) => {
        if (loggedInUser?.id === id) {
            setStatusMessage("Je kunt je eigen account niet verwijderen.");
            setTimeout(() => setStatusMessage(null), 3000);
            return;
        }
        try {
            const response = await UserService.deleteUser(id);
            if (response.ok) {
                setUserList(userList.filter(user => user.id !== id)); 
                setStatusMessage("Gebruiker verwijderd");
                setTimeout(() => setStatusMessage(null), 3000);
            } else {
                console.error("Error deleting user");
            }
        } catch (error) {
            console.error("An error occurred while deleting the user:", error);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            adres: user.adres,
            email: user.email,
            rol: user.rol
        });
    };

    const handleUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!editingUser) {
            return;
        }

        try{
            const response = await UserService.updateUser(editingUser.id!, formData);
            if (response.ok) {
                const updatedUser = await response.json();
                setUserList(userList.map(user => user.id === updatedUser.id ? updatedUser : user));
                setStatusMessage(`${updatedUser.gebruikersnaam} is bijgewerkt`);
                setTimeout(() => setStatusMessage(null), 3000);
                setEditingUser(null);
            } else {
                console.error("Error updating user");
            }
        } catch (error) {
            console.error("An error occurred while updating the user:", error);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        selectUser(user);
    };

    console.log(users);
    return (
        <div className={styles.container}>
            {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
            {editingUser && (
                <form className= {styles.editForm} onSubmit={handleUpdate}>
                    <div className={styles.formGroup}>
                        <label>Adres: </label>    
                        <input type="text" name="adres" value={String(formData.adres) || ''} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email:</label>
                        <input type="email" name="email" value={String(formData.email) || ''} onChange={handleChange} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Rol:</label>
                        <select name="rol" value={formData.rol || ''} onChange={handleChange}>
                            <option value="Klant">Klant</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.saveButton}>Opslaan</button>
                        <button type="button" className={styles.cancelButton} onClick={() => setEditingUser(null)}>Annuleren</button>
                    </div>
                </form>
            )}
            {userList && (
                <div className="table-container">
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Voornaam</th>
                                <th>Achternaam</th>
                                <th>Email</th>
                                <th>Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user, index) => (
                                <tr key={index} onClick={() => { handleSelectUser(user); }} role="button">
                                    <td>{user.voornaam}</td>
                                    <td>{user.naam}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <>
                                            <button type="button" className={styles.cancelButton} onClick={(e) => { e.stopPropagation(); if (user.id !== undefined) handleDelete(user.id); }}>
                                                Verwijderen
                                            </button>
                                            <button className={styles.saveButton} onClick={(e) => { e.stopPropagation(); handleEdit(user); }}>
                                                Aanpassen
                                            </button>
                                        </>
                                    </td>                           
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedUser && (
                <div className="user-details">
                    <h2>Gebruikersdetails</h2>
                    <p><strong>Voornaam:</strong> {selectedUser.voornaam}</p>
                    <p><strong>Achternaam:</strong> {selectedUser.naam}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Adres:</strong> {selectedUser.adres}</p>
                    <p><strong>Rol:</strong> {selectedUser.rol}</p>
                </div>
            )}
        </div>
    )
};

export default UserOverzicht;