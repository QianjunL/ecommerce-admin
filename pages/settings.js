import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Settings({swal}) {
    const [products, setProducts] = useState([]);
    const [featuredProductId, setFeaturedProductId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [shippingFee, setShippingFee] = useState('');

    async function saveSettings() {
        setIsLoading(true);
        try {
            await axios.put('/api/settings', {
                name: 'featuredProductId',
                value: featuredProductId,
            });
            await axios.put('/api/settings', {
                name: 'shippingFee',
                value: shippingFee,
            });
            setIsLoading(false);
            await swal.fire({
                title: 'Settings save',
                icon: 'success',
            })

        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchAllData().then(() => {
            setIsLoading(false);
        })
    }, []);

    async function fetchAllData() {
        await axios.get('/api/products').then(res => {
            setProducts(res.data);
        });
        await axios.get('/api/settings?name=featuredProductId').then(res => {
            setFeaturedProductId(res.data.value);
        });
        await axios.get('/api/settings?name=shippingFee').then(res => {
                setShippingFee(res.data.value);
        });
    }

    return (
        <Layout>
            <h1>Settings</h1>
            {isLoading && (
                <Spinner fullWidth={true}/>
            )}
            {!isLoading && (
                <>
            <label>Featured Product</label>
            <select 
            value={featuredProductId}
            onChange={e => setFeaturedProductId(e.target.value)}
            >
                {products.length > 0 && products.map(product => (
                    <option value={product._id}>{product.title}</option>
                ))}
            </select>
            <label>Shipping Fee in CAD</label>
            <input 
            value={shippingFee}
            onChange={e => setShippingFee(e.target.value)}
            type="number" 
            />
            <div>
                <button 
                onClick={saveSettings}
                className="btn-primary">
                    Submit
                    </button>
            </div>
                </>
            )}

        </Layout>
    );
}

export default withSwal(({swal}) => (
    <Settings swal={swal}/>
))