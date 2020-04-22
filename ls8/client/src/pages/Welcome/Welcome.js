import React from "react";
import { NavLink } from "react-router-dom";



export const Welcome = () => {
    return (
        <div className="navigation">
            <NavLink to="/registration">
                Sign In
            </NavLink>
            <NavLink to="/login">
                Log In
            </NavLink>
        </div>
    )
}

