export default function Button({
  value,
  onChange,
  placeholder,
  disabled = false,
  type_ = "text",
  className = "",
  size = "sm",
  style = null,
}) {
  return (
    <input
      style={style}
      disabled={disabled}
      autoComplete="off"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type_}
      className={
        className + " form-control" + (size ? ` form-control-${size}` : "")
      }
    />
  );
}
