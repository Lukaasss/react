import React, { useEffect } from "react";
import Card from "./Card";

export default function PeopleContainer() {
    useEffect(() => {
        fetch("https://678a0fd4dd587da7ac289f1d.mockapi.io/people")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            });
    }, []);

    return (
        <div>
            <h1>People</h1>
            <div className="w-40">
                <Card name="Hans" title="CEO" imageUri="https://picsum.photos/200/300" />
                <Card name="Hans" title="CEO" imageUri="https://picsum.photos/200/300" />
                <Card name="Hans" title="CEO" imageUri="https://picsum.photos/200/300" />
            </div>
        </div>
    );
}
