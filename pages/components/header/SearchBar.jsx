import {useState, useEffect} from "react";

export default function SearchBar() {

    const [search, setSearch] = useState("");

    useEffect(() => {
        setTimeout(() => {
            
        }, 500);
    }, [search]
)

    return <input type="text" id="searchBar" onChange={(e) => setSearch(e.target.value)} value={search}/>
}