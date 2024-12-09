import { Ingredient } from "@/types";

const getAllIngredienten = async () => {
    const user = sessionStorage.getItem('loggedInUser');
    let token = null;

    if (user) {
        token = JSON.parse(user).token;
    }
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/ingredienten", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
};

const getIngredientById = async (id: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/ingredienten/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

const addIngredient = async (ingredient: Ingredient) => {
    const user = sessionStorage.getItem('loggedInUser');
    let token = null;

    if (user) {
        token = JSON.parse(user).token;
    }
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/ingredienten", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ingredient)
    })
}

const IngredientenService = {
    getAllIngredienten,
    getIngredientById,
    addIngredient
};

export default IngredientenService;
