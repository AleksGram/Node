import React, { useState, useEffect } from "react";
import { api } from "../../data-provider";


export const RoleInput = ({ role, email }) => {

    const [userRole, setUserRole] = useState("");
    const [options, showOptions] = useState(false);
    const [error, setError] = useState(null);


    const changeUserRole = ({email, role}) => () => {
        if (role === userRole) {
            showOptions(false);
            return
        }
        api.updateUserRole({email, role})
            .then(data => {
                if(data.error) {
                    setError(data.error);
                    showOptions(false);
                    return;
                } 
                setUserRole(data.role);
                showOptions(false);
            })
            .catch(error => {
                setError(error);
                showOptions(false);
            })
    }

    useEffect(() => {
        setUserRole(role)
    }, [role])


    return (
        <>
            <b>Role :</b> <label><input readOnly value={userRole} onClick={() => showOptions(!options)} className={userRole}/> Click to change role</label>
            {options && (<ul className="role-options">
                <li onClick={changeUserRole({email, role: "user"})}>User</li>
                <li onClick={changeUserRole({email, role: "admin"})}>Admin</li>
            </ul>)}
            {error && <p className="error">{error}</p>}
        </>
    )
}