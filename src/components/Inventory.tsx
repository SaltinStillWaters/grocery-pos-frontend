import React, {
  useEffect,
  useState,
} from "react";
import { API_URL, useChangeTracker, useErrors, type Dto, type Product } from "../utils";
import axios from "axios";
import Header from "./Header";
import { EditableCell } from "./sub-components/EditableCell";

export default function Inventory() {
  const [inventory, setInventory] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchProducts() {
    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/inventories`, {
        withCredentials: true,
      });

      const arranged: Product[] = res.data.data.map(
        ({ product, stock }: any) => ({
          _id: product._id,
          EAN: product.EAN,
          name: product.name,
          price: product.price,
          stock,
        })
      );
      setInventory(arranged);
    } catch (err) {
      setInventory([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const { changes, setChanges, handleChange } = useChangeTracker<Product>();
  const { errors, setErrors, handleError } = useErrors<Product>();

  const [editingCell, setEditingCell] = useState<{
    productId: string;
    property: keyof Product;
  } | null>(null);

  async function handleSave(e: React.FormEvent, idKey: string) {
    e.preventDefault();
    setLoading(true);

    const payload: Dto = {
      updates: Object.entries(changes).map(([_id, changes]) => ({
        product: _id,
        update: { ...changes },
      })),
    };

    try {
      await axios.patch(`${API_URL}/product`, payload, {
        withCredentials: true,
      });
      setChanges({});
      setErrors({});
    } catch (err) {
      handleError(err, payload, idKey);
    } finally {
      fetchProducts();
      setLoading(false);
    }
  }

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setChanges({});
    setErrors({});
    await fetchProducts();
    setLoading(false);
  }

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container mt-5">
      <Header />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Inventory</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary px-4"
            onClick={(e) => handleSave(e, "product")}
            disabled={loading || !Object.keys(changes).length}
          >
            Save
          </button>
          <button
            className="btn btn-outline-secondary px-4"
            onClick={(e) => handleCancel(e)}
            disabled={loading || !Object.keys(changes).length}
          >
            Cancel
          </button>
        </div>
      </div>

      {inventory && inventory.length > 0 ? (
        <div className="table-responsive shadow-sm rounded overflow-hidden">
          <table
            className="table table-hover mb-0"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead className="table-light">
              <tr>
                <th>Barcode</th>
                <th>Product</th>
                <th>Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((x) => {
                const storedChanges = changes[x._id] || {};
                return (
                  <tr key={x._id} className="align-middle">
                    <td>{x.EAN}</td>
                    <td
                      onClick={() =>
                        setEditingCell({ productId: x._id, property: "name" })
                      }
                    >
                      <EditableCell<Product, "name">
                        value={storedChanges?.name ?? x.name}
                        isEditing={
                          editingCell?.productId === x._id &&
                          editingCell.property === "name"
                        }
                        onChange={(e) => handleChange(x._id, x, { name: e })}
                        onEnd={() => setEditingCell(null)}
                        error={errors[x._id]?.["name"]}
                      />
                    </td>
                    <td>{x.stock}</td>
                    <td
                      onClick={() =>
                        setEditingCell({ productId: x._id, property: "price" })
                      }
                    >
                      <EditableCell<Product, "price">
                        value={storedChanges?.price ?? x.price}
                        isEditing={
                          editingCell?.productId === x._id &&
                          editingCell.property === "price"
                        }
                        onChange={(e) => handleChange(x._id, x, { price: e })}
                        onEnd={() => setEditingCell(null)}
                        error={errors[x._id]?.["price"]}
                      />
                    </td>
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
