import React from "react";
import { IoCaretBack } from "react-icons/io5";
import { IoCaretForward } from "react-icons/io5";

function PageNavigation({
    pageCount,
    pageNumber,
    setPageNumber,
    fetchInsights,
}) {
    return (
        <div className="p-2 flex justify-center gap-3 items-center">
            <button
                className="btn btn-sm bg-white shadow-none border-none text-slate-700 disabled:bg-white hover:bg-white"
                onClick={() => {
                    fetchInsights(pageNumber - 1);
                    setPageNumber(pageNumber - 1);
                }}
                disabled={pageNumber <= 1 || pageNumber === ""}
            >
                <IoCaretBack />
                previous
            </button>
            <form
                className=" w-[10%]"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (pageNumber != "") fetchInsights(pageNumber);
                }}
            >
                <input
                    type="text"
                    value={pageNumber}
                    onChange={(e) => {
                        if (e.target.value === "") return setPageNumber("");
                        const parsedNumber = parseInt(e.target.value);
                        if (
                            !isNaN(parsedNumber) &&
                            parsedNumber >= 1 &&
                            parsedNumber <= pageCount
                        )
                            setPageNumber(parsedNumber);
                    }}
                    className=" border-gray-300 w-full rounded border-[1.5px]  text-center"
                />
            </form>

            <span className="">of {pageCount}</span>
            <button
                className="btn btn-sm bg-white shadow-none border-none text-slate-700
                 disabled:bg-white hover:bg-white"
                onClick={() => {
                    fetchInsights(pageNumber + 1);
                    setPageNumber(pageNumber + 1);
                }}
                disabled={pageNumber >= pageCount || pageNumber === ""}
            >
                next
                <IoCaretForward />
            </button>
        </div>
    );
}

export default PageNavigation;
