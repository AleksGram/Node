import React, { useEffect, useState } from "react";
import { api } from "../../data-provider";

export const Accounts = () => {

    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        api.getAllAccounts()
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    return;
                }
                setAccounts(data);
            })
    }, [])

    const renderAccountItem = ({ email, nik, role }, i) => {
        return (
            <li key={i} className="account-item">
                <div className="user-info">
                    <p>{`Nik name : ${nik}`}</p>
                    <p>{`Email : ${email}`}</p>
                    <p>
                        <b>Role :</b> <span className="user-role">{role}</span>
                    </p>
                </div>
                <button>Change role</button>
            </li>
        )
    }

    return (
        <div className="accounts">
            <h1>Registred accounts</h1>
            {error && <div className="error">{error}</div>}
            {
                !error && (<ul className="accounts-list">
                    {
                        accounts.length && accounts.map(renderAccountItem)
                    }
                </ul>)
            }
        </div>
    )
}