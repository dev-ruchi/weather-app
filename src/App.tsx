type Coordinates = {
  lon: number;
  lat: number;
};

type City = {
  geoname_id: string;
  name: string;
  ascii_name: string;
  alternate_names: string[];
  feature_class: string;
  feature_code: string;
  country_code: string;
  cou_name_en: string;
  country_code_2: string | null;
  admin1_code: string;
  admin2_code: string;
  admin3_code: string | null;
  admin4_code: string | null;
  population: number;
  elevation: number | null;
  dem: number;
  timezone: string;
  modification_date: string;
  label_en: string;
  coordinates: Coordinates;
};

type opendatasoftResponse = {
  total_count: number;
  results: City[];
};

import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [cities, setCities] = useState<City[]>([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setupScrollObserver();
  }, []);

  useEffect(() => {
    fetchCities();
  }, [offset]);

  function fetchCities() {
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&offset=${offset}`
    )
      .then((res) => res.json())
      .then((data: opendatasoftResponse) => {
        setCities((prev) => [...prev, ...data.results]);
      });
  }

  function setupScrollObserver() {
    const el = document.querySelector("#scroll-observer");

    if (!el) return;

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;

      setOffset((prevOffset) => prevOffset + 100);
    });

    intersectionObserver.observe(el);
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">
        All Cities with a population &gt; 1000
      </h1>

      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>City</th>
              <th>Country</th>
              <th>TimeZone</th>
              <th>Country code</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => (
              <tr key={`city-${index}`}>
                <th>{index + 1}</th>
                <td>{city.name}</td>
                <td>{city.cou_name_en}</td>
                <td>{city.timezone}</td>
                <td>{city.country_code}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div id="scroll-observer"></div>
      </div>
    </>
  );
}

export default App;
