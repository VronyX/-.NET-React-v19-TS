import type { SubmitEvent } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import postContact from "../api/postContact";

const sizeInputClass = "w-125 p-2 border-2 border-[#999] rounded-[5px] my-3.75 focus:border-primary focus:outline-none disabled:bg-[#999]";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function ContactRoute() {
  const mutation = useMutation({
    mutationFn: function (e: SubmitEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData(e.target);
      return postContact(
        getString(formData, "name"),
        getString(formData, "email"),
        getString(formData, "message"),
      );
    },
  });

  return (
    <div className="contact">
      <h2>Contact</h2>
      {mutation.isSuccess ? (
        <h3 className="font-pacifico text-secondary text-center m-12.5 text-7.5 font-normal">Submitted!</h3>
      ) : (
        <form className="flex flex-col items-center" onSubmit={mutation.mutate}>
          <input className={`${sizeInputClass} disabled:border-[#999]`} name="name" placeholder="Name" />
          <input className={`${sizeInputClass} disabled:border-[#999]`} type="email" name="email" placeholder="Email" />
          <textarea className={`${sizeInputClass} min-h-50`} placeholder="Message" name="message"></textarea>
          <button className="btn">Submit</button>
        </form>
      )}
    </div>
  );
}