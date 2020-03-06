const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");

const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");


const q = faunadb.query;

var client = new faunadb.Client({ secret: process.env.FAUNA_KEY });

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Date

  type Query {
    Races: [Race]!
    RacesByUser: [Race]
  }
  type Race {
    id: ID!
    name: String!
    city: String
    country: String
    description: String
    image: String
    raceDate: Date
    url: String
    # createdAt: DateTime!
    # updatedAt: DateTime!
  }
  input RaceInput {
    id: ID
    name: String
    city: String
    country: String
    description: String
    image: String
    raceDate: Date
    url: String
  }

  type Mutation {
    addRace( race:RaceInput ): Race
    updateRace(id: ID!, name: String! ): Race
    deleteRace(id: ID!): Race
  }
`;

//const Races = {};
//let racesIndex = 0;
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    Races: async() => {
      const results = await client.query(
        q.Paginate(q.Match(q.Index("All_Races")))
      );
      return results.data.map(([ref, name]) => ({
        id: ref.id,
        name
      }));
    },
    RacesByUser: async (parent, args, { user }) => {
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
    addRace: async (_, { race}, { user } ) => {
        // if (!user) {
        //   throw new Error("Must be authenticated to create Races");
        // }
        const results = await client.query(
          q.Create(q.Collection("Races"), {
            data: {
              race,
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
    },

    Date: new GraphQLScalarType({
      name: "Date",
      description: "it's a date, deal with it",
      parseValue(value) {
        // value from the client
        return new Date(value);
      },
      serialize(value) {
        // value sent to the client
        return value.getTime();
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return new Date(ast.value);
        }
        return null;
      }
    })
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
