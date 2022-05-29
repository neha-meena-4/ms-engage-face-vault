import React from 'react'

import addIcon from '../../icons/add-icon.svg'
import './Vault.css'

const Vault = () => {
    return (
        <div className="vault">
            <div className="vault__container">
                <div className="vault__addButton">
                    <img src={addIcon} alt="add document" />
                    <p>Add Document</p>
                    <input type="file" />
                </div>
            </div>
        </div>
    )
}

export default Vault
