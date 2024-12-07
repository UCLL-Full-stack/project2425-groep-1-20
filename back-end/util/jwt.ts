import jwt from 'jsonwebtoken';
import { Rol } from '../types';

const generateJwtToken = ({ gebruikersnaam, rol }: { gebruikersnaam: string; rol: Rol }): string => {

    try {
        const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'courses_app' };
        return jwt.sign({ gebruikersnaam, rol }, process.env.JWT_SECRET || "secret", options);
    } catch (error) {
        console.log(error);
        throw new Error('Error generating JWT token, see server log for details.');
    }
};

export { generateJwtToken };
