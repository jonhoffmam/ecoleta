import { Request, Response } from 'express';
import { config } from 'dotenv';
import knex from '../database/connection';

config();		
const {DB_HOST: urlPath} = process.env;		

class ItemsController {
	async index(request: Request, response: Response) {		
		const items = await knex('items').select('*');

		const serializedItems = items.map(item => {
			return {
				id: item.id,
				title: item.title,
				image_url: `http://${urlPath}:3333/uploads/${item.image}`,
			}
		});
		
		return response.json(serializedItems);
	}
}

export default ItemsController;