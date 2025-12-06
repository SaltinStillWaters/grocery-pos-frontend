import axios from "axios";
import { API_URL, type RestockDetails } from "../utils";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";

export default function RestockDetails() {
  const [loading, setLoading] = useState<boolean>(true);
  const [details, setDetails] = useState<RestockDetails[] | null>([]);

  const { id } = useParams();

  async function fetchDetails() {
    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/restocks/details/${id}`, {
        withCredentials: true,
      });

      const arranged = res.data.data.map(
        ({ product, quantity, unitCost }: any) => ({
          product: product.name,
          quantity,
          unitCost,
        })
      );
      setDetails(arranged);
    } catch (err) {
      setDetails([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container mt-5">
      <Header />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Restock Details</h2>
      </div>

      {details && details.length > 0 ? (
        <div className="table-responsive shadow-sm rounded overflow-hidden">
          <table
            className="table table-hover mb-0"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Cost</th>
              </tr>
            </thead>
            <tbody>
              {details.map((x) => {
                return (
                  <tr key={x.product} className="align-middle">
                    <td>{x.product}</td>
                    <td>{x.quantity}</td>
                    <td>{x.unitCost}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted mt-3">No users found.</p>
      )}
    </div>
  );
}
