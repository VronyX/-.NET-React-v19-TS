interface Props {
  name: string;
  description: string;
  image?: string;
}

const Pizza = (props: Props) => {
  return (
    <div className="justify-center items-center flex flex-col leading-normal">
      <h1 className="text-[25px] font-normal text-secondary">{props.name}</h1>
      <p className="mb-1.25">{props.description}</p>
      <img
        className="max-w-50 rounded-[5px] border border-border"
        src={props.image || "https://picsum.photos/200"}
        alt={props.name}
      />
    </div>
  );
};

export default Pizza;
