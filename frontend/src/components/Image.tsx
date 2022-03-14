interface Props {
  imageName: string;
}

export default function Image({ imageName }: Props) {
  return (
    <div className="relative w-10/12 max-h-10/12 lg:w-8/12">
      <img src={require(`../../public/images/${imageName}`)} alt="" />
    </div>
  );
}
