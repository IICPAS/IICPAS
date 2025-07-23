// src/components/NewsTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE;

const NewsTab = () => {
  const [newsList, setNewsList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    descr: "",
    link: "",
  });

  const fetchNews = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/news`);
      setNewsList(res.data);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.descr || !formData.link) return;
    try {
      await axios.post(`${API}/news`, formData);
      setFormData({ title: "", descr: "", link: "" });
      fetchNews();
    } catch (err) {
      console.error("Error adding news:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/news/${id}`);
      fetchNews();
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem", fontWeight: 600, color: "#045d56" }}>
        📰 View News
      </h2>

      <form
        onSubmit={handleAdd}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 2fr auto",
          gap: "10px",
          marginBottom: "1.5rem",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.descr}
          onChange={(e) => setFormData({ ...formData, descr: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="url"
          placeholder="Link"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          required
          style={inputStyle}
        />
        <button type="submit" style={btnStyle}>
          Add
        </button>
      </form>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: "#eafaf1" }}>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Link</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsList.map((item) => (
              <tr key={item._id}>
                <td style={tdStyle}>{item.title}</td>
                <td style={tdStyle}>{item.descr}</td>
                <td style={tdStyle}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#0f62fe" }}
                  >
                    View Document
                  </a>
                </td>
                <td style={tdStyle}>
                  <span style={statusTag}>approved</span>
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={deleteBtn}
                    title="Delete"
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
            {newsList.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No news found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const btnStyle = {
  padding: "8px 16px",
  backgroundColor: "#0f62fe",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #ccc",
};

const thStyle = {
  padding: "12px",
  border: "1px solid #ccc",
  backgroundColor: "#f3f3f3",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};

const statusTag = {
  backgroundColor: "#d1fae5",
  color: "#065f46",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "500",
};

const deleteBtn = {
  background: "none",
  border: "none",
  color: "#d11a2a",
  fontSize: "18px",
  cursor: "pointer",
};

export default NewsTab;
