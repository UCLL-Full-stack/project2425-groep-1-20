import { Pokebowl } from "@/types";

const user = sessionStorage.getItem('loggedInUser');
let token = null;

if (user) {
    token = JSON.parse(user).token;
}

const getAllPokebowls = async () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/pokebowls", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

};

const getPokebowlById = async (id: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/pokebowls/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
}

const createPokebowl = async (pokebowl: Pokebowl) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/pokebowls", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pokebowl)
    })
}

const PokebowlService = {
    getAllPokebowls,
    getPokebowlById,
    createPokebowl
};

export default PokebowlService;
