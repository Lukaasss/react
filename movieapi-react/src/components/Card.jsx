import React from "react";

const Card = ({ name, imageUri, title, onClick }) => {
    return (
        <div
            className="w-56 h-80 bg-gray-800 text-white rounded-lg shadow-md p-2 cursor-pointer hover:bg-gray-700 transition duration-200"
            onClick={onClick}
        >
            <img
                src={imageUri !== "N/A" ? imageUri : "/images/placeholder.png"}
                alt={name}
                className="w-full h-64 object-cover rounded-lg"
            />
            <h2 className="mt-2 text-md font-bold text-center">{name}</h2>
            <p className="text-gray-400 text-center">{title}</p>
            { }
        </div>
    );
};

export default Card;
