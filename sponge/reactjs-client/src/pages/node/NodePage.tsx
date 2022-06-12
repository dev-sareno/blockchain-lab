import React, { useState } from "react";
import { postNetworkConnect } from "../../api";

const NodePage = () => {
    const [address, setAddress] = useState<string>('localhost:5002');

    const onAddressValueChangedHandler = (e: React.FormEvent<HTMLInputElement>) => {
        setAddress(e.currentTarget.value);
    };

    const onConnectClickedHandler = async () => {
        const body = {
            address: address,
        };
        const res = await postNetworkConnect(body);
        console.log(res);
    };

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            Address:
                        </td>
                        <td>
                            <input type={'text'} value={address} onChange={onAddressValueChangedHandler} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button onClick={onConnectClickedHandler}>Connect</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default NodePage;