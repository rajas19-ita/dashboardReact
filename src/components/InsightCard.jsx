import React from "react";
import { Tooltip } from "react-tooltip";

function InsightCard({
    insight: {
        intensity,
        likelihood,
        insight,
        url,
        country,
        region,
        published,
        source,
        title,
    },
}) {
    return (
        <div className="w-full  py-3 px-6 border-[1px] border-slate-400 rounded h-[47%] overflow-y-auto ">
            <h2 className=" font-medium text-lg text-center mb-2">{insight}</h2>

            <div className=" w-3/4 mx-auto mb-3">
                <div className="flex justify-center gap-2 flex-wrap items-center">
                    {source ? (
                        <>
                            <span
                                className="badge badge-outline cursor-pointer"
                                data-tooltip-id={`my-tooltip-${source}`}
                            >
                                <a href={url} className="block" target="_blank">
                                    {source.length > 30 ? "source" : source}
                                </a>
                            </span>

                            {source.length > 30 ? (
                                <Tooltip
                                    id={`my-tooltip-${source}`}
                                    place="bottom-center"
                                >
                                    {source}
                                </Tooltip>
                            ) : null}
                        </>
                    ) : null}
                    {country != "N/A" ? (
                        <span className="badge badge-outline">{country}</span>
                    ) : region != "N/A" ? (
                        <span className="badge badge-outline">{region}</span>
                    ) : null}
                </div>
            </div>

            <p className=" mb-1">{title}</p>
            <p className="">Intensity : {intensity}</p>
            <p>Likelihood : {likelihood}</p>
            <p className="text-end">
                {new Date(published).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </p>
        </div>
    );
}

export default InsightCard;
