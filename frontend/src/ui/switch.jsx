export default function Switch({ checked, onChange }) {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="toggle-checkbox"
        />
    );
}
