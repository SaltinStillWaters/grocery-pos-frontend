import { useEffect, useRef } from "react";

interface EditableCellProps<T> {
  type?: "text" | "password";
  value: T;
  isEditing: boolean;
  onChange: (v: T) => void;
  onEnd: () => void;
  error?: string;
}

export function EditableCell<T>(props: EditableCellProps<T>) {
  const { type = "text", value, isEditing, onChange, onEnd, error } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const displayValue =
    type === "password" ? 
        value ? "********" : "-"
        : value != null ?
            String(value) : "-";

  return (
    <div className="editable-cell">
      <div
        className={`editable-cell-wrapper ${isEditing ? "editing" : ""} ${
          !isEditing && error ? "error" : ""
        }`}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type={type}
            value={String(value) as any}
            onBlur={onEnd}
            onChange={(e) => onChange(e.target.value as any)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onEnd();
            }}
            className="editable-cell-input"
          />
        ) : (
          displayValue
        )}
      </div>
      {error && <span className="editable-cell-error">{error}</span>}
    </div>
  );
}