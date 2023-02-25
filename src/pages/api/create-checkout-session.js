const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
  const { items, email } = req.body;
  // const images = JSON.stringify(items.map((item) => item.image));
  // console.log(images);
  // console.log(items);
  // console.log(email);
  const transformedItems = items.map((item) => ({
    quantity: 1,
    price_data: {
      currency: "gbp",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [item.image],
        description: item.description,
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: transformedItems,
    payment_method_types: ["card"],
    shipping_options: [{ shipping_rate: "shr_1Mf0PtSDDTKwOHgpHRLyQBKW" }],
    shipping_address_collection: {
      allowed_countries: ["GB", "US", "CA", "IN"],
    },
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(items.map((item) => item.image)),
    },
  });

  res.status(200).json({ id: session.id });
}
