// next.config.js
module.exports = {
  images: {
    domains: ["fakestoreapi.com", "links.papareact.com"],
  },
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
  },
};
