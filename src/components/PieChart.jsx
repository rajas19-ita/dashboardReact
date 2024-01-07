import React, { useEffect, useState, useMemo, useRef } from "react";

import { pie, scaleOrdinal, arc, quantize, interpolateHsl } from "d3";

import { FaAngleLeft } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

function PieChart({ category, width, height, setSelectedOptions }) {
    const arcPath = useMemo(() => {
        let r = (width / 1.7) * 0.4;
        return arc().outerRadius(r).innerRadius(0);
    }, [width]);

    const threshold = 80;
    const [angData, setAngData] = useState();
    const [colorG, setColorG] = useState({});
    const [other, setOther] = useState();
    const [feedHeading, setFeedHeading] = useState();
    const [feedContent, setFeedContent] = useState();
    const [feedColor, setFeedColor] = useState("lightblue");
    const [sectName, setSectName] = useState();

    const mergeSmallSections = (data) => {
        // Filter out sections with <=threshold insights and sort desc
        const smallerSections = data
            .filter((d) => d.insightT <= threshold)
            .sort((a, b) => b.insightT - a.insightT);
        setFeedHeading("other");
        setFeedColor("lightblue");
        setOther(smallerSections);
        setFeedContent(smallerSections);

        // Add all the smaller sections to create one "Others" section
        const sumOfOthers = smallerSections.reduce(
            (total, d) => total + d.insightT,
            0
        );

        // Sort data with insights >threshold in desc
        const sortedData = [...data.filter((d) => d.insightT > threshold)].sort(
            (a, b) => b.insightT - a.insightT
        );

        //return combined data
        return [...sortedData, { insightT: sumOfOthers, [category]: "other" }];
    };

    const fetchData = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/insightT?groupBy=${category}`
        );

        const json = await response.json();

        if (response.ok) {
            // Function call to merge smaller sections
            const data = mergeSmallSections(json);

            // Create data for all pie (start and end angles)
            const pieG = pie()
                .sort(null)
                .value((d) => d.insightT);
            setAngData(pieG(data));

            // Create color generator
            setColorG({
                g: scaleOrdinal()
                    .domain(data.map((d) => d[category]))
                    .range(
                        quantize(
                            interpolateHsl("#278bce", "lightblue"),
                            data.length
                        )
                    ),
            });
        }
    };
    const fetchTopics = async (sectName) => {
        const response = await fetch(
            `${
                import.meta.env.VITE_API_URL
            }/insightT?groupBy=topic&match=${encodeURIComponent(
                JSON.stringify({
                    category,
                    value: sectName,
                })
            )}`
        );

        const json = await response.json();

        if (response.ok) {
            return json;
        }
    };

    const setupFeed = (sectName, inside) => {
        if (sectName === "other") {
            setFeedHeading("other");
            setFeedContent(other);
            setFeedColor("lightblue");
        } else {
            setSelectedOptions({
                [category]: sectName,
            });

            fetchTopics(sectName).then((data) => {
                setFeedHeading("Topics");
                setSectName(sectName);
                setFeedContent(data);
            });

            inside === "other"
                ? setFeedColor(colorG.g("other"))
                : setFeedColor(colorG.g(sectName));
        }
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    return (
        <div className="flex h-full">
            <div
                className={`flex flex-col  p-4 h-full shadow-xl rounded text-black`}
                style={{
                    width: width - width / 1.7,
                    backgroundColor: feedColor,
                }}
            >
                <div className={`grid grid-cols-3 pb-2`}>
                    {feedHeading != "other" ? (
                        <button
                            className="btn-sm justify-self-start"
                            onClick={() => setupFeed("other")}
                        >
                            <FaAngleLeft />
                        </button>
                    ) : null}

                    <h2
                        className={`flex flex-col text-lg font-medium justify-self-center items-center ${
                            feedHeading === "other" ? "col-span-3 " : null
                        } `}
                    >
                        {feedHeading}
                    </h2>
                </div>

                <div className="overflow-y-auto px-3 py-2">
                    {feedContent
                        ? feedContent.map((d, i) => (
                              <p
                                  key={i}
                                  className={`flex justify-between gap-2 mb-1.5 cursor-pointer `}
                                  onClick={
                                      feedHeading === "other"
                                          ? () =>
                                                setupFeed(d[category], "other")
                                          : () =>
                                                setSelectedOptions({
                                                    [category]: sectName,
                                                    topic: d.topic,
                                                })
                                  }
                              >
                                  <span>
                                      {feedHeading === "other"
                                          ? d[category]
                                          : d.topic}
                                  </span>
                                  <span>{d.insightT}</span>
                              </p>
                          ))
                        : null}
                </div>
            </div>

            <svg width={width / 1.7} height={height}>
                <g transform={`translate(${width / 3.4},${height / 2})`}>
                    {angData
                        ? angData.map((a, i) => (
                              <g key={i}>
                                  <path
                                      d={arcPath(a)}
                                      stroke="#fff"
                                      strokeWidth={3}
                                      fill={colorG.g(a.data[category])}
                                  />
                                  <text
                                      transform={`translate(${arcPath.centroid(
                                          a
                                      )})`}
                                      textAnchor="middle"
                                      fontWeight={"bold"}
                                      y={"-0.4em"}
                                      x={"-0.4em"}
                                      key={a.data[category]}
                                      className={`cursor-pointer focus:outline-none`}
                                      data-tooltip-id={`my-tooltip-${a.index}`}
                                      fontSize={13}
                                      onClick={
                                          a.data[category] === "other"
                                              ? () => setupFeed("other")
                                              : () =>
                                                    setupFeed(a.data[category])
                                      }
                                  >
                                      {a.data[category]}
                                      <tspan
                                          x={"-0.4em"}
                                          y={"0.9em"}
                                          fontWeight={"normal"}
                                          fillOpacity={0.7}
                                          fontSize={13}
                                      >
                                          {a.data.insightT}
                                      </tspan>
                                  </text>
                              </g>
                          ))
                        : null}
                </g>
            </svg>
            {angData
                ? angData.map((a, i) => (
                      <Tooltip
                          id={`my-tooltip-${a.index}`}
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
                                  {category} : {a.data[category]}
                              </span>
                              <span>Insights : {a.data.insightT}</span>
                          </div>
                      </Tooltip>
                  ))
                : null}
        </div>
    );
}

export default PieChart;
