
exports.seed = function (knex) {
  return knex('users').insert([{ username: 'notproductionready', password: 'notproductionready' }])
}
