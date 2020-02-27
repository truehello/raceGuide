import React, { useContext } from "react";
import { Heading, Flex, NavLink } from "theme-ui";
import { Link } from "gatsby";
import { IdentityContext } from "../../identity-context";


const Header = () => {
  //const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  const { user } = useContext(IdentityContext);

  return (
    <Flex as="header" sx={{}}>
      <Heading as="h1">RaceBook</Heading>
      <Flex as="nav" sx={{ justifyContent: "flex-end", width: "100%" }}>
        <NavLink as={Link} to="/" p={2}>
          Home
        </NavLink>
        <NavLink as={Link} to={"/app"} p={2}>
          Dashboard
        </NavLink>
        {user && (
          <NavLink href="#!" p={2}>
            {user.user_metadata.full_name}
          </NavLink>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
