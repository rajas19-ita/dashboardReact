import React, { useEffect, useState, useMemo } from "react";
import { Tooltip } from "react-tooltip";
import { max, scaleBand, scaleLinear } from "d3";

function BarChart({ width, height, setSelectedOptions }) {
    const [data, setData] = useState();
    const [xScale, setXScale] = useState();
    const [yScale, setYScale] = useState();
    const [xTicks, setXTicks] = useState();
    const [yTicks, setYTicks] = useState();

    const fetchData = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/insightT?groupBy=likelihood`
        );

        const json = await response.json();

        if (response.ok) {
            json.sort((a, b) => a.likelihood - b.likelihood);

            setData(json);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (width) {
            // Create X Scale
            const likelihood = [null, 0, 4, 3, 2, 1];
            const x = scaleBand()
                .domain(likelihood)
                .range([0, width - 50])
                .paddingInner(0.2)
                .paddingOuter(0.2);
            setXScale({ x });

            // Create data for x axis ticks using x scale
            const ticks = likelihood.map((val) => ({
                value: val === null ? "N/A" : val,
                xOffset: x(val) + x.bandwidth() / 2,
            }));

            setXTicks(ticks);
        }
    }, [width]);

    useEffect(() => {
        if (data && height) {
            // Create Y Scale
            const h = height - 50;
            const pixelsPerTick = 50;

            const y = scaleLinear()
                .domain([0, max(data, (d) => d.insightT)])
                .range([h, 0]);
            setYScale({ y });

            // Create data for Y axis Ticks using Y Scale
            const numberOfTicksTarget = Math.max(
                1,
                Math.floor(height / pixelsPerTick)
            );

            const ticks = y.ticks(numberOfTicksTarget).map((value) => ({
                value,
                yOffset: y(value),
            }));
            setYTicks(ticks);
        }
    }, [data, height]);

    return (
        <>
            <svg width={width} height={height}>
                <g transform={`translate(25,25)`}>
                    <g transform={`translate(0,${height - 50})`}>
                        <path
                            d={`M 0 0 H ${width - 50}`}
                            stroke="currentColor"
                        />
                        {xTicks
                            ? xTicks.map(({ value, xOffset }) => (
                                  <g
                                      key={value}
                                      transform={`translate(${xOffset}, 0)`}
                                  >
                                      <line y2="6" stroke="currentColor" />
                                      <text
                                          key={value}
                                          style={{
                                              fontSize: "10px",
                                              textAnchor: "middle",
                                              transform: "translateY(20px)",
                                          }}
                                      >
                                          {value}
                                      </text>
                                  </g>
                              ))
                            : null}
                    </g>
                    {xScale != undefined ? (
                        <g
                            transform={`translate(${
                                xScale.x(0) + xScale.x.bandwidth() / 2
                            },0)`}
                        >
                            <path
                                d={`M 0 0 V ${height - 50}`}
                                stroke="currentColor"
                            />
                            {yTicks
                                ? yTicks.map(({ value, yOffset }) => (
                                      <g
                                          key={value}
                                          transform={`translate(0, ${yOffset})`}
                                      >
                                          <line x2="-6" stroke="currentColor" />
                                          <text
                                              key={value}
                                              style={{
                                                  fontSize: "10px",
                                                  textAnchor: "middle",
                                                  transform:
                                                      "translate(-20px,3px)",
                                              }}
                                          >
                                              {value}
                                          </text>
                                      </g>
                                  ))
                                : null}
                        </g>
                    ) : null}
                    {data && yScale && xScale
                        ? data.map((d, i) => (
                              <rect
                                  key={i}
                                  width={xScale.x.bandwidth()}
                                  height={height - 50 - yScale.y(d.insightT)}
                                  fill="orange"
                                  x={xScale.x(d.likelihood)}
                                  y={yScale.y(d.insightT)}
                                  data-tooltip-id={`my-tooltip-${i}`}
                                  onClick={() => {
                                      console.log(d.likelihood);
                                      setSelectedOptions({
                                          likelihood: d.likelihood,
                                      });
                                  }}
                                  className=" cursor-pointer focus:outline-none"
                              />
                          ))
                        : null}
                </g>
            </svg>
            {data
                ? data.map((d, i) => (
                      <Tooltip
                          id={`my-tooltip-${i}`}
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
                                  Likelihood :{" "}
                                  {d.likelihood === null ? "N/A" : d.likelihood}
                              </span>
                              <span>Insights : {d.insightT}</span>
                          </div>
                      </Tooltip>
                  ))
                : null}
        </>
    );
}

export default BarChart;
