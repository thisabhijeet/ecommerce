import Head from "next/head";
import React from "react";
import Header from "../components/Header";
import CheckoutProduct from "../components/CheckoutProduct";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "../slices/basketSlice";
import Currency from "react-currency-formatter";
import { useSession, getSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.stripe_public_key);
import axios from "axios";

function Checkout() {
  const [session] = useSession();
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  // console.log(items);
  const createCheckoutSession = async () => {
    // console.log("yes");
    const stripe = await stripePromise;
    const checkoutSession = await axios
      .post("/api/create-checkout-session", {
        items: items,
        email: session.user.email,
      })
      .catch((err) => {
        console.log(err);
        // console.log(items);
      });

    const result = await stripe
      .redirectToCheckout({
        sessionId: checkoutSession?.data.id,
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="bg-gray-100">
      <Head>
        <title>ecommerce</title>
      </Head>
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* left */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="/images/adCartPage.png"
            width="1020"
            height="250"
            objectFit="contain"
          />
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0
                ? "Your Amazon basket is empty"
                : "Shopping basket"}
            </h1>
            {items.map((item, i) => (
              <CheckoutProduct
                key={i}
                id={item.id}
                title={item.title}
                rating={item.rating}
                price={item.price}
                description={item.description}
                category={item.category}
                image={item.image}
                hasPrime={item.hasPrime}
              />
            ))}
          </div>
        </div>
        {/* right */}
        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):{" "}
                <span className="font-bold">
                  <Currency quantity={total} currency="GBP" />
                </span>
              </h2>
              <button
                role="link"
                onClick={createCheckoutSession}
                disabled={!session}
                className={`button mt-2 ${
                  !session &&
                  "from-gray-300 to-gray-600 border-gray-200 text-gray-300 active:from-gray-400"
                }`}
              >
                {!session ? "Sign in to checkout" : "Proceed to checkout"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Checkout;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
