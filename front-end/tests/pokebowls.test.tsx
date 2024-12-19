import React from 'react';
import { Type } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import PokebowlInfo from '../components/pokebowls/PokebowlInfo';
import '@testing-library/jest-dom';

window.React = React;

const type1: Type = 'Protein';
const type2: Type = 'Topping';
const type3: Type = 'Sauce';

const pokebowls = {
    id: 1,
    naam: "Salmon pokebowl",
    type: "Salmon",
    prijs: 10.45,
    beschrijving: "Fishy salmon pokebowl with avocado and spicy mayo",
    maxAantalIngredienten: 5,
    ingredienten: [
        {
            id: 1,
            naam: 'Salmon',
            type: type1,
            aantal: 50,
            prijs: 3.61,
            ingredientLimit: 6
        },
        {
            id: 2,
            naam: 'Avocado',
            type: type2,
            aantal: 30,
            prijs: 2.78,
            ingredientLimit: 6
        }, {
            id: 3,
            naam: 'Spicy mayo',
            type: type3,
            aantal: 200,
            prijs: 1.32,
            ingredientLimit: 6
        }]

};

let pokebowlService: jest.Mock
pokebowlService = jest.fn();



test('given pokebowl, when you want to see all info of pokebowl, then view all info of pokebowl', async () => {
    render(<PokebowlInfo pokebowl={pokebowls} />);

    const naam = screen.getByText(/Naam: Salmon pokebowl/i).closest('li');
    const type = screen.getByText(/Type: Salmon/i).closest('li');
    const prijs = screen.getByText(/Prijs: €10.45/i).closest('li');
    const beschrijving = screen.getByText(/Fishy salmon pokebowl with avocado and spicy mayo/i).closest('li');

    expect(naam).toBeInTheDocument();
    expect(type).toBeInTheDocument();
    expect(prijs).toBeInTheDocument();
    expect(beschrijving).toBeInTheDocument();
});