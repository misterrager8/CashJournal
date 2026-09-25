import { Icon as Icon_ } from "@iconify/react";

export default function Icon({ name, style = null, className = "" }) {
  return <Icon_ style={style} className={className} inline icon={name} />;
}
