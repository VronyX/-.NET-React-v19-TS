import { createLazyFileRoute, Link } from "@tanstack/react-router";

const sizeListClass = "w-full max-w-62.5 text-center";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto my-30 max-w-175 grid sm:grid-cols-2 sm:grid-cols-[1fr_1fr] gap-7.5">
      <div className="flex flex-col items-center justify-center sm:items-start">
        <h1 className="text-primary font-pacifico font-normal">Padre Gino's</h1>
        <p className="text-secondary font-bold text-[40px] uppercase max-w-78.75">
          Pizza & Art at a location near you
        </p>
      </div>
      <ul className="flex flex-col items-center justify-center">
        <li className={sizeListClass}>
          <Link className={`${sizeListClass} mb-[10px] btn`} to="/order">
            Order
          </Link>
        </li>
        <li className={sizeListClass}>
          <Link className={`${sizeListClass} mb-[10px] btn`} to="/past">
            Past Orders
          </Link>
        </li>
        <li className={sizeListClass}>
          <Link className={`${sizeListClass} mb-[10px] btn`} to="/contact">
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
}
