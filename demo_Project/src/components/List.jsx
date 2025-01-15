import React from "react";

const List = () => {
    const items = ["Coffee", "Tea", "Beer"];

    return (
        <div className="w-64 mx-auto">
            <h2 className="font-bold text-lg mb-2 text-center">Liste</h2>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className="bg-teal-600 text-white py-2 px-4 rounded-lg text-center transition-transform duration-200 hover:scale-105 hover:bg-teal-700"
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default List;
