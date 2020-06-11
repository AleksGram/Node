import React, { useEffect, useState } from "react";
import { api } from "../../data-provider";
import { RoleInput } from "./RoleInput";

export const Accounts = () => {

    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState(null);
    const [blockAccountError, setBlockAccError] = useState(null);


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

    const onBlockAccount = ({ email, role, isBlocked }) => {
        setBlockAccError(null);
        api.blockAccount({ email, role, isBlocked })
            .then(data => {
                debugger
                if (data.error) {
                    setBlockAccError(data.error);
                    return;
                }
                setAccounts(data);
            })
    }

    const renderAccountItem = ({ email, nik, role, isBlocked }, i) => {
        return (
            <li key={i} className="account-item">
                <div className="user-info">
                    <p>{`Nik name : ${nik}`}</p>
                    <p>{`Email : ${email}`}</p>
                    <div className="user-role">
                        <RoleInput role={role} email={email} />
                    </div>
                </div>
                <button
                    className={isBlocked ? "isBlocked" : null}
                    onClick={() => onBlockAccount({ email, role, isBlocked: !isBlocked })}
                >
                    {!isBlocked ? "Block Account" : "Unblock Account"}</button>
            </li>
        )
    }

    return (
        <div className="accounts">
            <a href={"/messages"}>Back to messages</a>
            <h1>Registred accounts</h1>
            {error && <div className="error">{error}</div>}
            { blockAccountError && <div className="error">{blockAccountError}</div>}
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