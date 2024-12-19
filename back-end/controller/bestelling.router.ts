/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      Bestelling:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            datum:
 *              type: Date
 *              description: Datum van de bestelling.
 *            totaalPrijs:
 *              type: number
 *              description: Totale prijs van de bestelling.
 *            pokebowls:
 *              type: array
 *              items: 
 *                  $ref: '#/components/schemas/Pokebowl'
 *              description: Lijst van Pokebowls in de bestelling.
 */
import express, { NextFunction, Request, Response } from 'express';
import bestellingService from '../service/bestelling.service';
import { BestellingInput, Rol } from '../types';

const orderRouter = express.Router();

/**
 * @swagger
 * /bestellingen:
 *   get:
 *     summary: Get a list of all bestellingen.
 *     responses:
 *          200:
 *            description: 'list of bestellingen'
 *            content:
 *                application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Bestelling'
 * 
 */
orderRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { rol: Rol, id: number } };
        const { rol, id } = request.auth;
        console.log(id);
        const bestellingen = await bestellingService.getAllBestellingen({ rol }, { id });
        res.status(200).json(bestellingen);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /bestellingen:
 *   post:
 *     summary: Create a new bestelling
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BestellingInput'
 *     responses:
 *       200:
 *         description: The created bestelling
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bestelling'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
orderRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { rol: Rol, id: number } };
        const { rol, id } = request.auth;
        const bestelling = <BestellingInput>req.body;
        const result = await bestellingService.createBestelling({ rol }, bestelling);
        console.log(bestelling);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /bestellingen/{id}:
 *   get:
 *     summary: Get a bestelling by ID
 *     responses:
 *       200:
 *         description: The bestelling data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bestelling'
 *       404:
 *         description: Bestelling not found
 *       500:
 *         description: Internal server error
 */
orderRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bestelling = await bestellingService.getBestellingById(parseInt(req.params.id));
        res.status(200).json(bestelling);
    } catch (error) {
        next(error);
    }
});

export { orderRouter };