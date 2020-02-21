const { ApolloServer, gql } = require("apollo-server-lambda");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    Races: [Race]!
  }
  type Race {
    id: ID!
    name: String!
    location: String!
    city: String
    country: String
    latitude: Int
    longitude: Int
    description: String
    image: String
    date: String
    url: String
    # createdAt: DateTime!
    # updatedAt: DateTime!
  }
  type Mutation {
    createRace(name: String!): Race
    updateRace(id: ID!): Race
    deleteRace(id: ID!): Race
  }
`;

const Races = {};
let racesIndex = 0;
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    Races: () => {
      return Object.values(Races);
    }
  },
  Mutation: {
    createRace: (_, { text }) => {
      racesIndex++;
      const id = `key-${racesIndex}`;
      Races[id] = { id, text, done: false };
      return todos[id];
    },
    updateRace: (_, { id }) => {
        Races[id].done = true;
      return races[id];
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,

  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // the `playground` and `introspection` options must be set explicitly to `true`.
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();
