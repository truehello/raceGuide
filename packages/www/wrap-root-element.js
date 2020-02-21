const React = require("react");
const { Provider } = require("./identity-context");

module.exports = ({ element }) => (
  <Provider>
      {element}
  </Provider>
);