import React from "react";
import { Container, Heading, Flex } from "theme-ui";
//import { IdentityContext } from "../../identity-context";
import Header from "../components/Header"



export default props => {
 

  return (
    <Container sx={{ padding: 3 }}>
    
    <Header />

      <Flex sx={{ flexDirection: "column",marginTop: 2  }}>
        <Heading as="h3">RaceBook Home Page</Heading>
        {/* <Button
          sx={{ marginTop: 2 }}
          onClick={() => {
            netlifyIdentity.open();
          }}
        >
          Log In
        </Button> */}
      </Flex>
    </Container>
  );
};
