import React, {useEffect, useState} from "react";
import PlaceCard from "./PlaceCard";

const Places = () => {

    const [places, setPlaces] = useState([]);

    const fetchPlaces = async () => {
        try{
            const response = await fetch('/api/places', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const result = await response.json();
            if(result.success){
                console.log(result.places)
                setPlaces(result.places);
            }
            else{
                window.alert(result.message);
            }
        }
        catch(err){
            console.log(err);
            window.alert("Something went wrong");
        }
    }

    useEffect(() => {
        fetchPlaces();
    }, []);

    return (
        <div>
            <div className="places">
                {places.map(place => {
                    return <PlaceCard key={place._id} place={place} />
                })}
            </div>
        </div>
    );
}

export default Places;