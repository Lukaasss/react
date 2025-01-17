import React from "react";

const Card = () => (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
        <img className="w-full h-48 object-cover" src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" />
        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">John Doe</div>
        </div>
        <div className="px-6 pt-4 pb-2">
            <span
                className="">Archtitect </span>
            <span
                className="">& Engineer</span>
        </div>
    </div>
);

export default Card;