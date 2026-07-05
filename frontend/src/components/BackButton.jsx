import { useNavigate } from "react-router-dom";


export default function BackButton({ to = "/trips", label = "All trips" }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
            className="inline-flex items-center gap-1.5 text-sm text-[#5b7785] hover:text-[#143642] transition-colors cursor-pointer"
        >
            <i className="ph ph-arrow-left" /> {label}
        </button>
    );
}