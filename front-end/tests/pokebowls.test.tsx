import React from 'react';
import { Type } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import PokebowlOverzicht from '../components/pokebowls/PokebowlOverzicht';
import '@testing-library/jest-dom';

window.React = React;
// jest.mock('next/router', () => ({
//     useRouter: jest.fn().mockReturnValue({
//         route: '/',
//         pathname: '/',
//         query: '',
//         asPath: '/',
//     }),
// }));

const type1: Type = 'Protein';
const type2: Type = 'Topping';
const type3: Type = 'Sauce';

const pokebowls = [{
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
}, {
    id: 1,
    naam: "Tuna pokebowl",
    type: "Tuna",
    prijs: 11.67,
    beschrijving: "Fishy tuna pokebowl with corn and soya sauce",
    maxAantalIngredienten: 5,
    ingredienten: [
        {
            id: 4,
            naam: 'Tuna',
            type: type1,
            aantal: 780,
            prijs: 2.11,
            ingredientLimit: 8
        },
        {
            id: 5,
            naam: 'Corn',
            type: type2,
            aantal: 90,
            prijs: 0.97,
            ingredientLimit: 5
        }, {
            id: 6,
            naam: 'Soya',
            type: type3,
            aantal: 45,
            prijs: 0.32,
            ingredientLimit: 5
        }]
}];

let pokebowlService: jest.Mock
pokebowlService = jest.fn();
const mockSelectPokebowl = jest.fn();



test('given pokebowls, when you want to see all pokebowls, then view all pokebowls', async () => {
    render(<PokebowlOverzicht pokebowls={pokebowls} selectPokebowl={mockSelectPokebowl} />);

    expect(screen.getAllByText("Salmon pokebowl"))
    expect(screen.getAllByText("Tuna pokebowl"))
});

test('given pokebowls, when you want to see what is in the salmon pokebowl, then view all info of that pokebowl', async () => {
    render(<PokebowlOverzicht pokebowls={pokebowls} selectPokebowl={mockSelectPokebowl} />);
    const salmonPokebowl = screen.getByText("Salmon pokebowl");
    fireEvent.click(salmonPokebowl);

    expect(mockSelectPokebowl).toHaveBeenCalledWith(pokebowls[0]);
});