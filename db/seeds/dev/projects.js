
exports.seed = function(knex, Promise) {
  return knex('table_name').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
          knex('projects').insert({ project_name: 'Mock Project' }, 'id')
          .then(project => {
            return knex('palettes').insert([
              { palette_name: 'Monochrome 1',
                color_1: '#1E1E1F',
                color_2: '#424143',
                color_3: '#67666A',
                color_4: '#807F83',
                color_5: '#CBC9CF',
                project_id: project[0]
              }
            ])
          })
          .then(() => console.log('Seeding successful'))
          .catch(error => console.log(`Error encountered during seeding data: ${error}`))
        ])
    })
    .catch(error => console.log(`Error encountered during seeding data: ${error}`))
};
