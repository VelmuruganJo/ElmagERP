import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaHome,
  FaBoxes,
  FaCube,
  FaArrowDown,
  FaArrowUp,
  FaWarehouse,
  FaClipboardCheck,
  FaCogs,
  FaClipboardList,
  FaIndustry,
  FaTruck,
  // FaCheckCircle,
  FaCalendarAlt
} from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./Sidebar.css";

function Sidebar() {
  const [openMenu, setOpenMenu] = useState("otsil");

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="logo">
        <h2>ELMAG ERP</h2>
      </div>

      <ul className="menu">

        {/* Dashboard */}
        <li>
          <NavLink to="/admin" end>
            <FaHome className="menu-icon" />
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>

        {/* ELMAG Dropdown */}
        <li>

          <div
            className="dropdown-title"
            onClick={() => toggleMenu("otsil")}
          >
            <div className="dropdown-left">
              <FaBoxes className="menu-icon" />
              <span className="menu-text">Stocks</span>
            </div>

            <MdKeyboardArrowDown
              className={`arrow ${
                openMenu === "otsil" ? "open" : ""
              }`}
            />
          </div>

          <div className={`submenu ${openMenu === "otsil" ? "show" : ""}`}>

            <NavLink to="/admin/materials">
              <FaCube className="submenu-icon" />
              <span>Materials</span>
            </NavLink>

            <NavLink to="/admin/stockin">
              <FaArrowDown className="submenu-icon" />
              <span>Stock In</span>
            </NavLink>
            <NavLink to="/admin/boq">
  <FaClipboardList className="submenu-icon" />
  <span>BOQ</span>
</NavLink>

<NavLink to="/admin/Product">
  <FaCogs className="submenu-icon" />
  <span>Product</span>
</NavLink>

<NavLink to="/admin/Production">
  <FaIndustry className="submenu-icon" />
  <span>Production</span>
</NavLink>

            <NavLink to="/admin/stockout">
              <FaArrowUp className="submenu-icon" />
              <span>Stock Out</span>
            </NavLink>

            <NavLink to="/admin/stock">
              <FaWarehouse className="submenu-icon" />
              <span>Current Stock</span>
            </NavLink>

            {/* <NavLink to="/admin/copper-validation">
  <FaClipboardCheck className="submenu-icon" />
  <span>Validation</span>
</NavLink> */}
<NavLink to="/admin/copper-validation">
    <FaClipboardCheck className="submenu-icon" />
    <span>Copper Validation</span>
</NavLink>

<NavLink to="/admin/material-validation">
    <FaBoxes className="submenu-icon" />
    <span>Material Validation</span>
</NavLink>




          </div>
          

        </li>
        <li>

          <div
            className="dropdown-title"
            onClick={() => toggleMenu("otsil")}
          >
            <div className="dropdown-left">
              <FaBoxes className="menu-icon" />
              <span className="menu-text">Dispatch</span>
            </div>

            <MdKeyboardArrowDown
              className={`arrow ${
                openMenu === "otsil" ? "open" : ""
              }`}
            />
          </div>

          <div className={`submenu ${openMenu === "otsil" ? "show" : ""}`}>

            <NavLink to="/admin/plan">
  <FaCalendarAlt className="submenu-icon" />
  <span>Plan</span>
</NavLink>

<NavLink to="/admin/dispatch">
  <FaTruck className="submenu-icon" />
  <span>Completed</span>
</NavLink>

            {/* <NavLink to="/admin/stockout">
              <FaArrowUp className="submenu-icon" />
              <span>Pending</span>
            </NavLink> */}
          </div>
          

        </li>


      </ul>

    </aside>
  );
}

export default Sidebar;