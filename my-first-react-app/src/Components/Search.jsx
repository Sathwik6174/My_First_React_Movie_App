import React from 'react'

// const person = {
//     name: 'Siyaram',
//     age: 19,
//     location: 'New York'
// }

// person.name , person.age, person.location are correct and can be used instead these also csn be used
// const {name,age,location } = person;

const Search = ({searchTerm, setSearchTerm}) => {
    return (
        <div className="search">
            <div>
                <img src="./search.svg" alt="search"></img>

                <input type="text"
                       placeholder="Search for any movie..."
                       value={searchTerm}
                       onChange={(e) => {
                           setSearchTerm(e.target.value)
                       }}/>
            </div>

        </div>
    )
}

export default Search
