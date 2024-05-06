import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { FormattedDate } from "@/lib/date";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Admins({swal}) {
    const [email, setEmail] = useState('');
    const [adminEmail, setAdminEmail] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    function addAdmin(e) {
        e.preventDefault();
        axios.post('/api/admins', {email}).then(response => {
            swal.fire({
                title: 'Admin created',
                icon: 'success',
            })
            setEmail('');
            loadAdmin();
        }).catch(err => {
            swal.fire({
                title: 'Error',
                text: err.response.data.message, 
                icon: 'error'
            })
        })
    }

    function loadAdmin() {
        setIsLoading(true);
        axios.get('/api/admins').then(res => {
            setAdminEmail(res.data);
            setIsLoading(false);
        })
    }

    function deleteAdmin(_id, aEmail) {
        swal.fire({
            title: 'Delete Category',
            text: `Do you want to delete "${aEmail}"?`,
            showCancelButton: true,
            // cancelButtonColor: 'white',
            // cancelButtonTextColor: 'black',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                axios.delete('/api/admins?_id='+_id).then(() => {
                    swal.fire({
                        title: 'Admin deleted',
                        icon: 'success',
                    });
                    loadAdmin();
                })
            }
        });
    }

    useEffect(() => {
        loadAdmin();
    }, []);


    return (
        <Layout>
            <h1>Admin</h1>
            <h2>Add Admin</h2>
            <form onSubmit={addAdmin}>
                <div className="flex gap-2">
                <input 
                className="mb-0" 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Please enter google email"
                />
                <button 
                type="submit"
                className="btn-primary py-1 whitespace-nowrap"
                >
                    Submit
                    </button>
                </div>

            </form>
            <h2>Existing Admin</h2>
            <table className="basic mt-2">
                <thead>
                    <tr>
                        <td>Admin Email</td>
                        <td>Created At</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={2}>
                                <div className="py-4"><Spinner fullWidth={true}/></div>
                            </td>
                        </tr>
                    )}
                    {adminEmail.length > 0 && adminEmail.map(aEmail => (
                        <tr key={aEmail._id}>
                            <td>{aEmail.email}</td>
                            <td>{aEmail.createdAt && <FormattedDate createdAt={aEmail.createdAt} />}</td>
                            <td>
                                <button 
                                onClick={() => deleteAdmin(aEmail._id, aEmail.email)}
                                className="btn-red"
                                >
                                    Delete
                                    </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({swal}) => (
    <Admins swal={swal} />
))