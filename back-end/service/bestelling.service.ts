import { Bestelling } from "../model/bestelling"
import { Ingredient } from "../model/ingredient";
import { Pokebowl } from "../model/pokebowl";
import { User } from "../model/user";
import bestellingDb from "../repository/bestelling.db";
import { BestellingInput, PokebowlInput, Rol } from "../types";
import userService from "./user.service";
import { UnauthorizedError } from "express-jwt";


const createBestelling = async ({ rol }: { rol: Rol }, { user, pokebowls }: BestellingInput): Promise<Bestelling> => {
    if (rol === "Klant") {
        const newUser = new User({ id: user.id, naam: user.naam, voornaam: user.voornaam, email: user.email, wachtwoord: user.wachtwoord, adres: user.adres, gebruikersnaam: user.gebruikersnaam, rol: user.rol })
        console.log(newUser);
        const bestelling = new Bestelling({
            user: newUser,
            datum: new Date(),
            pokebowls: []
        });

        pokebowls.forEach((pokebowl: PokebowlInput) => {
            const nieuwePokebowl = new Pokebowl({
                id: pokebowl.id,
                naam: pokebowl.naam,
                type: pokebowl.type,
                beschrijving: pokebowl.beschrijving,
                prijs: pokebowl.prijs,
                maxAantalIngredienten: pokebowl.maxAantalIngredienten,
                ingredienten: []
            });

            for (const ingredientInput of pokebowl.ingredienten) {
                const ingredient = new Ingredient(ingredientInput);
                nieuwePokebowl.addIngredient(ingredient);
            }

            bestelling.addPokebowl(nieuwePokebowl);
        })

        bestelling.calculateTotaalPrijs();
        bestellingDb.createBestelling(bestelling);
        return bestelling;
    } else {
        throw new UnauthorizedError("credentials_required", {
            message: "Only the customer can create orders."
        });
    }
}

const getAllBestellingen = async ({ rol }: { rol: Rol }, { id }: { id: number }): Promise<Bestelling[]> => {
    if (rol === "Admin" || rol === "Manager") {
        return bestellingDb.getAllBestellingen();
    } else {
        return userService.getUserBestellingen(id);
    }
}

const getBestellingById = async (id: number): Promise<Bestelling | null> => {
    const bestelling = bestellingDb.getBestellingById({ id: id });
    if (!bestelling) {
        throw new Error(`Bestelling with id ${id} does not exist.`);
    } else {
        return bestelling;
    }
}

export default {
    createBestelling,
    getAllBestellingen,
    getBestellingById
}