import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
            setIsLoading(false);
        })
    }, [])

    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <td>Date</td>
                        <td>Paid</td>
                        <td>Customer Info</td>
                        <td>Products</td>
                    </tr>
                </thead>
                <tbody>
                {isLoading && (
                        <tr>
                            <td colSpan={4}>
                            <div className="py-4">
                                <Spinner fullWidth={true} />
                                </div>
                            </td>
                        </tr>
                    )}
                    {orders.length > 0 && orders.map(order => (
                        <tr>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Invalid Date'}
                    </td>
                    <td className={order.paid ? 'text-green-600' : "text-red-600"}>
                        {order.paid ? 'YES' : 'NO'}
                    </td>
                    <td>
                        <span className="bg-gray-200 p-1 rounded-sm">Name: </span>{order.name}, <span className="bg-gray-200 p-1 rounded-sm">Email: </span> {order.email} <br />
                        <span className="bg-gray-200 p-1 rounded-sm">Address: </span>{order.streetAddress}, <br />
                        {order.city}, {order.state}, {order.zipCode}, {order.country}

                    </td>
                    <td>
                        {order.line_items.map(line => (
                            <>
                            {line.price_data?.product_data?.name} x {line.quantity}
                            </>
                        ))}
                    </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}