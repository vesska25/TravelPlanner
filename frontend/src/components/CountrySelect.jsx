import Select from "react-select";
import countryList from "country-list";

// build the options once: [{ value: "DE", label: "Germany" }, ...]
const countries = countryList.getData().map((c) => ({
    value: c.code, // ISO code, e.g. "DE"
    label: c.name, // full name, e.g. "Germany"
}));

// custom rendering for each option: flag image + name
function formatOptionLabel({ value, label }) {
    return (
        <div className="flex items-center gap-2">
            <img
                src={`https://flagcdn.com/24x18/${value.toLowerCase()}.png`}
                alt=""
                className="w-6 h-4 object-cover rounded-sm"
            />
            <span>{label}</span>
        </div>
    );
}

// react-select renders its own DOM, so we style it via its styles API (not Tailwind classes)
const darkThemeStyles = {
    control: (base) => ({
        ...base,
        backgroundColor: "#18181b", // zinc-900
        borderColor: "#3f3f46",     // zinc-700
        color: "#f4f4f5",
        boxShadow: "none",
        "&:hover": { borderColor: "#71717a" }, // zinc-500
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "#27272a", // zinc-800
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "#3f3f46" : "transparent", // zinc-700 on hover
        color: "#f4f4f5",
    }),
    singleValue: (base) => ({ ...base, color: "#f4f4f5" }),
    input: (base) => ({ ...base, color: "#f4f4f5" }),
    placeholder: (base) => ({ ...base, color: "#a1a1aa" }), // zinc-400
};

function CountrySelect({ value, onChange }) {
    // find the option object matching the current value (a country code string)
    const selected = countries.find((c) => c.value === value) || null;

    return (
        <Select
            options={countries}
            value={selected}
            onChange={(option) => onChange(option ? option.value : "")}
            formatOptionLabel={formatOptionLabel}
            placeholder="Select a country..."
            isClearable
            classNamePrefix="country-select"
            styles={darkThemeStyles}
        />
    );
}

export default CountrySelect;