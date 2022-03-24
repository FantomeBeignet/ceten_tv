import React from "react";

interface Props {
  imageName: string;
}

const { REACT_APP_SERVER_IP } = process.env;

export default function Image({ imageName }: Props) {
  return (
    <div className="flex items-center justify-center">
      <img
        src={`http://${REACT_APP_SERVER_IP}:8080/api/image/${imageName}`}
        alt=""
        className="relative w-10/12 max-h-10/12 lg:w-8/12"
      />
    </div>
  );
}
