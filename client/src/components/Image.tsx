import React from "react";

interface Props {
  imageName: string;
}

export default function Image({ imageName }: Props) {
  return (
    <div className="flex items-center justify-center">
      <img
        src={`/api/image/${imageName}`}
        alt=""
        className="relative w-10/12 max-h-10/12 lg:w-8/12"
      />
    </div>
  );
}
