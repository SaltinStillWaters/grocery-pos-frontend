import type { Role } from "../../utils"

type RolesDisplayProps = {
    roles: Role[],
    onClick: () => void
}

export function RolesDisplay({roles, onClick}: RolesDisplayProps) {
    return (
        <div onClick={onClick} style={ {cursor: "pointer"} }>
            {roles.join(', ') || "-"}
        </div>
    );
}
type RolesEditProps = {
    roles: string[];
    allRoles: string[];
    onChange: (newRoles: string[]) => void;
    onBlur: () => void; // stop editing
};

export function RolesEdit({ roles, allRoles, onChange, onBlur }: RolesEditProps) {
    return (
        <select
            multiple
            value={roles}
            onChange={e => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                onChange(selected);
            }}
            onBlur={onBlur}
            autoFocus
            className="form-control"
        >
            {allRoles.map(role => (
                <option key={role} value={role}>
                    {role}
                </option>
            ))}
        </select>
    );
}
