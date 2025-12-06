import { useEffect, useState } from "react";
import { API_URL, type Restock } from "../utils";
import axios from "axios";
import Header from "./Header";
import { ClickableRow } from "./sub-components/ClickableRow";

export default function RestockList() {
  const [loading, setLoading] = useState<boolean>(true);
  const [restocks, setRestocks] = useState<Restock[] | null>([]);

  async function fetchRestocks() {
    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/restocks`, {
        withCredentials: true,
      });
      const arranged: Restock[] = res.data.data.map(
        ({ _id, description, restockedBy, totalCost, createdAt }: any) => ({
          _id,
          description,
          restockedBy: restockedBy.name,
          totalCost,
          date: createdAt,
        })
      );
      setRestocks(arranged);
    } catch (err) {
      setRestocks([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRestocks();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container mt-5">
      <Header />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Inventory</h2>
      </div>

      {restocks && restocks.length > 0 ? (
        <div className="table-responsive shadow-sm rounded overflow-hidden">
          <table
            className="table table-hover mb-0"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Restocked By</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {restocks.map((x) => {
                return (
                    <ClickableRow to={`/inventory/restocks/${x._id}`} className="align-middle">
                        <td>{new Date(x.date).toLocaleString()}</td>
                        <td>{x.description}</td>
                        <td>{x.restockedBy}</td>
                        <td>{x.totalCost}</td>
                    </ClickableRow>
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
