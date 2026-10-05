import type { SyntheticEvent } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { usePlaceContactMutation } from "../api/pizzaApi";

const sizeInputClass =
  "w-full max-w-125 p-2 border-2 border-border rounded-[5px] my-3.75 focus:border-primary focus:outline-none disabled:bg-[#999] disabled:border-border";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function ContactRoute() {
  const [placeContact, { isSuccess, isLoading }] = usePlaceContactMutation();
  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    void placeContact({
      name: getString(formData, "name"),
      email: getString(formData, "email"),
      message: getString(formData, "message"),
    });
  }

  return (
    <div className="contact">
      <h2>Contact</h2>
      {isSuccess ? (
        <h3 className="font-pacifico text-secondary text-center m-12.5 text-7.5 font-normal">
          Submitted!
        </h3>
      ) : (
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <input
            className={sizeInputClass}
            name="name"
            placeholder="Name"
            disabled={isLoading}
          />
          <input
            className={sizeInputClass}
            type="email"
            name="email"
            placeholder="Email"
            disabled={isLoading}
          />
          <textarea
            className={`${sizeInputClass} min-h-50`}
            placeholder="Message"
            name="message"
            disabled={isLoading}
          ></textarea>
          <button className="btn" disabled={isLoading}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
