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
import debounce from "lodash.debounce";

import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

import "./App.css";

function App() {
  const [cities, setCities] = useState<City[]>([]);
  const [offset, setOffset] = useState(0);
  const [fetchingCities, setFetchingCities] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setupScrollObserver();
  }, []);

  useEffect(() => {
    fetchCities();
  }, [offset]);

  useEffect(() => {
    if (!searchQuery) return;
    searchCity(searchQuery);
  }, [searchQuery]);

  const searchCity = useCallback(
    debounce((query) => {
      fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=search(ascii_name,%20%27{${query}}%27)`
      )
        .then((res) => res.json())
        .then((data) => {
          setCities(data.results);
        });
    }, 2000),
    []
  );

  function fetchCities() {
    setFetchingCities(true);
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&offset=${offset}`
    )
      .then((res) => res.json())
      .then((data: opendatasoftResponse) => {
        setCities((prev) => [...prev, ...data.results]);
      })
      .finally(() => setFetchingCities(false));
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
      <div>
        <Outlet />
      </div>
      <h1 className="text-3xl font-bold mb-8">
        All Cities with a population &gt; 1000
      </h1>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search city..."
        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-gray-500"
      />

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
                {/* /weather?lat=45.90&lon=56.78 */}
                <td>
                  <Link
                    to={`/weather?lat=${city.coordinates.lat}&lon=${city.coordinates.lon}`}
                  >
                    {city.name}
                  </Link>
                </td>
                <td>{city.cou_name_en}</td>
                <td>{city.timezone}</td>
                <td>{city.country_code}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          id="scroll-observer"
          className="flex items-center justify-center h-24"
        >
          <span className="loading loading-dots loading-lg"></span>
        </div>
      </div>
    </>
  );
}

export default App;
