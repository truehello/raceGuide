const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const q = faunadb.query;

var client = new faunadb.Client({ secret: process.env.FAUNA_KEY });

// Construct a schema, using GraphQL schema language
const typeDefs = gql`

  type Query {
    Races: [Race]!
  }
  type Race {
    id: ID!
    name: String!
    city: String
    country: String
    description: String
    image: String
    date: String
    url: String
    # createdAt: DateTime!
    # updatedAt: DateTime!
  }
  type Mutation {
    createRace(name: String!, city: String, country:String, description:String, image: String, date:String ): Race
    updateRace(id: ID!, name: String! ): Race
    deleteRace(id: ID!): Race
  }
`;

//const Races = {};
//let racesIndex = 0;
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    Races: async (parent, args, { user }) => {
        if (!user) {
          return [];
        } else {
          const results = await client.query(
            q.Paginate(q.Match(q.Index("Race_by_User"), user))
          );
          return results.data.map(([ref, name]) => ({
            id: ref.id,
            name
          }));
        }
      }
    },
  Mutation: {
    createRace: async (_, { name, city, country, date, description, image, url}, { user } ) => {
        // if (!user) {
        //   throw new Error("Must be authenticated to create Races");
        // }
        const results = await client.query(
          q.Create(q.Collection("Races"), {
            data: {
              name,
              city,
              country,
              date,
              description,
              image,
              url,
              owner: user,         
            }
          })
        );
        return {
          ...results.data,
          id: results.ref.id
        };
      },
    updateRace: async (_, { id }, { user } ) => {
        if (!user) {
          throw new Error("Must be authenticated to insert todos");
        }
        const results = await client.query(
          q.Update(q.Ref(q.Collection("Races"), id), {
            data: {
              name
            }
          })
        );
        return {
          ...results.data,
          id: results.ref.id
        };
      }
    }
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    //this is the Lambda context
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
