import { Link, type LinkProps } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import React from "react";

type GuardedLinkProps = LinkProps & {
  requireLogin?: boolean;
};

export const GuardedLink: React.FC<GuardedLinkProps> = ({
  to,
  requireLogin,
  children,
  ...props
}) => {
  const { token, requireAuth } = useAuth();

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (requireLogin && !token) {
      e.preventDefault();
      requireAuth(typeof to === "string" ? to : "/");
      return;
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};
