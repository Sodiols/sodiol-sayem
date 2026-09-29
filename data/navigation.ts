export type NavItem = {
  number: string;
  label: string;
  href: string;
};

export const navigation: NavItem[] = [
  { number: "01", label: "Work", href: "/work" },
  { number: "02", label: "About", href: "/about" },
  { number: "03", label: "Experience", href: "/experience" },
  { number: "04", label: "Lab", href: "/lab" },
  { number: "05", label: "Contact", href: "/contact" },
];
