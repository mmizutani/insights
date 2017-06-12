module.exports = function () {
  const app = this // eslint-disable-line no-unused-vars

  const { database, config } = require('../../../config/insights')

  const getStructure = require('../insights/structure')
  const createAdapter = require('../insights/adapter')
  const Results = require('../insights/results')

  const structure = getStructure(config)
  const adapter = createAdapter(database)

  app.use('/api/structure', {
    find (params) {
      return Promise.resolve(structure)
    }
  })

  app.use('/api/results', {
    find (params) {
      const results = new Results({ params: params.query, adapter, structure })
      return results.getResponse()
    }
  })

  app.use('/api/dashboards', {
    find (params) {
      return Promise.resolve({})
    }
  })
}