import { Pokebowl } from "../model/pokebowl";
import database from "../util/database";

const getAllPokebowls = async (): Promise<Pokebowl[]> => {
    try {
        const pokebowlsPrisma = await database.pokebowl.findMany({
            include: {
                ingredienten: true,
            },
        });
        console.log(pokebowlsPrisma);
        return pokebowlsPrisma.map((pokebowlPrisma) => Pokebowl.from(pokebowlPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createPokebowl = async (pokebowl: Pokebowl): Promise<Pokebowl> => {
    try {
        const prijs = pokebowl.getPrijs() ?? 0;
        const pokebowlsPrisma = await database.pokebowl.create({
            data: {
                naam: pokebowl.getNaam(),
                type: pokebowl.getType(),
                beschrijving: pokebowl.getBeschrijving(),
                prijs: prijs,
                maxAantalIngredienten: pokebowl.getMaxAantalIngredienten(),
                ingredienten: {
                    connect: pokebowl.getIngredienten().map((ingredient) => ({
                        id: ingredient.getId()
                    }))
                }
            }
        });
        return Pokebowl.from(pokebowlsPrisma);
    } catch (err) {
        console.error(err);
        throw new Error('Database error. See server logs for details.')
    }
};

const getPokebowlById = async ({ id }: { id: number }): Promise<Pokebowl | null> => {
    try {
        const pokebowlsPrisma = await database.pokebowl.findUnique({
            where: {
                id: id
            },
            include: {
                ingredienten: true
            }
        });
        if (pokebowlsPrisma == null) {
            return null;
        }
        return Pokebowl.from(pokebowlsPrisma);
    } catch (err) {
        console.error(err);
        throw new Error('Database error. See server logs for details.')
    }
}

const getPokebowlByNaam = async ({ naam }: { naam: string }): Promise<Pokebowl | null> => {
    try {
        const pokebowlsPrisma = await database.pokebowl.findUnique({
            where: {
                naam: naam
            }
        });
        if (pokebowlsPrisma == null) {
            return null;
        }
        return Pokebowl.from(pokebowlsPrisma);
    } catch (err) {
        console.error(err);
        throw new Error('Database error. See server logs for details.')
    }
}

export default {
    getAllPokebowls,
    createPokebowl,
    getPokebowlById,
    getPokebowlByNaam
}