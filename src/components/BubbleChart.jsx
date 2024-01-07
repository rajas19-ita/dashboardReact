import React, { useEffect, useState } from "react";

import {
    max,
    scaleLinear,
    scaleOrdinal,
    quantize,
    packSiblings,
    interpolateSpectral,
} from "d3";
import { Tooltip } from "react-tooltip";

function BubbleChart({ width, height, setSelectedOptions }) {
    const [colorG, setColorG] = useState();
    const [data, setData] = useState();
    const [chartData, setChartData] = useState();

    const fetchData = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/insightT?groupBy=intensity`
        );

        const json = await response.json();

        if (response.ok) {
            json.sort((a, b) => b.intensity - a.intensity);
            setData(json);

            // Create color generator
            setColorG({
                g: scaleOrdinal()
                    .domain(json.map((d) => d.intensity))
                    .range([
                        ...quantize(
                            (t) => interpolateSpectral(t * 0.5),
                            json.length - 1
                        ),
                        "#ccc",
                    ]),
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data && width) {
            // Create radius scale and set radius based on insightT
            const radius = scaleLinear()
                .domain([1, max(data, (d) => d.insightT)])
                // .range([15, 70]);
                .range([width * 0.0307, width * 0.1425]);

            var d = data.map((d) => ({ ...d, r: radius(d.insightT) }));

            // Set center coordinates(x and y) for each bubble
            packSiblings(d);

            // Finally set completed data for chart
            setChartData(d);
        }
    }, [data, width]);

    return (
        <>
            <svg width={width} height={height}>
                <g transform={`translate(${width / 2},${height / 2.15})`}>
                    {chartData
                        ? chartData.map((d, i) => (
                              <g transform={`translate(${d.x},${d.y})`} key={i}>
                                  <circle
                                      r={d.r}
                                      fill={colorG.g(d.intensity)}
                                  />
                                  <text
                                      textAnchor="middle"
                                      y={"5"}
                                      fontSize={13}
                                      data-tooltip-id={`my-tooltip-${d.x}-${d.y}`}
                                      className=" cursor-pointer focus:outline-none"
                                      onClick={() =>
                                          setSelectedOptions({
                                              intensity: d.intensity,
                                          })
                                      }
                                  >
                                      {d.insightT}
                                  </text>
                              </g>
                          ))
                        : null}
                </g>
            </svg>
            {chartData
                ? chartData.map((d, i) => (
                      <Tooltip
                          id={`my-tooltip-${d.x}-${d.y}`}
                          place="right-center"
                          key={i}
                      >
                          <div
                              style={{
                                  display: "flex",
                                  flexDirection: "column",
                              }}
                          >
                              <span>
                                  Intensity :{" "}
                                  {d.intensity != null ? d.intensity : "N/A"}
                              </span>
                              <span>Insights : {d.insightT}</span>
                          </div>
                      </Tooltip>
                  ))
                : null}
        </>
    );
}

export default BubbleChart;
