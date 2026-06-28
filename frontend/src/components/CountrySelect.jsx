import Select from "react-select";
import countryList from "country-list";

// build the options once: [{ value: "DE", label: "Germany" }, ...]
const countries = countryList.getData().map((c) => ({
  value: c.code,
  label: c.name,
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

// Coastal (light) theme for react-select
const lightThemeStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderColor: state.isFocused ? "#2f93ab" : "#d9e6ec",
    borderRadius: 12,
    minHeight: 44,
    color: "#143642",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(47,147,171,0.18)" : "none",
    "&:hover": { borderColor: "#2f93ab" },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #e6eef2",
    boxShadow: "0 12px 30px rgba(20,54,66,0.12)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#eaf4f7"
      : state.isFocused
      ? "#f1f6f8"
      : "#ffffff",
    color: "#143642",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#143642" }),
  input: (base) => ({ ...base, color: "#143642" }),
  placeholder: (base) => ({ ...base, color: "#9fb3bc" }),
};

function CountrySelect({ value, onChange }) {
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
      styles={lightThemeStyles}
    />
  );
}

export default CountrySelect;
