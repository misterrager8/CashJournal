import Icon from "./Icon";

export default function Dropdown({
  text,
  target,
  icon,
  showCaret = true,
  border = true,
  active = false,
  autoClose = true,
  size = "sm",
  children,
  classNameBtn = "",
  classNameMenu = "",
  className = "",
}) {
  return (
    <div className={className}>
      <a
        data-bs-auto-close={autoClose}
        data-bs-target={"#" + target}
        data-bs-toggle="dropdown"
        className={
          classNameBtn +
          " btn" +
          (size ? ` btn-${size}` : "") +
          (showCaret ? " dropdown-toggle" : "") +
          (border ? "" : " border-0") +
          (active ? " active" : "")
        }>
        {icon && <Icon name={icon} className={text ? " me-2" : ""} />}
        <span>{text}</span>
      </a>
      <div id={target} className={classNameMenu + " dropdown-menu"}>
        {children}
      </div>
    </div>
  );
}
