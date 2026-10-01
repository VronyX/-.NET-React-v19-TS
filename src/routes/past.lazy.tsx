import { useState } from "react";
import { skipToken, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import type { PastOrderDetail } from "../APIResponsesTypes";
import getPastOrders from "../api/getPastOrders";
import getPastOrder from "../api/getPastOrder";
import Modal from "../Modal";
import ErrorBoundary from "../ErrorBoundary";

const sizeTDClass = "py-3 px-3.75 text-center";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/past")({
  component: ErrorBoundaryWrappedPastOrderRoutes,
});

function ErrorBoundaryWrappedPastOrderRoutes() {
  return (
    <ErrorBoundary>
      <PastOrdersRoute />
    </ErrorBoundary>
  );
}

function PastOrdersRoute() {
  const [page, setPage] = useState(1);
  const [focusedOrder, setFocusedOrder] = useState<number>();
  const { isLoading, data } = useQuery({
    queryKey: ["past-orders", page],
    queryFn: () => getPastOrders(page),
    staleTime: 30000,
  });

  const { data: pastOrderData } = useQuery<PastOrderDetail>({
    queryKey: ["past-order", focusedOrder],
    queryFn: focusedOrder ? () => getPastOrder(focusedOrder) : skipToken,
    enabled: !!focusedOrder,
    staleTime: 24 * 60 * 60 * 1000, // one day in milliseconds,
  });

  if (isLoading) {
    return (
      <div className="min-h-162.5 max-w-225 w-[90%] my-0 mx-auto">
        <h2>LOADING …</h2>
      </div>
    );
  }
  if (!data) {
    throw new Error("Past orders could not be loaded");
  }
  return (
    <div className="min-h-162.5 max-w-225 w-[90%] my-0 mx-auto">
      <table className="w-full border-collapse my-6.25 mx-0 text-[0.9em] font-[sans-serif] sm:min-w-100 border border-[#dddddd]">
        <thead>
          <tr className="bg-secondary text-white text-left">
            <td className={sizeTDClass}>ID</td>
            <td className={sizeTDClass}>Date</td>
            <td className={sizeTDClass}>Time</td>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr
              className="border-b border-[#dddddd] even:bg-[#f6fef0] last:border-b-2 last:border-secondary"
              key={order.order_id}
            >
              <td className={sizeTDClass}>
                <button className="btn" onClick={() => setFocusedOrder(order.order_id)}>
                  {order.order_id}
                </button>
              </td>
              <td className={sizeTDClass}>{order.date}</td>
              <td className={sizeTDClass}>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-evenly">
        <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <div className="font-pacifico text-primary text-[20px]">{page}</div>
        <button className="btn" disabled={data.length < 10} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
      {focusedOrder ? (
        <Modal>
          <h2>Order #{focusedOrder}</h2>
          {pastOrderData ? (
            <table className="w-full border-collapse my-6.25 mx-0 text-[0.9em] font-[sans-serif] sm:min-w-100 border border-[#dddddd]">
              <thead>
                <tr className="bg-secondary text-white text-left">
                  <td className={sizeTDClass}>Image</td>
                  <td className={sizeTDClass}>Name</td>
                  <td className={sizeTDClass}>Size</td>
                  <td className={sizeTDClass}>Quantity</td>
                  <td className={sizeTDClass}>Price</td>
                  <td className={sizeTDClass}>Total</td>
                </tr>
              </thead>
              <tbody>
                {pastOrderData.orderItems.map((pizza) => (
                  <tr className="border-b border-[#dddddd] bg-[#f6fef0] last:border-b-2 last:border-secondary" key={`${pizza.pizzaTypeId}_${pizza.size}`}>
                    <td className={sizeTDClass}>
                      <img className="w-12.5" src={pizza.image} alt={pizza.name} />
                    </td>
                    <td className={sizeTDClass}>{pizza.name}</td>
                    <td className={sizeTDClass}>{pizza.size}</td>
                    <td className={sizeTDClass}>{pizza.quantity}</td>
                    <td className={sizeTDClass}>{intl.format(pizza.price)}</td>
                    <td className={sizeTDClass}>{intl.format(pizza.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading …</p>
          )}
          <button className="btn" onClick={() => setFocusedOrder(undefined)}>
            Close
          </button>
        </Modal>
      ) : null}
    </div>
  );
}
