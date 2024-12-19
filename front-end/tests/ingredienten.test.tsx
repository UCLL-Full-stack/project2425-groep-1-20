import React from 'react';
import { Type } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import IngredientInfo from '../components/ingredienten/IngredientInfo';

window.React = React;

const type1: Type = 'Protein';
const type2: Type = 'Topping';
const type3: Type = 'Sauce';

const ingredienten = [
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
    }];



test('given pokebowl, when you want to see all info of pokebowl, then view all info of pokebowl', async () => {
    render(<IngredientInfo ingredient={ingredienten[0]} />);

    const naam = screen.getByText(/Naam: Salmon/i).closest('li');
    const type = screen.getByText(/Type: Protein/i).closest('li');
    const aantal = screen.getByText(/Aantal: 200/i).closest('li');
    const prijs = screen.getByText(/Prijs: €1.32/i).closest('li');

    expect(naam).toBeInTheDocument();
    expect(type).toBeInTheDocument();
    expect(aantal).toBeInTheDocument();
    expect(prijs).toBeInTheDocument();
});