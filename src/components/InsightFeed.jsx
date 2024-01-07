import React, { useEffect, useState } from "react";
import PageNavigation from "./PageNavigation";
import Filter from "./Filter";
import { FaGear } from "react-icons/fa6";
import { IoCaretBack } from "react-icons/io5";

function InsightFeed({
    selectedOptions,
    setSelectedOptions,
    setInsight,
    insightOpen,
}) {
    const [insights, setInsights] = useState([]);
    const [pageCount, setPageCount] = useState(100);
    const [pageNumber, setPageNumber] = useState(0);
    const [openF, setOpenF] = useState(false);

    useEffect(() => {
        fetchInsights().then(() => {
            if (pageCount != 0) {
                setPageNumber(1);
            } else {
                setPageNumber(0);
            }
        });
    }, [selectedOptions]);

    const fetchInsights = async (pageNumber) => {
        const response = await fetch(
            `${
                import.meta.env.VITE_API_URL
            }/insights?selectedOptions=${encodeURIComponent(
                JSON.stringify(selectedOptions)
            )}&page=${pageNumber ? pageNumber : 1}`
        );

        const json = await response.json();

        if (response.ok) {
            setInsights(json.insights);
            setPageCount(json.pageCount);
        }
    };
    const fetchInsight = async (id) => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/insight/${id}`
        );

        const json = await response.json();
        if (response.ok) setInsight(json);
    };

    return (
        <div
            className={`w-full ${
                insightOpen ? "h-[50%]" : "h-full"
            } flex flex-col border-slate-400 border-[1px] rounded `}
        >
            <div className="grid grid-cols-3 px-4 py-2 items-center border-slate-400 border-b-[1px] font-medium">
                <h2 className=" col-start-2 justify-self-center">Insights</h2>
                <button
                    className="btn btn-sm justify-self-end rounded text-slate-700"
                    onClick={() => setOpenF(!openF)}
                >
                    {openF ? <IoCaretBack /> : <FaGear />}
                </button>
            </div>
            {openF ? (
                <Filter
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                />
            ) : (
                <div className="flex-grow flex flex-col overflow-y-scroll  ">
                    {insights.map((i) => (
                        <p
                            key={i._id}
                            onClick={() => fetchInsight(i._id)}
                            className="cursor-pointer hover:bg-slate-200 px-3 py-2 transition-all"
                        >
                            {i.insight}
                        </p>
                    ))}
                </div>
            )}

            <PageNavigation
                pageCount={pageCount}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                fetchInsights={fetchInsights}
            />
        </div>
    );
}

export default InsightFeed;
