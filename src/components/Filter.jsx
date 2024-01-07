import React, { useEffect, useState } from "react";
import Select from "react-select";

function Filter({ selectedOptions, setSelectedOptions }) {
    const [options, setOptions] = useState();

    const fetchOptions = async (field) => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/options/${field}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedOptions),
            }
        );

        if (response.ok) {
            const json = await response.json();
            setOptions((prevOptions) => ({
                ...prevOptions,
                [field]: json[field],
            }));
        }
    };

    useEffect(() => {
        fetchOptions("sector");
        fetchOptions("topic");

        fetchOptions("country");
        fetchOptions("pestle");
        fetchOptions("intensity");
        fetchOptions("likelihood");
    }, [selectedOptions]);

    const renderSelect = (field) => {
        return (
            <Select
                placeholder={field}
                value={
                    selectedOptions[field] !== null &&
                    selectedOptions[field] !== undefined
                        ? {
                              value: selectedOptions[field],
                              label: selectedOptions[field],
                          }
                        : selectedOptions[field] === null
                        ? {
                              value: null,
                              label: "N/A",
                          }
                        : null
                }
                onChange={(o) => {
                    if (!o) {
                        return setSelectedOptions((prev) => {
                            delete prev[field];
                            return { ...prev };
                        });
                    }
                    setSelectedOptions((prev) => ({
                        ...prev,
                        [field]: o.value,
                    }));
                }}
                className=" w-[32%] "
                options={
                    options && options[field]
                        ? options[field].map((o) => ({
                              value: o,
                              label: o != null ? o : "N/A",
                          }))
                        : null
                }
                isClearable={true}
            />
        );
    };

    return (
        <div className="flex gap-2  w-full p-2 flex-wrap flex-grow  content-start">
            {renderSelect("sector")}

            {renderSelect("country")}

            {renderSelect("topic")}

            {renderSelect("pestle")}

            {renderSelect("intensity")}

            {renderSelect("likelihood")}
        </div>
    );
}

export default Filter;
