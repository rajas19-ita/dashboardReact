import React, { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa6";

function TopicsFeed({
    width,
    buffer,
    setHeading,
    heading,
    setContent,
    content,
    category,
    section,
    setSection,
    color,
    setSelectedOptions,
}) {
    const [subOpen, setSubOpen] = useState(false);
    const fetchTopic = async () => {
        const response = await fetch(
            `${
                import.meta.env.VITE_API_URL
            }/insightT?groupBy=topic&match=${encodeURIComponent(
                JSON.stringify({
                    category,
                    value: section,
                })
            )}`
        );

        const json = await response.json();

        if (response.ok) {
            setHeading("Topics");
            setContent(json);
        }
    };

    useEffect(() => {
        if (section) {
            fetchTopic();
        }
    }, [section]);

    return (
        <div
            className={`flex flex-col  p-4 h-full shadow-xl rounded-md text-black`}
            style={{
                width: width - width / 1.7,
                backgroundColor: color,
            }}
        >
            <div className={`grid grid-cols-3 pb-2`}>
                {!subOpen ? (
                    <h2 className=" col-span-3 mx-auto text-lg font-medium ">
                        {heading}
                    </h2>
                ) : (
                    <>
                        <button
                            className="btn-sm justify-self-start"
                            onClick={() => {
                                setHeading(buffer.current.heading);
                                setContent(buffer.current.content);
                                setSection();
                                setSubOpen(false);
                            }}
                        >
                            <FaAngleLeft />
                        </button>
                        <h2 className="text-lg font-medium justify-self-center">
                            Topics
                        </h2>
                    </>
                )}
            </div>

            <div className="overflow-y-auto px-3 py-4">
                {content
                    ? content.map((c) => (
                          <p
                              key={c.section}
                              className={`flex justify-between gap-2 mb-1.5 cursor-pointer `}
                              onClick={
                                  heading === "other Sections"
                                      ? () => {
                                            buffer.current = {
                                                heading,
                                                content,
                                            };
                                            setSelectedOptions({
                                                [category]: c.section,
                                            });
                                            setSection(c.section);
                                            setSubOpen(true);
                                        }
                                      : () => {
                                            setSelectedOptions({
                                                [category]: section,
                                                topic: [c.section],
                                            });
                                        }
                              }
                          >
                              <span className="">{c.section}</span>
                              <span className=" self-start">{c.insightT}</span>
                          </p>
                      ))
                    : null}
            </div>
        </div>
    );
}

export default TopicsFeed;
