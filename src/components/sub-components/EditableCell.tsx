import { useEffect, useRef } from "react";
import './editableCell.css';

interface EditableCellProps<T, K extends keyof T> {
  type?: "text" | "password";
  value: T[K];
  isEditing: boolean;
  onChange: (v: T[K]) => void;
  onEnd: () => void;
  error?: string;
}

export function EditableCell<T, K extends keyof T>(props: EditableCellProps<T, K>) {
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
            onChange={(e) => onChange(e.target.value as T[K])}
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