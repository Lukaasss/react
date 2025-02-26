import React from "react";

const Card = ({ name, imageUri, onClick }) => {
    return (
        <div
            className="w-56 h-80 bg-gray-800 text-white rounded-lg shadow-md p-2 cursor-pointer hover:bg-gray-700 transition duration-200 flex flex-col justify-between"
            onClick={onClick}
        >
            <img
                src={imageUri !== "N/A" ? imageUri : "/images/placeholder.png"}
                alt={name}
                className="w-full h-64 object-cover rounded-lg"
            />
            <h2 className="mt-2 text-md font-bold text-center truncate px-2">{name}</h2>
        </div>
    );
};

export default Card;