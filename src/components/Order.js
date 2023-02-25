import React from "react";
import moment from "moment";
import Currency from "react-currency-formatter";

function Order({ id, amount, amountShipping, items, timestamp, images }) {
  return (
    <div className="relative border rounded-md">
      <div className="flex items-center space-x-10 p-10 bg-gray-100 text-sm text-gray-600">
        <div>
          <p className="font-bold text-xs">ORDERS PLACED</p>
          <p>{moment.unix(timestamp).format("DD MM YYYY")}</p>
        </div>

        <div>
          <p className="text-xs font-bold">TOTAL</p>
          <p>
            <Currency quantity={amount} currency="GBP" /> - Next Day Delivery{" "}
            <Currency quantity={amountShipping} currency="GBP" />
          </p>
        </div>
        <div className="flex-1">
          <p className="text-xl whitespace-nowrap text-right text-blue-500">
            {items.length} items
          </p>
        </div>

        <p className="absolute top-2 right-2 w-40 lg:w-72 truncate text-xs whitespace-nowrap">
          Order #{id}
        </p>
      </div>
      <div className="p-5 sm:p-10">
        <div className="flex space-x-6 overflow-x-auto">
          {images.map((image, i) => (
            <img
              key={i}
              src={image}
              alt=""
              className="h-20 object-contain sm:h-32"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Order;
