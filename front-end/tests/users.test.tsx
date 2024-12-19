import React from 'react';
import { Rol } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import UserInfo from '../components/users/UserInfo';

window.React = React;

const rol1: Rol = 'Admin';
const rol2: Rol = 'Manager';

const users = [
    { id: 1, naam: "de Weerd", voornaam: "Nina", email: "nina.deweerd@student.ucll.be", wachtwoord: "passsssssword", adres: "adresstraat 12", gebruikersnaam: "NinaW", rol: rol1 },
    { id: 2, naam: "Timmermans", voornaam: "Ashley", email: "ashley.timmermans@student.ucll.be", wachtwoord: "passwoooooord", adres: "adresstraat 1", gebruikersnaam: "AshleyT", rol: rol2 },
];


test('given user, when you want to see all info of user, then view all info of user', async () => {
    render(<UserInfo user={users[0]} bestellingen={[]} />);

    const naam = screen.getByText(/Naam: de Weerd/i).closest('li');
    const voornaam = screen.getByText(/Voornaam: Nina/i).closest('li');
    const email = screen.getByText(/Email: nina.deweerd@student.ucll.be/i).closest('li');
    const adres = screen.getByText(/Adres: adresstraat 12/i).closest('li');

    expect(naam).toBeInTheDocument();
    expect(voornaam).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(adres).toBeInTheDocument();
});

test('given other user, when you want to see all info of user, then view all info of user', async () => {
    render(<UserInfo user={users[1]} bestellingen={[]} />);

    const naam = screen.getByText(/Naam: Timmermans/i).closest('li');
    const voornaam = screen.getByText(/Voornaam: Ashley/i).closest('li');
    const email = screen.getByText(/Email: ashley.timmermans@student.ucll.be/i).closest('li');
    const adres = screen.getByText(/Adres: adresstraat 1/i).closest('li');

    expect(naam).toBeInTheDocument();
    expect(voornaam).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(adres).toBeInTheDocument();
});