export function EditableCell<T>({
    type='text', value, editing, onChange, onEnd
}: {
    type?: 'text' | 'password',
    value: T,
    editing: boolean,
    onChange: (v: T) => void;
    onEnd: () => void;
}) {
    if (!editing && type === 'password')
        return value ? '********' : '-';

    return (
        <input
            type={type}
            value={value as any}
            autoFocus
            onBlur={onEnd}
            onChange={e => onChange(e.target.value as any)}
            onKeyDown={e => {
                if (e.key === 'Enter')
                    onEnd()
            }}
        />
    )
}