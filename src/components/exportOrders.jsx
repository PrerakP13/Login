import axios from 'axios';

const exportOrders = async () => {
    const response = await axios.get('http://localhost:8000/export', {
        responseType: 'blob', // Important to handle file downloads
        withCredentials: true,
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders.csv'); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default exportOrders;
