import React, { useState, useEffect } from "react";

import {
    geoMercator,
    geoPath,
    scaleSequential,
    interpolateRgb,
    extent,
} from "d3";
import { Tooltip } from "react-tooltip";

function WorldMap({ width, height, data, setSelectedOptions }) {
    const [pathG, setPathG] = useState();
    const [colorG, setColorG] = useState();
    const [data1, setData1] = useState();

    useEffect(() => {
        const projection = geoMercator().fitSize([width, height], data);

        const g = geoPath().projection(projection);
        setPathG({ g });
    }, [width, height]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/insightT?groupBy=country`
        );

        const json = await response.json();

        if (response.ok) {
            json.sort((a, b) => b.insightT - a.insightT);

            json.splice(0, 1);
            setData1(json);

            setColorG({
                g: scaleSequential(interpolateRgb("#fee08b", "#8b0000")).domain(
                    extent(json, (d) => d.insightT)
                ),
            });
        }
    };
    const getColorForCountry = (countryName) => {
        const d = data1.find((d) => d.country === countryName);

        return d ? colorG.g(d.insightT) : "white";
    };

    return (
        <>
            <svg width={width} height={height}>
                {data && pathG && colorG
                    ? data.features.map((d, i) => (
                          <g key={i}>
                              <path
                                  d={pathG.g(d)}
                                  stroke="#808080"
                                  fill={getColorForCountry(d.properties.name)}
                                  strokeWidth={0.5}
                                  data-tooltip-id={`my-tooltip-${d.properties.name}`}
                                  className="cursor-pointer focus:outline-none"
                                  onClick={() =>
                                      setSelectedOptions({
                                          country: d.properties.name,
                                      })
                                  }
                              />
                          </g>
                      ))
                    : null}
            </svg>
            {data1
                ? data1.map((d, i) => (
                      <Tooltip
                          id={`my-tooltip-${d.country}`}
                          place="right-center"
                          key={i}
                      >
                          <div
                              style={{
                                  display: "flex",
                                  flexDirection: "column",
                              }}
                          >
                              <span>Country : {d.country}</span>
                              <span>Insights : {d.insightT}</span>
                          </div>
                      </Tooltip>
                  ))
                : null}
        </>
    );
}

export default WorldMap;
