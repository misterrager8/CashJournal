export default function Button({
  text,
  type_ = "button",
  icon,
  size = "sm",
  border = true,
  onClick,
  className = "",
  active = false,
  children,
}) {
  return (
    <button
      type={type_}
      className={
        className +
        " btn" +
        (size ? ` btn-${size}` : "") +
        (border ? "" : " border-0") +
        (active ? " active" : "")
      }
      onClick={onClick}>
      {icon && <i className={"bi bi-" + icon}></i>}
      {text && <span className={icon ? "ms-2" : ""}>{text}</span>}
      {children}
    </button>
  );
}
