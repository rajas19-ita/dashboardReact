import { useState } from "react";
import Select from "react-select";
import InsightFeed from "./components/InsightFeed";
import data1 from "./custom.json";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import useChartDimensions from "./hooks/useChartDimensions";
import BubbleChart from "./components/BubbleChart";

import WorldMap from "./components/WorldMap";
import InsightCard from "./components/InsightCard";

const options = [
    { value: "sector", label: "Sector" },
    { value: "pestle", label: "Pestle" },
    { value: "likelihood", label: "Likelihood" },
    { value: "intensity", label: "Intensity" },
    { value: "country", label: "country" },
];

function App() {
    const [chart, setChart] = useState({
        value: "sector",
        label: "sector",
    });
    const [selectedOptions, setSelectedOptions] = useState({});
    const [ref, width, height] = useChartDimensions();
    const [date, setDate] = useState(new Date("2017-01-08T18:30:00.000+00:00"));
    const [insight, setInsight] = useState();

    const drawChart = () => {
        switch (chart.value) {
            case "sector":
                return (
                    <PieChart
                        category={"sector"}
                        width={width}
                        height={height}
                        setSelectedOptions={setSelectedOptions}
                    />
                );
            case "pestle":
                return (
                    <PieChart
                        category={"pestle"}
                        width={width}
                        height={height}
                        setSelectedOptions={setSelectedOptions}
                    />
                );
            case "likelihood":
                return (
                    <BarChart
                        width={width}
                        height={height}
                        setSelectedOptions={setSelectedOptions}
                    />
                );
            case "intensity":
                return (
                    <BubbleChart
                        width={width}
                        height={height}
                        setSelectedOptions={setSelectedOptions}
                    />
                );
            case "country":
                return (
                    <WorldMap
                        width={width}
                        height={height}
                        data={data1}
                        setSelectedOptions={setSelectedOptions}
                    />
                );
            default:
                return (
                    <PieChart
                        groupBy={"sector"}
                        width={width}
                        height={height}
                        setSelectedOptions={setSelectedOptions}
                    />
                );
        }
    };

    return (
        <div className=" flex h-screen  justify-center gap-4">
            <div
                className={`${
                    chart.value === "country" ? "max-w-3xl" : "max-w-xl"
                } w-full flex flex-col justify-end  gap-3  pb-4`}
            >
                <div className="flex ">
                    <h1 className="px-4 py-2 text-2xl border-[1px] border-slate-400  rounded text-slate-700">
                        <strong>Insights</strong>{" "}
                        <span className="text-xl">across</span>{" "}
                        <strong>the Globe</strong>
                    </h1>
                </div>

                <div className="w-full h-[87%] flex flex-col gap-3 p-4 border-slate-400 border-[1px] rounded">
                    <div className={`self-start w-1/3`}>
                        <Select
                            defaultValue={chart}
                            onChange={setChart}
                            options={options}
                        />
                    </div>
                    <div ref={ref} className=" h-[90%]">
                        {drawChart()}
                    </div>
                </div>
            </div>
            <div className="flex flex-col max-w-md  w-full  justify-end py-4 gap-4">
                {insight ? <InsightCard insight={insight} /> : null}
                <InsightFeed
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    setInsight={setInsight}
                    insightOpen={insight ? true : false}
                />
            </div>
        </div>
    );
}

export default App;
