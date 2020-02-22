const React = require("react");
const {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache
} = require("@apollo/client");

//use this context to set authentication link that we pass to apollo client
const { setContext } = require("apollo-link-context");
const netlifyIdentity = require("netlify-identity-widget");

const wrapRootElement = require("./wrap-root-element");

//use setcontext to get the headers
const authLink = setContext((_, { headers }) => {
//becasue this link is fired on every request we can use Netlif identity user object
  const user = netlifyIdentity.currentUser();
  const token = user.token.access_token;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
        //spread any headers that already exist into headers object
      ...headers,
      // set up our on authorization header. if we have a token we set the bearer token of it is blank
      Authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const httpLink = new HttpLink({
  uri: "https://raceguide.netlify.com/.netlify/functions/graphql"
});

//send the client the concatenated authlink with the http link to the api
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
});

exports.wrapRootElement = ({ element }) => {
  return (
    <ApolloProvider client={client}>
      {wrapRootElement({ element })}
    </ApolloProvider>
  );
};
