module.exports = {
  plugins: [
    `gatsby-plugin-theme-ui`,
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] }
    }
  ]
};
