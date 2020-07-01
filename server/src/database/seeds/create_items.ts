import Knex from 'knex';

export async function seed(knex: Knex) {
  await knex('items').insert([
    { title: 'Plástico', image: 'plastico.svg' },
    { title: 'Metais', image: 'metais.svg' },
    { title: 'Vidros', image: 'vidros.svg' },
    { title: 'Papel/Papelão', image: 'papel-papelao.svg' },
    { title: 'Lâmpadas', image: 'lampadas.svg' },
    { title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
    { title: 'Pilhas e Baterias', image: 'baterias.svg' },    
    { title: 'Resíduos Orgânicos', image: 'organicos.svg' },
    { title: 'Óleo de Cozinha', image: 'oleo.svg' },
  ]);
}