import React from "react";
import Head from "next/head";
import { CheckCircleIcon } from "@heroicons/react/solid";
import Header from "../components/Header";
import { useRouter } from "next/router";

function Success() {
  const router = useRouter();
  return (
    <div className="bg-gray-100 h-screen">
      <Head>
        <title>ecommerce</title>
      </Head>
      <Header />
      <main className="max-w-screen-lg mx-auto">
        <div className="flex flex-col p-10 bg-white">
          <div className="flex items-center mb-5 space-x-2">
            <CheckCircleIcon className="text-green-500 h-10" />
            <h1 className="text-3xl">
              Thanks you, Your order has been confirmed!
            </h1>
          </div>
          <p>
            Thank you for shopping with us. We will send you a confirmation once
            the item has been shipped. If you would like to check the status of
            your orders, please click the link below.
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="button mt-8"
          >
            Go to my orders
          </button>
        </div>
      </main>
    </div>
  );
}

export default Success;
