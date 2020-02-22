const { ApolloServer, gql } = require("apollo-server-lambda");

//example of a query reliant on logged in user
// type Query {
// Races: async (parent, args, { user }) => {
//     if (!user) {
//       return [];
//     } else {
//       const results = await client.query(
//         q.Paginate(q.Match(q.Index("Races_by_user"), user))
//       );
//       return results.data.map(([ref, text, done]) => ({
//         id: ref.id,
//         text,
//         done
//       }));
//     }
//   }
// }
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
    //this is the Lambds context
    // we have a client context and a user context. if there is a user avaialble
    context: ({ context }) => {
      if (context.clientContext.user) {
          //if there is user available we return user id
        return { user: context.clientContext.user.sub };
      } else {
          //if not we return empty object
        return {};
      }
    },
    // By default, the GraphQL Playground interface and GraphQL introspection
    // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
    //
    // If you'd like to have GraphQL Playground and introspection enabled in production,
    // the `playground` and `introspection` options must be set explicitly to `true`.
    playground: true,
    introspection: true
  });

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});