import { useState, useEffect } from "react";
import countryService from "./services/countries.js";
import "./App.css";

const CountriesList = ({ countries, showClick }) => {
  return (
    <ul>
      {countries.map((country) => (
        <li key={country.cca3}>
          {country.name.common}{" "}
          <button value={country.cca3} onClick={showClick}>
            Show
          </button>
        </li>
      ))}
    </ul>
  );
};

const CountryData = ({ country }) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>Capital: {country.capital}</div>
      <div>Área: {country.area}</div>
      <div>
        <b>Idiomas:</b>
        <ul>
          {Object.keys(country.languages).map((key) => {
            return <li key={key}>{country.languages[key]}</li>;
          })}
        </ul>
      </div>
      <div>
        <img src={country.flags.png} />
      </div>
    </>
  );
};

function App() {
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setSelectedCountry("");
  };

  const handleShowClick = (event) => {
    console.log(event.target.value);
    setSelectedCountry(event.target.value);
  };

  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const countriesToShow =
    filter.length == 0
      ? countries
      : countries.filter((country) => {
          return country.name.common.includes(filter);
        });

  useEffect(() => {
    if (countries.length == 0) {
      countryService.getAll().then((response) => setCountries(response));
    }
  });

  return (
    <>
      <div>
        Find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      <div>
        {countriesToShow.length >= 10 ? (
          "Too many matches, specify abother filter"
        ) : countriesToShow.length == 1 ? (
          <CountryData country={countriesToShow[0]} />
        ) : selectedCountry !== "" ? (
          <CountryData
            country={countries.find(
              (country) => country.cca3 == selectedCountry
            )}
          />
        ) : (
          <CountriesList
            countries={countriesToShow}
            showClick={handleShowClick}
          />
        )}
      </div>
    </>
  );
}

export default App;
