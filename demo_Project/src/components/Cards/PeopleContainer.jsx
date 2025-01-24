import React, { useEffect, useState } from "react";
import Card from "./Card";

export default function PeopleContainer() {
    const [people, setPeople] = useState([]);
    const [filteredPeople, setFilteredPeople] = useState([]);

    useEffect(() => {
        fetch("https://657869f6f08799dc80453ea2.mockapi.io/persondata").then(
            (res) => res.json()).then((data) => {
                setPeople(data);
                setFilteredPeople(data);
            });
    }, []);

    const filterPeople = (filter) => {
        let filtered = people.filter((people) => people.name.toLowerCase().includes(filter.toLowerCase()));
        setFilteredPeople(filtered);
    }

    return (
        <div className="">
            <div className="fixed border mb-4 bg-white w-full h-28 p-8">
                <input className="border p-4"
                    type="text"
                    placeholder="Search"
                    onChange={(el) => {
                        console.log(el.target.value);
                        filterPeople(el.target.value);
                    }} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 pt-32">
                {filteredPeople.map(people => {
                    return <Card name={people.name} imageUri={people.avatar} title={people.jobtitle} />
                })}
            </div>
        </div>
    );
}
