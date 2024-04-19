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
  useEffect(() => {
    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=50`
    )
      .then((res) => res.json())
      .then((data: opendatasoftResponse) => {
        setCities(data.results);
      });
  }, []);

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
              <tr key={city.geoname_id}>
                <th>{index + 1}</th>
                <td>{city.name}</td>
                <td>{city.cou_name_en}</td>
                <td>{city.timezone}</td>
                <td>{city.country_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
