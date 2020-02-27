import React, { useContext } from "react";
import { Router } from "@reach/router";
import { Container, Flex, Heading, Button } from "theme-ui";
import { IdentityContext } from "../../identity-context";
import Header from "../components/Header"
import CreateRace from "../components/CreateRace"

let Dash = () => {
  const { user } = useContext(IdentityContext);

  return (
    <Container sx={{ padding: 3 }}>
        <Header />
  
      <Flex sx={{ flexDirection: "column", padding: 3, alignItems:"center" }}>
      <Heading as="h1">DashBoard</Heading>
     
      <span>Hi {user && user.user_metadata.full_name}, do you want to add a new race?</span>
      <CreateRace />
      </Flex>


    </Container>
  );
};

let DashLoggedOut = props => {
  const { identity: netlifyIdentity } = useContext(IdentityContext);

  return (
    <Flex sx={{ flexDirection: "column", padding: 3 }}>
      <Heading as="h1">RaceBook</Heading>
      <Button
        sx={{ marginTop: 2 }}
        onClick={() => {
          netlifyIdentity.open();
        }}
      >
        Log In
      </Button>
    </Flex>
  );
};

export default props => {
  const { user } = useContext(IdentityContext);

  if (!user) {
    return (
      <Router>
        <DashLoggedOut path="/app" />
      </Router>
    );
  }
  return (
    <Router>
      <Dash path="/app" />
    </Router>
  );
};