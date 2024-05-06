import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { subHours } from "date-fns";

export default function HomeStats() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/orders').then(res => {
            setOrders(res.data);
            setIsLoading(false);
        })
    }, []);

    if (isLoading) {
        return (
            <div className="my-4">
                <Spinner fullWidth={true}/>
            </div>
        );
    }

    const ordersToday = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24));
    const ordersWeek = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24*7));
    const ordersMonth = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24*30));

    function ordersTotal(orders) {
        let sum = 0;
        orders.forEach(order => {
            const {line_items} = order;
            line_items.forEach(li => {
                const lineSum = li.quantity * li.price_data.unit_amount  / 100;
                sum += lineSum;
            })
        });
        return new Intl.NumberFormat('en-CA').format(sum);
    }

    return (
        <div>
            <h2>Order</h2>
            <div className="tile-grid">
                <div className="tile">
                    <h3 className="tile-header">Today</h3>
                    <div className="tile-number">{ordersToday.length}</div>
                    <div className="tile-desc">{ordersToday.length} orders today</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">In 7 Days</h3>
                    <div className="tile-number">{ordersWeek.length}</div>
                    <div className="tile-desc">{ordersWeek.length} orders in 7 days</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">In 30 Days</h3>
                    <div className="tile-number">{ordersMonth.length}</div>
                    <div className="tile-desc">{ordersMonth.length} orders in 30 days</div>
                </div>
            </div>
            <h2>Revenue</h2>
            <div className="tile-grid">
                <div className="tile">
                    <h3 className="tile-header">Today</h3>
                    <div className="tile-number">${ordersTotal(ordersToday)}</div>
                    <div className="tile-desc">{ordersToday.length} orders today</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">In 7 Days</h3>
                    <div className="tile-number">${ordersTotal(ordersWeek)}</div>
                    <div className="tile-desc">{ordersWeek.length} orders in 7 days</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">In 30 Days</h3>
                    <div className="tile-number">${ordersTotal(ordersMonth)}</div>
                    <div className="tile-desc">{ordersMonth.length} orders in 30 days</div>
                </div>
            </div>
        </div>
    );
}