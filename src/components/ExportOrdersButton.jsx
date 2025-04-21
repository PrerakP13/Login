import React from 'react';

import exportOrders from './exportOrders';

const ExportOrdersButton = () => {
    const handleExport = async () => {
        try {
            await exportOrders();
        } catch (err) {
            console.error("Error exporting orders:", err.message);
        }
    };

    return (
        <button onClick={handleExport}>Export Orders as CSV</button>
    );
};

export default ExportOrdersButton;
