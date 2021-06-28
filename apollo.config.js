module.exports = {
  client: {
    includes: ['./src/**/*.{tsx,ts}'],
    tagName: 'gql',
    service: {
      name: 'dics-investment-backend',
      url: 'http://localhost:4000/graphql',
    },
  },
};
