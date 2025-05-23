import React from "react";
import { NavLink } from "react-router-dom";

const NavbarComponent = () => {
  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Department", path: "/department" },
    { name: "Employee", path: "/employee" },
    { name: "Attendance", path: "/attendance" },
    { name: "Locations", path: "/location" },
    { name: "Send Email", path: "/send-bulk" },
  ];

  return (
    <nav className="bg-white px-0 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <ul className="flex space-x-4 text-blue-900 text-lg font-medium items-center">
          {navLinks.map(({ name, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `inline-block px-5 py-2 rounded-md font-semibold transition duration-200 select-none ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "bg-transparent text-blue-900 hover:ring-2 hover:ring-blue-600 hover:text-blue-600"
                  }`
                }
                style={{ textDecoration: "none" }}
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavbarComponent;
